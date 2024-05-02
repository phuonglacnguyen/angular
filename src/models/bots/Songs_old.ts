import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { TreeId } from './../treeid';
import { MediaImage } from './../mediaImage';

export class Songs {
        constructor(
           public url: string = "",
           public artist: string = "",
           public filesiz: number = 0,
           public musicgenre: string = "",
           public length: number = 0,
           public track: number = 0,
           public audiocodec: string = "",
           public audiobitrate: string = "",
           public audiosample: number = 0,
           public year: string = ""
    ) { }}