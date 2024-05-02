import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { MediaImage } from './../mediaImage';

export class PhoneAlbum {
        constructor(
           public dateandtime: Date = new Date(),
           public file: string = "main"
    ) { }
}