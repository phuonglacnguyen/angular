import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { Treeid } from './../treeid';
import { MediaImage } from './../mediaImage';

export class Videos {
        constructor(
           public imdb: string = "",
           public imdbrating: string = "",
           public subtitles: Array<Country> = new Array<Country>() ,
           public subtitlenl: string = "NL",
           public subtitlegb: string = "GB",
           public videocodec: string = "",
           public datepublish: Date = new Date(),
           public file: string = "main",
           public thumb: string = "",
           public length: number = 0,
           public fileextension: string = "",
           public filesiz: number = 0,
           public videoheight: number = 0,
           public videowidth: number = 0,
           public audiocodec: string = "",
           public plot: string = "",
           public genres: string = "",
           public director: string = "",
           public writer: string = "",
           public actors: string = "",
           public country: string = "",
           public awards: string = "",
           public image: string = "image",
           public photopersons: Array<Treeid> = new Array<Treeid>() 
    ) { }}