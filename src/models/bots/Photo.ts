import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { MediaImage } from './../mediaImage';
import { TreeId } from './../treeid';

export class Photo {
        constructor(
           public oldid: string = "",
           public file: string = "main",
           public filesiz: number = 0,
           public photoalbum: string = "",
           public photopersons: Array<TreeId> = new Array<TreeId>() ,
           public photocamera: string = "",
           public photocameramodel: string = "",
           public photocameralens: string = "",
           public photoaperture: string = "",
           public photoexposuretime: string = "",
           public photoiso: string = "",
           public datepublish: Date = new Date()
    ) { }
}