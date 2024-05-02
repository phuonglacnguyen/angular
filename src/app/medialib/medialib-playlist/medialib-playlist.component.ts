import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UserService } from './../../services/user.service';
import { MediaService } from './../../services/media.service';
import { Media } from './../../../models/media';

@Component({
    selector: 'app-medialib-playlist',
  templateUrl: './medialib-playlist.component.html',
  styleUrls: ['./medialib-playlist.component.css']
})

export class MedialibPlaylistComponent implements OnInit {
  errors: Array<string> = [];
  @Input() images;
  newMedia: Media;
  constructor( private _userService: UserService, public _mediaService: MediaService ) { }

  ngOnInit() {

  }


}
