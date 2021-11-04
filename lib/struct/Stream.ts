import fs from 'fs';
import path from 'path';
import axios from 'axios';
import zlib from 'zlib';
import { exec } from 'child_process';

const outputFolder = path.join(__dirname, '../final');

import { ClientConfig } from '../client/Client';
import { Resolution, ResolutionsType, LanguageType } from '../util/Ressources';

interface DownloadConfig {
    language: LanguageType,
    resolution: ResolutionsType
}


function blurlToJson(buf: zlib.InputType): any {
    return new Promise((res) => {
        zlib.inflate(buf, (err, decomBuf) => res(JSON.parse(decomBuf.toString('utf8'))));
    })
}
function m3u8ToMp4(videoInput: string, audioInput: string, outputFile: string) {
    return new Promise((res, rej) => {
        exec(`ffmpeg -protocol_whitelist https,file,tcp,tls -i "${videoInput}" -protocol_whitelist https,file,tcp,tls -i "${audioInput}" -c:v copy -c:a aac -y "${outputFile}"`, (err) => {
            res(err);
        });
    })
}

export default class Stream {
    private language: LanguageType;
    streamingEnabled: boolean;
    uid: string;
    name: string;
    fileName: string;
    autoplay: boolean;
    loop: boolean;
    fullScreen: boolean;
    mute: boolean;

    constructor(config: ClientConfig, data: any) {
        this.language = config.language;

        //Stream Object
        this.streamingEnabled = data.streamingEnabled;
        this.uid = data.videoUID;
        this.name = data.videoVideoString;
        this.fileName = `${this.name}.mp4`;
        this.autoplay = data.videoAutoplay;
        this.loop = data.videoLoop;
        this.fullScreen = data.videoFullscreen;
        this.mute = data.videoMute;
    }

    downloadStream(config: DownloadConfig = { language: this.language, resolution: '1280x720'}): Promise<Buffer|Error> {
        return new Promise(async (resolve, reject) => {
            const res = Resolution[config.resolution];
            const url = `https://fortnite-vod.akamaized.net/${this.uid}/master.blurl`;
            try {
                const { data: rawMasterData } = await axios.get(url, { responseType: 'arraybuffer' });
                const masterData = await blurlToJson(Buffer.from(rawMasterData).slice(8));
  
                let mainStream = masterData.playlists.find((p: { type: string; language: string; }) => p.type === 'master' && p.language.toUpperCase() === config.language.toUpperCase());
  
                if(!mainStream) {
                    mainStream = masterData.playlists.find((p: { type: string; language: string; }) => p.type === 'master' && p.language.toUpperCase() === 'EN');
                }

                const baseUrl = mainStream.url.replace(/master_.{2,10}\.m3u8/, '');
                const audioStreamUrl = mainStream.data.match(/variant_[A-Z]{2}_[a-z]{2}_[0-9]{1}.m3u8/sg).pop();
                const audioStream = masterData.playlists.find((p: { type: string; rel_url: any; }) => p.type === 'variant' && p.rel_url === audioStreamUrl);
                fs.writeFileSync(`${outputFolder}/audio.m3u8`, audioStream.data.split(/\n/)
                    .map((l: string) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));

            
                const file = `variant_[A-Z]{2}_[a-z]{2}_${res}.m3u8`
                const regex = new RegExp(file);
                const resolutionStreamUrl = mainStream.data.match(regex)[0];
                const resolutionStream = masterData.playlists.find((p: { type: string; rel_url: any; }) => p.type === 'variant' && p.rel_url === resolutionStreamUrl);
                fs.writeFileSync(`${outputFolder}/content.m3u8`, resolutionStream.data.split(/\n/)
                    .map((l: string) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));
      
                await m3u8ToMp4(`${outputFolder}/content.m3u8`, `${outputFolder}/audio.m3u8`, `${outputFolder}/preview.mp4`);

                const buffer = await fs.readFileSync(path.join(outputFolder, 'preview.mp4'));
                try {
                    fs.unlinkSync(path.join(outputFolder, 'preview.mp4'));
                    fs.unlinkSync(path.join(outputFolder, 'audio.m3u8'));
                    fs.unlinkSync(path.join(outputFolder, 'content.m3u8'));
                }
                catch {}

                return resolve(buffer);
            }
            catch(e) {
                return reject(e);
            }
        })
    }
}