import { LanguageType, RegionType } from '../util/Ressources';

import Auth from '../struct/Auth';

import BRNewsManager from '../managers/NewsBRManager';
import STWNewsManager from '../managers/NewsSTWManager';

export interface ClientConfig {
    language: LanguageType,
    region: RegionType
}

export default class Client {
    config: ClientConfig;
    auth: Auth | undefined;

    BRNews: BRNewsManager | undefined;
    STWNews: STWNewsManager | undefined;

    constructor(config: ClientConfig) {
        this.config = config;
    }

    async start() {
        this.auth = new Auth(await Auth.prototype.generateClientCredentials());

        if(this.auth !== undefined) {
            this.BRNews = new BRNewsManager(this.auth, this.config);
            this.STWNews = new STWNewsManager(this.config);

            await this.BRNews.getBrNews();
            await this.STWNews.getStwNews();
        }

        //Refresh Token
        setTimeout(async () => {
            await this.start();
        }, this.auth.expires_in * 1e3);

        //Refresh Data
        setInterval(async () => {
            if(this.auth !== undefined) {
                this.BRNews = new BRNewsManager(this.auth, this.config);
                this.STWNews = new STWNewsManager(this.config);
                await this.BRNews.getBrNews();
                await this.STWNews.getStwNews();
            }
        }, 12e4);
    }
}