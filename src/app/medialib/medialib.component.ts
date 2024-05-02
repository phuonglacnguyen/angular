import {
  Component,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserService } from './../services/user.service';
import { MediaService } from './../services/media.service';
import { CmsService } from './../services/cms.service';
import { Media } from './../../models/media';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-medialib',
  templateUrl: './medialib.component.html',
  styleUrls: ['./medialib.component.css'],
})
export class MedialibComponent implements OnInit {
  public images: Array<any> = [];
  public newMedia: any;
  public clicked = 'tab_1';
  public MediaSelected: Media = new Media();
  @Output() newMediaEvent = new EventEmitter();
  @Output() playlistReady = new EventEmitter();
  constructor(
    public _mediaService: MediaService,
    public _messageService: MessageService
  ) {}
  @ViewChild('videosource') videosource;
  @ViewChild('file') file;

  ngOnInit() {
    document.title = 'Media library Management Page';
    this._mediaService.logStatusChange('active');
  }

  getImagezlist(data) {
    console.log(data);
    this._mediaService.images = data;
    if (this.images.length > 0) {
      this.getMediaById(this.images[0]._id);
    }
  }

  onFileChange(event) {}

  gMediaSelected(media) {
    this.MediaSelected = media;
  }

  getImageData() {
    this._mediaService.getImages().subscribe((data) => (this.newMedia = data));
  }

  getImageDData() {
    //this._mediaService.getImages().subscribe((data) => this.getImagelist(data));
  }

  getImagelist(data) {
    this._mediaService.setImages(data);
    if (this._mediaService.images.length > 0) {
      this.getMediaById(this._mediaService.images[0]._id);
      if (document.getElementById('video_mp4'))
        document
          .getElementById('video_mp4')
          .setAttribute(
            'src',
            '/api/assets/media/' +
              this._mediaService.images[0]._id +
              '/main.mp4'
          );
    }
  }

  getMediaById(id) {
    this._mediaService
      .getMedia(id)
      .subscribe((data) => this.RetMediaById(data));
  }

  RetMediaById(data) {
    this._mediaService.setMediaSelected(data);
  }

  settab(tabt, tid) {
    this.clicked = tid;
    document.getElementById('tab_1').classList.add('hidden');
    document.getElementById('tab_2').classList.add('hidden');
    document.getElementById('tab_3').classList.add('hidden');
    document.getElementById('tab_4').classList.add('hidden');

    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('active');
    myButtonClasses.remove('hidden');
  }

  delete_upload_file(file) {
    this._mediaService
      .destroyMedia(file)
      .subscribe((status) => this.getImageData());
  }
}
