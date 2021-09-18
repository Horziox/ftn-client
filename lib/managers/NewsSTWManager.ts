import { getFortniteContent } from '../util/Endpoints';

import { ClientConfig } from '../client/Client';
import STWNews from '../struct/NewsSTW';

export default class STWNewsManager {
    private config: ClientConfig;

    id: string | null;
    activeDate: Date | null;
    lastModified: Date | null;

    news: STWNews[];

    constructor(config: ClientConfig) {
        this.config = config;

        this.news = [];
        this.id = null;
        this.activeDate = null;
        this.lastModified = null;
    }

    getStwNews(): Promise<STWNews[]> {
        return new Promise(async resolve => {
            let result = [];
            const data = await getFortniteContent({ language: this.config.language, extendsURL: '/savetheworldnews' });
            for(const thisNews of data.news.messages) {
                result.push(new STWNews(this.config, thisNews));
            }

            this.news = result;
            this.id = data.news["jcr:baseVersion"];
            this.activeDate = data.news["_activeDate"];
            this.lastModified = data.news.lastModified;
        })
    }
}