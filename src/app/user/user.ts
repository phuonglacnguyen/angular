
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

class MediaVideos {
    constructor(
        public bitrate: number = 0,
        public aspect: string = "",
        public width: number = 0,
        public height: number = 0,
        public container: string = "",
        public codec: string = "",
        public fps: number = 0
    ) { }
}

class MediaAudios {
    constructor(
        public bitrate: number = 0,
        public codec: string = "",
        public sample_rate: string = "",
        public stream: string = "",
        public channels: number = 0
    ) { }
}

export class Audio {
    constructor(
        codec: string = "",
        bitrate: string = "",
        sample_rate: string = "",
        stream: string = "",
        channels: string = ""
    ) { }
}

export class Video {
    constructor(
        bitrate: number = 0,
        aspect: string,
        width: number = 0,
        height: number = 0,
        container: string = "",
        codec: string = "",
    fps: number = 0
        ) { }
}

export class Address {
    constructor(
        public street: string = "",
        public city: string = "",
        public state: string = "",
        public zip: string = "",
        public country: string = "",
        public addressCreated: Date = new Date()
    ) { }
}

export class User {
    constructor(
        public _id: string= "",
        public first_name: string = "",
        public last_name: string = "",
        public gender: string = "M",
        public email: string = "",
        public telephone: string = "",
        public addresses: Array<Address> = new Array<Address>(),
        public images: Array<MediaImage> = new Array<MediaImage>(),
        public password: string = "",
        public dateCreated: Date = new Date(),
        public editable: boolean = false,
        public userRole: string = "",
        public active: boolean = false,
        public logins: number = 0,
        public dateLast: Date = new Date()
    ) { }
}

export class CmsProperty {
    constructor(
        public _id: string = "",
        public title: string = "",
        public pname: string = "",
        public access: string = "",
        public type: string = "",
        public inputtype: string = "",
        public minlength: number = 0,
        public maxlength: number = 0,
        public required: boolean = false,
        public object: string = "",
        public list: string = "",
        public values: string = "",
        public valuesarr = [],
        public labels: string = "",
        public labelsarr = []
    ) { }
}

export class Page {
    constructor(
        public _id: string = "",
        public parent: string = "",
        public title: string = "",
        public content: string = "",
        public visible: boolean = false,
        public secure: boolean = false,
        public dateCreated: Date = new Date(),
        public dateLast: Date = new Date(),
        public createdBy: string = "",
        public editable: boolean = false,
        public treelevel: number = 1,
        public media = new Array<any>(),
        public kids: number = 0,
        public listItem: boolean = false,
        public pickorder: number = 0,
        public properties = new Array<any>(),
        public schemaextend = {},
        public filter = new Array<any>()
    ) { }
}

export class mediaId {
    constructor(
        public _id: string = ""
    ) { }
}

//Array < { type: mongoose.Schema.Types.ObjectId, ref: 'Media' } > = new Array<{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }>(),