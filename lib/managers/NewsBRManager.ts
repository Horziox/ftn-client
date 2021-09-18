import axios from 'axios';

import { ClientConfig } from '../client/Client';
import Auth from '../struct/Auth';
import BRNews from '../struct/NewsBR';

export default class BRNewsManager {
    private auth: Auth;
    private config: ClientConfig;
    ids: Set<string>;
    news: BRNews[];

    constructor(auth: Auth, config: ClientConfig) {
        this.auth = auth;
        this.config = config;

        this.ids = new Set();
        this.news = []
    }

    getBrNews(): Promise<BRNews[]> {
        return new Promise(async resolve => {
            await axios({
                method: 'POST',
                url: 'https://prm-dialogue-public-api-prod.edea.live.use1a.on.epicgames.com/api/v1/fortnite-br/surfaces/motd/target',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': this.auth.token_header
                },
                data: {
                    "platform": "Windows",
                    "language": this.config.language,
                    "country": this.config.language.toUpperCase(),
                    "serverRegion": this.config.region,
                    "subscription": true,
                    "battlepass": true,
                    "battlepassLevel": 100
                }
            })
            .then(res => {
                let result = [];
                let ids = [];
                for(const BRNew of res.data.contentItems) {
                    result.push(new BRNews(this.config, BRNew));
                    ids.push(BRNew?.contentId);
                }

                this.news = result;
                this.ids = new Set(ids);
                resolve(this.news);
            })
        })
    }
}