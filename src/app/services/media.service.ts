//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagerService } from './../services/pagination.service';
import { User, Address, Page } from './../user/user';
import { Files } from './../../models/bots/Files';
import { Media } from './../../models/media';
import { Injectable, ViewChild } from '@angular/core';
//import { Observable } from "rxjs";
import 'rxjs';
import { map, subscribeOn } from 'rxjs/operators';

//@Directive()
@Injectable()
export class MediaService {
  _baseURL: string = '/api/';
  mediaSelected: Media = new Media();
  images: Array<Media> = [];
  allItems;
  pagedItems;
  pager;
  @ViewChild('audio') audio; // , { static: true}
  public MediaSelected: Media = new Media();

  constructor(private _http: HttpClient, private pagerService: PagerService) {
    this.getImages().subscribe((res) => this.getImagesReady(res));
  }

  getImagesReady(res) {
    this.images = res;
  }

  getImagesReady2(res, counter) {
    this.images = res;
    this.allItems = this.images;
    this.pager = this.pagerService.getPager(this.images.length, counter, 8);
    this.pagedItems = this.images.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  setPage(counter: number) {
    if (this.images.length == 0) {
      this.getImages().subscribe((res) => this.getImagesReady2(res, counter));
    } else {
      this.allItems = this.images;
      this.pager = this.pagerService.getPager(this.images.length, counter, 8);
      this.pagedItems = this.images.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
    }
  }

  getImageDData() {
    //console.log('test');
    this.getImages().subscribe((data) => this.getImagelist(data)); // this.getImagelist(data)
  }

  getImagelist(data) {
    //console.log(data);
    this.setImages(data);
    if (this.images.length > 0) {
      this.getMediaById(this.images[0]._id);
      //document.getElementById('video_mp4').setAttribute('src', '/api/assets/media/' + this.images[0]._id + '/main.mp4');
    }
    //this.playlistReady =1;
  }

  fileOptionAdd(media: Media, catId) {
    return this._http
      .put(this._baseURL + 'fileCategoryAdd/' + media._id, media)
      .pipe();
  }

  fileOptionDelete(media: Media, catId) {
    return this._http
      .put(this._baseURL + 'fileCategoryDelete/' + media._id, media)
      .pipe();
  }

  getMediaById(id) {
    this.getMedia(id).subscribe((data) => this.RetMediaById(data));
  }

  RetMediaById(data) {
    this.setMediaSelected(data);
  }

  player_pause() {
    this.audio.pause();
    console.log('Set player pause');
  }

  upload(files) {
    //console.log('upload?');
    let headers = new HttpHeaders();
    //let options = new RequestOptions({ headers: headers });
    return this._http.put(this._baseURL + 'upload', files).pipe();
    // .catch(error => Observable.throw(error));
  }

  setImages(images) {
    this.images = images;
  }

  logStatusChange(status: string) {
    //console.log('A Cms status changed, new stus: ' + status);
  }

  getImages() {
    return this._http.get(this._baseURL + 'getmedia').pipe();
  }

  checkFileupload(fname, fsize) {
    return this._http
      .get(this._baseURL + 'checkFileupload/' + fname + '/' + fsize)
      .pipe();
  }

  setMediaSelected(media: Media) {
    this.mediaSelected = media;
  }

  getMedia(media: Media) {
    return this._http.get(this._baseURL + 'getmedia/' + media._id).pipe();
  }

  destroyMedia(media: Media) {
    return this._http.delete('/api/media/' + media._id).pipe();
  }

  mediadelete(media: any) {
    return this._http.get('/api/mediadelete/' + media._id).pipe();
  }
}
