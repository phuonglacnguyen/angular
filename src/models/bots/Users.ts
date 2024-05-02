import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { MediaImage } from './../mediaImage';

export class Users {
        constructor(
           public user_lastname: string = "",
           public user_surnames: string = "",
           public user_firstname: string = "",
           public user_email: string = "",
           public user_password: string = "",
           public user_image: string = "userimage",
           public userrole: string = ""
    ) { }
}