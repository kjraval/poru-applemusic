import { fetch, Request } from "undici";
import { Plugin, Poru, ResolveOptions, Track } from "poru";
const baseURL =
    /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/;

const accessTokenRegex = /<meta name="desktop-music-app\/config\/environment" content="(.*?)">/


export interface AppleMusicOptions {
    playlistLimit?: number;
    albumLimit?: number;
    artistLimit?: number;
    searchMarket: string;
}


export class AppleMusic extends Plugin {
    public options: AppleMusicOptions;
    private token: string;
    public poru: Poru;
    public url:string;
    constructor(options: AppleMusicOptions) {
        super("AppleMusic");
        this.options = options;
        this.token = null
        this.url = `https://amp-api.music.apple.com/v1/catalog/${this.options.searchMarket}`;

    }

    check(url: string): boolean {
        return baseURL.test(url)
    }

    public async requestToken(): Promise<void> {
        try {
            let req = await fetch("https://music.apple.com/us/browse");
            let json = await req.text();
            let config = accessTokenRegex.exec(json);

            let key = (config = JSON.parse(decodeURIComponent(config[1])));
            let { token } = key?.MEDIA_API;

            if (!token) throw new Error("[Poru Apple Music] No Apple music api key available");

            this.token = `Bearer ${token}`;
        } catch (e) {
            if (e.status === 400) {
                throw new Error(`[Poru Apple Music]:${e.message}`);
            }
        }
    }


    async requestData(param:string) {
        if (!this.token) await this.requestToken();
    
        let req = await fetch(`${this.url}${param}`, {
          headers: {
            Authorization: `${this.token}`,
            origin: "https://music.apple.com",
          },
        });
    
        let body = await req.json();
    
        return body;
      }


      async resolve(url:string) {
        let [, type, id] = await baseURL.exec(url);
    
        switch (type) {
          case "playlist": {
      //      return this.fetchPlaylist(url);
          }
          case "album": {
      //      return this.fetchAlbum(url);
          }
          case "artist": {
     //       return this.fetchArtist(url);
          }
        }
      }

}
