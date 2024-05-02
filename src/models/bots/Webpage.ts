import { Address } from './../address';
import { MediaImage } from './../mediaImage';

export class Webpage {
        constructor(
           private intro: string = "",
           public content: string = "",
           public keywords: string = "",
           public image: string = ""
    ) { }
}