export default class STWNews {
    title: string;
    adspace: string;
    body: string;
    image: string;

    constructor(data: any) {
        this.title = data.title;
        this.adspace = data.adspace;
        this.body = data.body;
        this.image = data.image;
    }
}