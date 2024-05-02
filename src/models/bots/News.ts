import { Address } from './../address';
import { VideoGenre } from './../videogenre';
import { Country } from './../country';
import { Treeid } from './../treeid';
import { MediaImage } from './../mediaImage';

export class News {
  constructor(
    public content: string = '',
    public ISO: string = '',
    public birthday: Date = new Date(),
    public dateandtime: string = '',
    public datepublish: string = '',
    public filecategory: string[] = [
      'Technology=>5bd98fe70737ae272c7aa6c0',
      'Nature=>5bd990890737ae272c7aa6c1',
      'Economy=>5bd9910d0737ae272c7aa6c2',
    ],
    public editable: boolean = false,
    public file: string = 'main',
    public fileextension: string = '',
    public filesiz: number = 0,
    public genres: string = '',
    public height: number = 0,
    public image: string = 'image',
    public intro: string = '',
    public keywords: string = '',
    public logo: string = 'logo',
    public length: number = 0,
    public gender: string = '',
    public Slider: number = 0,
    public email: string = '',
    public subtitles: Array<Country> = new Array<Country>(),
    public photopersons: Array<Treeid> = new Array<Treeid>(),
    public addresses: Array<Address> = new Array<Address>()
  ) {}
}
