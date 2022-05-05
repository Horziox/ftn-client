import axios from 'axios';
import fs from 'fs';
import path from 'path';

import * as endpoints from '../util/Endpoints';
import { downloadStream } from '../util/Functions';
import { LanguageType, RegionType, Resolution } from '../util/Ressources';
import { DownloadConfig, blurlToJson, m3u8ToMp4, outputFolder } from '../struct/Stream';

import Auth from '../struct/Auth';
import BRNews from '../struct/NewsBR';
import STWNews from '../struct/NewsSTW';

export interface ClientConfig {
    language: LanguageType,
    region: RegionType
}

export default class Client {
    config: ClientConfig;
    auth: Auth | undefined;

    constructor(config?: ClientConfig) {
        this.config = {
            language: 'en',
            region: 'EU',
            
            // Apply custom config
            ...config
        };
    }

    async start() {
        this.auth = new Auth(await Auth.prototype.generateClientCredentials());

        //Refresh Token
        setInterval(async () => {
            await this.start();
        }, this.auth.expires_in * 1e3);
    }


    getBrNews(config: ClientConfig = { language: this.config.language, region: this.config.region }): Promise<BRNews[]> {
        return new Promise(async resolve => {
            await axios({
                method: 'POST',
                url: 'https://prm-dialogue-public-api-prod.edea.live.use1a.on.epicgames.com/api/v1/fortnite-br/surfaces/motd/target',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': this.auth?.token_header
                },
                data: {
                    "platform": "Windows",
                    "language": config.language,
                    "country": config.language.toUpperCase(),
                    "serverRegion": config.region,
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
                resolve(result);
            })
        })
    }

    getStwNews(language: LanguageType = this.config.language): Promise<{ lastModified: Date, news: STWNews[] }> {
        return new Promise(async resolve => {
            let result = [];
            const data = await endpoints.getFortniteContent({ language, extendsURL: '/savetheworldnews' });
            for(const thisNews of data.news.messages) {
                result.push(new STWNews(thisNews));
            }

            resolve({
                lastModified: new Date(data.lastModified),
                news: result
            });
        })
    }


    downloadStream(id: string, config: DownloadConfig = { language: this.config.language, resolution: '1280x720'}): Promise<Buffer> {
        return new Promise(async (resolve) => {
            resolve(await downloadStream(id, config));
        });
    }
}