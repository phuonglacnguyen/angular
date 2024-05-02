import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { MediaImage } from './../mediaImage';

export class PhotoAlbum {
        constructor(
           public oldid: string = "",
           public file: string = "main"
    ) { }
}