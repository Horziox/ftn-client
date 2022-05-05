import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { Resolution } from '../util/Ressources';
import { DownloadConfig, blurlToJson, m3u8ToMp4, outputFolder } from '../struct/Stream';

export function downloadStream(id: string, config: DownloadConfig): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
        const res = Resolution[config.resolution];
        const url = `https://fortnite-vod.akamaized.net/${id}/master.blurl`;
        try {
            const { data: rawMasterData } = await axios.get(url, { responseType: 'arraybuffer' });
            const masterData = await blurlToJson(Buffer.from(rawMasterData).slice(8));

            let mainStream = masterData.playlists.find((p: { type: string; language: string; }) => p.type === 'master' && p.language.toUpperCase() === config.language.toUpperCase());

            if(!mainStream) {
                mainStream = masterData.playlists.find((p: { type: string; language: string; }) => p.type === 'master' && p.language === 'en');
            }

            const baseUrl = mainStream.url.replace(/master_.{2,10}\.m3u8/, '');
            const audioStreamUrl = mainStream.data.match(/variant_[a-zA-Z]{2}_[a-zA-Z]{2}_[0-9]{1}.m3u8/sg).pop();
            const audioStream = masterData.playlists.find((p: { type: string; rel_url: any; }) => p.type === 'variant' && p.rel_url === audioStreamUrl);

            fs.writeFileSync(`${outputFolder}/audio.m3u8`, audioStream.data.split(/\n/)
                .map((l: string) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));

        
            const file = `variant_[a-zA-Z]{2}_[a-zA-Z]{2}_${res}.m3u8`
            const regex = new RegExp(file);
            const resolutionStreamUrl = mainStream.data.match(regex)[0];
            const resolutionStream = masterData.playlists.find((p: { type: string; rel_url: any; }) => p.type === 'variant' && p.rel_url === resolutionStreamUrl);
            fs.writeFileSync(`${outputFolder}/content.m3u8`, resolutionStream.data.split(/\n/)
                .map((l: string) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));
  
            await m3u8ToMp4(`${outputFolder}/content.m3u8`, `${outputFolder}/audio.m3u8`, `${outputFolder}/preview.mp4`);

            const buffer = fs.readFileSync(path.join(outputFolder, 'preview.mp4'));
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