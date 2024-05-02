import {
  ViewChild,
  Component,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { UserService } from './../../services/user.service';
import { MediaService } from './../../services/media.service';
import { CmsService } from './../../services/cms.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Media } from './../../../models/media';
import { PagerService } from './../../services/pagination.service';
import { MessageService } from './../../services/message.service';

@Component({
  selector: 'app-medialib-list',
  templateUrl: './medialib-list.component.html',
  styleUrls: ['./medialib-list.component.css'],
})
export class MedialibListComponent {
  @Input() images;
  newMedia: Media;
  pager;
  pagedItems;
  allItems;
  jsonres;
  @Input() MediaSelected;
  @ViewChild('btnPause') btnPause;
  @Output() getMediaList = new EventEmitter();
  @Output() getMediaSelected = new EventEmitter();
  @ViewChild('videoplayer') videoplayer;
  constructor(
    public _cmsService: CmsService,
    private _router: Router,
    public fb: FormBuilder,
    public _mediaService: MediaService,
    private pagerService: PagerService,
    public _messageService: MessageService
  ) {
    let dhis = this;
    // setTimeout(function () {
    //   dhis._mediaService.setPage(0);
    // }, 2000);
  }

  close_all_menus(blok) {
    document.getElementById('mediaInfo_' + blok._id).style.display = 'none';
    document.getElementById('mediaFav_' + blok._id).style.display = 'none';
    document.getElementById('mediaMenu_' + blok._id).style.display = 'none';
  }

  getImageDData() {
    this._mediaService.getImages().subscribe((data) => this.getImagelist(data));
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

  closeJson() {
    this.jsonres = '';
    document.getElementById('closeJson').classList.add('hidden');
  }

  showJson(obj) {
    this.jsonres = obj;
    document.getElementById('closeJson').classList.remove('hidden');
    //document.getElementById('jsonres').innerHTML = obj;
  }

  media_click(media: Media) {
    this._mediaService
      .getMedia(media)
      .subscribe((data) => this.setActive(data));
  }

  toggleFileOption(lstname, media, catId, index) {
    var nid = 'lstCatIndexSub' + media._id + '_' + catId;
    if (media.schemaextend[0][lstname].indexOf(catId) == -1) {
      var ntet = media.schemaextend[0][lstname];
      media.schemaextend[0][lstname].push(catId);
      this._mediaService.fileOptionAdd(media, catId);
      document.getElementById(nid).classList.add('txt_green');
    } else {
      var ntet = media.schemaextend[0][lstname];
      if (media.schemaextend[0][lstname].length == 1) {
        media.schemaextend[0][lstname] = [];
      } else {
        media.schemaextend[0][lstname].splice(index, 1);
      }
      this._mediaService.fileOptionDelete(media, catId);
      document.getElementById(nid).classList.remove('txt_green');
    }
  }

  setActive(media: any) {
    var vall = document.getElementById('blokdiv_' + media._id);
    if (vall.getAttribute('class') == 'cmsrow blok') {
      vall.classList.add('active');
    } else {
      vall.classList.remove('active');
    }
    var a = this._cmsService.pageSelected.media.indexOf(media._id);
    if (a == -1) {
      this._cmsService.PageSelectedAddMediaId = media._id;
      this._cmsService.pageSelected.media.push(media._id);
      this._cmsService.GetPageSelectedAddMedia();
    }
  }

  playbuttons_on() {
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4 text_red';
  }

  pausebuttons_on() {
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4 text_red';
  }

  media_menu(media: Media) {
    var infoDisplay = document.getElementById('mediaMenu_' + media._id).style
      .display;
    var infokids = document.getElementsByClassName('mediaMenu_kid');
    for (var i = 0, len = infokids.length; i < len; i++) {
      document.getElementById(infokids[i].id).style.display = 'none';
    }

    if (infoDisplay == 'block') {
      document.getElementById('mediaInfo_' + media._id).style.display = 'none';
    } else {
      document.getElementById('mediaMenu_' + media._id).style.display = 'block';
    }
  }

  toggleDiv(elema) {
    var test = document.getElementById(elema);
    if (test.classList.contains('hidden')) {
      document.getElementById(elema).classList.remove('hidden');
    } else {
      document.getElementById(elema).classList.add('hidden');
    }
  }

  deleteMedia(img, index) {
    var confirmText =
      'Are you sure you want to delete ' + img.filename + ' media ?';
    if (confirm(confirmText)) {
      let vars = this._cmsService.pageSelected.media.indexOf(img);
      console.log(vars);
      this._mediaService
        .mediadelete(img)
        .subscribe((media) => this.deleteMediaReady(media));
      this._mediaService.images.splice(index, 1);
      this._mediaService.setPage(this._mediaService.pager.currentPage);
    }
  }

  deleteMediaReady(media) {
    this.getMediaList.emit(media);
    document.getElementById('userImageContents').innerHTML = '';
    this._mediaService.getImageDData();
    this._messageService.SetAlertSuccess('File deleted');
  }

  humanfilesize(size, unit, decimals) {
    if (size > 1024000000 && decimals > 0)
      return (size / 1024000000).toFixed(decimals) + ' GB';
    if ((!unit && size > 1024000000) || unit == 'GB')
      return (size / 1024000000).toFixed(0) + ' GB';
    if (!unit && size > 1024000 && decimals > 0)
      return (size / 1024000).toFixed(decimals) + ' MB';
    if ((!unit && size > 1024000) || unit == 'MB')
      return (size / 1024000).toFixed(2) + ' MB';
    if ((!unit && size < 1024000) || unit == 'KB')
      return (size / 1024).toFixed(0) + ' KB';
    if ((!unit && size < 1024) || unit == 'B')
      return size.toFixed(0) + ' bytes';
    return size + ' bytes';
  }

  media_info(media: Media) {
    var infoDisplay = document.getElementById('mediaInfo_' + media._id).style
      .display;
    var infokids = document.getElementsByClassName('mediaInfo_kid');

    for (var i = 0, len = infokids.length; i < len; i++) {
      document.getElementById(infokids[i].id).style.display = 'none';
    }

    if (infoDisplay == 'block') {
      document.getElementById('mediaInfo_' + media._id).style.display = 'none';
    }
  }
}
