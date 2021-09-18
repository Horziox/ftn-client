const Client = require("../dist/index");

const client = new Client({ languague: 'fr' });
client.start().then(() => console.log(client.BRNews))