export default class Blog {
    id: string;
    gridTitle: string;
    title: string;
    author: string;
    
    image: string;
    shareImage: string;
    trendingImage: string;
    
    content: string;
    urlPattern: string;
    url: string;
    slug: string;
    prevSlug: string;
    metaTags: string;
    date: Date;

    constructor(data: any) {
        this.id = data["_id"];
        this.gridTitle = data?.gridTitle || null;
        this.title = data.title;
        this.author = data.author;
        
        this.image = data.image;
        this.shareImage = data.shareImage || null;
        this.trendingImage = data.trendingImage || null;

        this.content = data.content;
        this.urlPattern = data.urlPattern;
        this.url = `https://www.epicgames.com/fortnite${this.urlPattern}`;
        this.slug = data.slug;
        this.prevSlug = data.prevSlug;
        this.metaTags = data["_metaTags"];
        this.date = new Date(data.date);
    }
}