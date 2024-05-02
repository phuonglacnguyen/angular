import { Address } from './address';
import { MediaImage } from './mediaImage';
import { Treeid } from './treeid';

export class User {
    constructor(
        public _id: string = "",
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
        public dateLast: Date = new Date(),
        public favorites: Array<Treeid> = new Array<Treeid>(),
        public faceCoords: string = "",
        public urlHistory: Array<Treeid> = new Array<Treeid>(),
        public movies: Array<Treeid> = new Array<Treeid>(),
        public songs: Array<Treeid> = new Array<Treeid>(),
        public musicAlbum: Array<Treeid> = new Array<Treeid>(),
        public songs_tmp: Array<Treeid> = new Array<Treeid>(),
        public musicAlbum_tmp: Array<Treeid> = new Array<Treeid>(),
        public songs_original: Array<Treeid> = new Array<Treeid>(),
    ) { }
}