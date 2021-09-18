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

        this.BRNews = new BRNewsManager(this.auth, this.config);
        this.STWNews = new STWNewsManager(this.config);

        await this.BRNews.getBrNews();
        await this.STWNews.getStwNews();
    }
}