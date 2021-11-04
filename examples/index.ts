import Client from 'ftn-client'

const client = new Client({ language: 'fr', region: 'EU' });
client.start().then(() => console.log(client.BRNews))