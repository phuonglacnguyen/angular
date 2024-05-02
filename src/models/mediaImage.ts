export class MediaImage {
    constructor(
        public mediaPath: string = "",
        public mediaTitle: string = "",
        public lastModified: Date = new Date(),
        public mediaType: string = "",
        public mediaExtension: string = "",
        public imageCreated: Date = new Date(),
        public mediaWidth: number = 0,
        public mediaHeight: number = 0,
        public mediaFilesize: string = ""
    ) { }
}