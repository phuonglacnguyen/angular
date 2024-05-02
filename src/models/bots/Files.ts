import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { MediaImage } from './../mediaImage';

export class Files {
        constructor(
           public Category = ["Technology=>5bd98fe70737ae272c7aa6c0","Nature=>5bd990890737ae272c7aa6c1","Economy=>5bd9910d0737ae272c7aa6c2"],
           public Album = ["Content=>5bd98f6c0737ae272c7aa6be","Public=>5bd98f860737ae272c7aa6bf"]
    ) { }
}