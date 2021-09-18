import { ClientConfig } from "../client/Client";
import Stream from "./Stream";

export default class BRNews {
    private config: ClientConfig;
    id: string;
    contentSchemaName: string;
    tabTitleOverride: string;
    tileImage: string;
    image: string;
    title: string;
    body: string;
    buttonTextOverride: string;
    entryType: string;
    stream: Stream | null;

    constructor(config: ClientConfig, data: any) {
        this.config = config;

        //New Object
        this.id = data.contentId;
        this.contentSchemaName = data.contentSchemaName;
        this.tabTitleOverride = data.contentFields.tabTitleOverride;
        this.tileImage = data.contentFields.tileImage[0].url;
        this.image = data.contentFields.image[0].url;
        this.title = data.contentFields.title;
        this.body = data.contentFields.body;
        this.buttonTextOverride = data.contentFields.buttonTextOverride;
        this.entryType = data.contentFields.entryType;
        this.stream = data.contentFields.videoUID !== undefined ? new Stream(this.config, data.contentFields) : null;
    }
}