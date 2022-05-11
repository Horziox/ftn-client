const { Client } = require('../dist');

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

    // You can pass some parameters in functions to change the language, offset and max return blogs
    // DEFAULT: language = client language, offset = 0 & max = 10
    const blogs = await client.getBlogs({ max: 3 });
    const competitiveBlogs = await client.getCompetitiveBlogs({ language: 'en' });

})()