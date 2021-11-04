# Fortnite Client

## Usage Example
Download News Streams
```typescript
import Client from '..path/to/index';
import fs from 'fs';

const client = new Client({
  language: 'en', //default language
  region: 'EU' //default region
})

(async () => {
  //Start the client
  await client.start()
  
  //Get BR News
  const BRnews = client.BRNews;
  for(const thisNew of BRnews.news) {
    if(thisNew.stream !== null) {
      //Download MP4 Buffer
      //Default client language and 720p resolution
      const video = await thisNew.stream.downloadStream();
      
      //Create MP4 file
      fs.writeFileSync(thisNew.stream.fileName, video);
    }
  }
})()
```

Get token
```typescript
import Client from '..path/to/index';

const client = new Client({
  language: 'en', //default language
  region: 'EU' //default region
})

(async () => {
  //Start the client
  await client.start()
  
  //Get client Auth
  const auth = client.auth;
  
  //Log the EG1 token
  console.log(auth.access_token);
})()
```

## Documentation
Documentation available soon...

## Contact
- Discord `Horziox#0007`
- [EpicGames App Development](https://discord.com/invite/j5xZ54RJvR) *Community Discord Server*
- [Kevin HomeBase](https://discord.com/invite/7XyNM4p) *Personnal Discord server*
