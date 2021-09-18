import axios from 'axios';
import { URLSearchParams } from 'url';
import { Tokens } from '../util/Ressources';

interface AuthResult {
    access_token: string;
    expires_in: number;
    expires_at: Date;
    token_type: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
}

export default class Auth {
    access_token: string;
    expires_in: number;
    expires_at: Date;
    token_type: string;
    client_id: string;
    internal_client: boolean;
    client_service: string;
    token_header: string;

    constructor(data: AuthResult) {
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.expires_at = data.expires_at;
        this.token_type = data.token_type;
        this.client_id = data.client_id;
        this.internal_client = data.internal_client;
        this.client_service = data.client_service;
        this.token_header = `${this.token_type} ${this.access_token}`;
    }

    generateClientCredentials(): Promise<AuthResult> {
        return new Promise(async resolve => {
            const params: URLSearchParams = new URLSearchParams()
            params.append('grant_type', 'client_credentials')
            params.append('token_type', 'eg1')

            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${Tokens.fortnitePCGameClient}`
                },
            }

            await axios.post('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token', params, config)
            .then(res => resolve(res.data))
        })
    }
}