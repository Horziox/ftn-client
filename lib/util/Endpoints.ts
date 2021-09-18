import axios from 'axios';
import { LanguageType } from './Ressources';

export function getFortniteContent(config: { language: LanguageType, extendsURL: string } = { language: 'en', extendsURL: '' }): Promise<any> {
    return new Promise(async resolve => {
        await axios({
            method: 'GET',
            url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game' + config.extendsURL,
            headers: {
                'Accept-Language': config.language
            }
        })
        .then(res => resolve(res.data))
    })
}