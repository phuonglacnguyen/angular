import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { TreeId } from './../treeid';
import { MediaImage } from './../mediaImage';

export class MusicAlbum {
        constructor(
           public musicgenre: string = "",
           public musicartists: string = "",
           public year: string = "",
           public file: string = "main",
           public oldid: string = "",
           public url: string = ""
    ) { }}