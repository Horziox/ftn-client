import { ClientConfig } from "../client/Client";

export default class STWNews {
    private config: ClientConfig;
    title: string;
    adspace: string;
    body: string;
    image: string;

    constructor(config: ClientConfig, data: any) {
        this.config = config;

        //New Object
        this.title = data.title;
        this.adspace = data.adspace;
        this.body = data.body;
        this.image = data.image;
    }
}