# Fortnite Client

#### :warning: This repo is in alpha phase !

Install: `npm install ftn-client`

### Infos

The main purpose of this library is to provide the basic services of Fortnite, without having Epic account or a dedicated token for your client like [fnbr.js](https://github.com/fnbrjs/fnbr.js)

This library is therefore less complete but suddenly lighter to perform basic tasks or complete some tests

## Usage Example

Download News Streams (TS)
```typescript
import { Client } from 'ftn-client';
import fs from 'fs';

const client = new Client({
  language: 'en', // default language
  region: 'EU' // default region
})

(async () => {
  // Start the client
  await client.start();
  
  // Get BR News
  const BRnews = client.BRNews;
  for(const thisNew of BRnews.news) {
    if(thisNew.stream !== null) {
      // Download MP4 Buffer
      // Default client language and 720p resolution
      const video = await thisNew.stream.downloadStream();
      
      // Create MP4 file
      fs.writeFileSync(thisNew.stream.fileName, video);
    }
  }
})()
```

Get token (TS)
```typescript
import { Client } from 'ftn-client';

const client = new Client();

(async () => {
  // Start the client
  await client.start();
  
  // Get client Auth an log the EG1 token
  const auth = client.auth;
  console.log(auth.access_token);
})()
```

*A more detailed example in javascript is present in the examples folder*

## Documentation
Documentation available soon...

## Contact
- Discord [Horziox#0007](https://discord.com/users/340212760870649866)
- [EpicGames App Development](https://discord.com/invite/j5xZ54RJvR) *Community Discord Server*
- [Kevin HomeBase](https://discord.com/invite/7XyNM4p) *Personnal Discord server*
