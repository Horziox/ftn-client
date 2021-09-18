const path = require('path');
const { get } = require('axios');
const zlib = require('zlib');
const { exec } = require('child_process');
const { writeFileSync } = require('fs');

const outputFolder = path.join(__dirname, '../final');

function blurlToJson(buf) {
    return new Promise((res) => {
        zlib.inflate(buf, (err, decomBuf) => res(JSON.parse(decomBuf.toString('utf8'))));
    })
}
function m3u8ToMp4(videoInput, audioInput, outputFile) {
    return new Promise((res, rej) => {
        exec(`ffmpeg -protocol_whitelist https,file,tcp,tls -i "${videoInput}" -protocol_whitelist https,file,tcp,tls -i "${audioInput}" -c:v copy -c:a aac -y "${outputFile}"`, (err) => {
            res(err);
        });
    })
}

function generateStream(id, lang, resolution) {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://fortnite-vod.akamaized.net/${id}/master.blurl`;
            const { data: rawMasterData } = await get(url, { responseType: 'arraybuffer' });
            const masterData = await blurlToJson(Buffer.from(rawMasterData).slice(8));
  
            let mainStream = masterData.playlists.find((p) => p.type === 'master' && p.language === lang);
  
            if(!mainStream) {
                lang = 'en'
                mainStream = masterData.playlists.find((p) => p.type === 'master' && p.language === lang);
            }

            const baseUrl = mainStream.url.replace(/master_.{2,10}\.m3u8/, '')
            const audioStreamUrl = mainStream.data.match(/variant_[a-z]{2}_[A-Z]{2}_[0-9]{1}.m3u8/sg).pop();
            const audioStream = masterData.playlists.find((p) => p.type === 'variant' && p.rel_url === audioStreamUrl);
            writeFileSync(`${outputFolder}/audio.m3u8`, audioStream.data.split(/\n/)
                .map((l) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));

            resolution = resolution || 2;
            const file = `variant_[a-z]{2}_[A-Z]{2}_${resolution}.m3u8`
            const regex = new RegExp(file);
            const resolutionStreamUrl = mainStream.data.match(regex)[0];
            const resolutionStream = masterData.playlists.find((p) => p.type === 'variant' && p.rel_url === resolutionStreamUrl);
            writeFileSync(`${outputFolder}/content.m3u8`, resolutionStream.data.split(/\n/)
                .map((l) => (l.startsWith('#') || !l ? l : `${baseUrl}${l}`)).join('\n').replace('init_', `${baseUrl}init_`));
      
            await m3u8ToMp4(`${outputFolder}/content.m3u8`, `${outputFolder}/audio.m3u8`, `${outputFolder}/preview.mp4`);

            return resolve(path.join(outputFolder, 'preview.mp4'))
        }
        catch(e) {
            return reject(e)
        }
    })
}

module.exports = {
    generateStream,
    blurlToJson
}