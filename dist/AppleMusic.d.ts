import { Plugin } from "poru";
export interface AppleMusicOptions {
    playlistLimit?: number;
    albumLimit?: number;
    artistLimit?: number;
    searchMarket?: string;
}
export declare class AppleMusic extends Plugin {
    options: AppleMusicOptions;
    constructor(options: AppleMusicOptions);
}
