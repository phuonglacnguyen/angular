import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { TreeId } from './../treeid';
import { MediaImage } from './../mediaImage';

export class VideoAlbum {
        constructor(
           public datepublish: Date = new Date(),
           public file: string = "main",
           public image: string = "image",
           public thumb: string = "",
           public videocodec: string = ""
    ) { }}