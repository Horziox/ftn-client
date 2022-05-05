import path from 'path';
import zlib from 'zlib';
import { exec } from 'child_process';

import { downloadStream } from '../util/Functions';
import { ResolutionsType, LanguageType } from '../util/Ressources';

export const outputFolder = path.join(__dirname, '../final');

export interface DownloadConfig {
    language: LanguageType,
    resolution: ResolutionsType
}


export function blurlToJson(buf: zlib.InputType): any {
    return new Promise((res) => {
        zlib.inflate(buf, (err, decomBuf) => res(JSON.parse(decomBuf.toString('utf8'))));
    })
}
export function m3u8ToMp4(videoInput: string, audioInput: string, outputFile: string) {
    return new Promise((res, rej) => {
        exec(`ffmpeg -protocol_whitelist https,file,tcp,tls -i "${videoInput}" -protocol_whitelist https,file,tcp,tls -i "${audioInput}" -c:v copy -c:a aac "${outputFile}"`, (err) => {
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

    constructor(config: { language: LanguageType }, data: any) {
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

    downloadStream(config: DownloadConfig = { language: this.language, resolution: '1280x720'}): Promise<Buffer> {
        return new Promise(async (resolve) => {
            resolve(await downloadStream(this.uid, config));
        })
    }
}