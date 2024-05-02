import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { TreeId } from './../treeid';
import { MediaImage } from './../mediaImage';

export class Songs {
        constructor(
           public url: string = "",
           public filesiz: number = 0,
           public musicgenre: string = ""
    ) { }}