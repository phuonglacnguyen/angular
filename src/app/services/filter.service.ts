//import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter, ViewChild } from '@angular/core';

//import { Http, Headers, RequestOptions } from '@angular/http';
import { User, Address } from './../user/user';
//import { Injectable, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs';
import {
  FormGroupName,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  EmailValidator,
  AbstractControl,
} from '@angular/forms';
import { MessageService } from './../services/message.service';
import { Page } from './../../models/page';

import { CmsObject } from './../../models/object';
import { CmsProperty } from './../../models/property';
import { News } from './../../models/bots/News';
import { Users } from './../../models/bots/Users';
//import { Page } from './../../models/page';
import { DomSanitizer } from '@angular/platform-browser';
//import { mediaId } from './../../models/mediaId';
import { CmsPipe } from './../../models/cmspipe';
import { Media } from './../../models/media';

@Injectable()
export class FilterService {
  //messages: Array<any> = [];
  //filterStatus = false;

  constructor() {}

  filterSelected: any;
  filterText = '';
  filterFirstletter = '';
  cmsFilterVisible = 0;
  cmsFilterSecure = 0;
  filterParent = '';
  filterMediaList = '';
  filterKidsList = '';
  filterPropertiesList = '';
  filterFilterList = '';
  filterGenre = '';
  filterPersons = '';
  filterRatings = '0';
  filterFavorites = '';
  filterShf: any = 30;
  cmsFilterBoolean: any;
  cmsFilters = [];
  cmsFiltersArr = [];
  cmsFilterstxt: any;
  musicGenre = '';
  musicAlbumGenre = '';
  letters = new Array(
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  );
  //myJSON: any;
  //vilvar: any;
  vari = [];
  filterUpdated = new EventEmitter<any>();
  vilvar = {}; // "visible": true, "secure": true

  //setFilterSelected(var) {
  //    this.filterUpdated.emit(var);
  //}
}
