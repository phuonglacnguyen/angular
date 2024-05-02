export class Media {
    constructor(
         public _id: string = "",
         public encoding: string = "",
         public mimetype: string = "",
         public imgfilepath: string = "",
         public filepath: string = "",
         public filename: string = "",
         public filesize: number = 0,
         public title: string = "",
         public artist: string = "",
         public album: string = "",
         public track: number = 0,
         public date: Date = new Date(),
         public duration: number = 0,
         public extension: string = "",
         public tags: string = "",
         public dateCreated: string = "",
         public lastModified: string = "",
         public createdBy: string = "",
         public filetype: string = "",
         public video = new Array<any>(),
         public audio = new Array<any>(),
         public schemaextend = []
    ) { }
}