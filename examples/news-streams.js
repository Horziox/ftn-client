const { Client } = require('../dist');
const { writeFileSync } = require('fs');

// TS types are provided !

// Declare our client with language parameter
// You can provide a region parameter too
// DEFAULT: language = en, region = EU
const client = new Client({
    language: 'fr'
});

(async () => {

    // Always start the client before use it !
    await client.start();

    // You can pass some parameters in functions to change the language
    const news = await client.getBrNews();
    const stw = await client.getStwNews('de');

    // Download stream data with the uid and convert it in buffer
    // You can change the language or resolution
    // DEFAULT: language = client language, resolution = '1280x720'
    const data = await client.downloadStream("LwftzrskCAwXgBKFzw", { resolution: '1920x1080' });
    // And create mp4 file with buffer (example)
    writeFileSync("test.mp4", data);

    // Some BR News have videos, you can download directly in the new without the uid
    // If a new doesn't have stream: new.stream = null (default)
    for(const actualNew of news) {
        if(actualNew.stream !== null) {
            const stream = actualNew.stream;
            const streamData = await stream.downloadStream();
            // stream.fileName get the official name of the video with the .mp4 at the end
            writeFileSync(stream.fileName, streamData);
        }
    }

})()