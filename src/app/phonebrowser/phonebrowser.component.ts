import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';

@Component({
  selector: 'app-phonebrowser',
  templateUrl: './phonebrowser.component.html',
  styleUrls: ['./phonebrowser.component.css'],
})
export class PhoneBrowserComponent implements OnInit {
  @ViewChild('imageViewer') imageViewer: any;
  @ViewChild('videoPlayer') videoPlayer: any;
  @ViewChild('videoSource') videoSource: any;
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterGenre;
  activeMenu: string;
  toggleHidden = true;
  albumId;
  albumKids;
  slideshow: any = [];
  videoId: string = '';
  video;
  mediaPath = '/api/assets/content/';
  tracks;
  allItems: any[];
  allItems2: any[];
  pagedItems2: any[];
  pager2: any = {};
  pager: any = {};
  pagedItems: any[];
  player;
  playListIndex = 1;
  playListIndex2 = 1;
  playersource;
  persons = [];
  person;
  album;
  albums;
  pictures;
  currentItem;
  category;
  items = new Array(
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
  inputz;
  parent;

  constructor(
    private router: Router,
    public _userService: UserService,
    private _cmsService: CmsService,
    public _filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.allItems2 = [];
      this.pagedItems2 = [];
      this.pictures = [];
      if (document.getElementById('player'))
        document.getElementById('player').setAttribute('src', '');
      if (document.getElementById('player_time'))
        document.getElementById('player_time').classList.add('hidden');

      this.albumId = params['parent'];
      this.videoId = params['id'];
      this.getPersons();
      if (
        this.albumId == '5dc1bc75cae5e01d049578e7' ||
        this.videoId == '5dc1bc75cae5e01d049578e7'
      ) {
        // persons
        this._cmsService
          .getcms('5dc1bc75cae5e01d049578e7')
          .subscribe((result) => this.personsready(result));
        //this._cmsService.getcms("5dc1bc75cae5e01d049578e7").subscribe(res => this.category = res);
        this._cmsService
          .getPagesVisible('5bf3d96b005d272d4415722b')
          .subscribe((result) => this.allItemsReady(result));
      } else {
        this._cmsService
          .getPagesVisible(this.albumId)
          .subscribe((result) => this.allItemsReady(result));
        this.player = document.getElementById('player');
        this.playersource = document.getElementById('playersource');
        this._cmsService
          .getcms(this.albumId)
          .subscribe((result) => this.albumready(result));
      }
    });
    document.querySelector('#search').classList.remove('hidden');
    document.getElementById('search').setAttribute('display', 'inline-block');
    //document.querySelector('#search').classList.add('hidden');
  }

  personsready(res) {
    this.category = res;
    this.persons = res;
    this.album = res;
    this.albumId = res._id;
    //this._cmsService.clear_treelevels();
    //this._cmsService.context(res);
  }

  albumready(result) {
    //console.log(result);
    this.category = result;
    if (
      this.albumId != '5bf9cd3ce2776742d808319c' &&
      this.albumId != '5c01114b962a560534e3e574' &&
      this.albumId != '5ca885cce19d492df0898192' &&
      this.albumId != '5dc1bc75cae5e01d049578e7'
    ) {
      this.album = result;
      this._cmsService
        .getcms(result.parent)
        .subscribe((result) => this.albumready3(result));

      if (result.parent) {
        this._cmsService
          .getcms(result.parent)
          .subscribe((result) => this.albumready2(result));
      }
    } else {
      //this._cmsService.getPagesVisible(this.albumId)
      //   .subscribe(result => this.allItemsReady2(result));
    }

    //this.album = result;
    //if(this._cmsService.treelevels.length == 1) {
    this._cmsService.scontext(result);
    //}
  }

  albumready3(res) {
    this.category = res;
    this._cmsService
      .getPagesVisible(this.category._id)
      .subscribe((result) => this.allItemsReady(result));
  }

  albumready2(res) {
    this.parent = res;

    this._cmsService
      .getPagesVisible(this.albumId)
      .subscribe((result) => this.allItemsReady2(result));
  }

  getPersons() {
    this._cmsService
      .getPages('5bf3d96b005d272d4415722b')
      .subscribe((result) => this.getPersonsReady(result));
  }

  getPersonsReady(result) {
    this.persons = result;
    //console.log(result);
    //this.allItems2 = result;
    //this.pictures = result;
    if (!this.videoId) {
      //this.videoId = this.allItems2[0]._id;
      //this._cmsService.getcms(this.videoId).subscribe(result => this.videoready(result))
    }
    //console.log(this.pictures);
    //this.setPage2(1);
    //this.playlist();

    // var b = result.map(function (e) { return e._id; }).indexOf(this.videoId);
    // var bindex = ((b + 1) / 18);
    // if (Math.ceil(bindex) > 1) {
    //   this.setPage2(Math.ceil(bindex));
    //   //var a = this.pagedItems2.map(function (e) { return e._id; }).indexOf(this.videoId);
    // }
  }

  personById(personId) {
    if (this.persons.length > 0)
      return this.persons.find((x) => x._id === personId).title;
  }

  allItemsReady(result) {
    this.allItems = result;
    this.albums = result;

    this.setPage(1);
    this.playlist();

    var b = result
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.albumId);
    var bindex = (b + 1) / 10;
    if (Math.ceil(bindex) > 1) {
      this.setPage(Math.ceil(bindex));
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.albumId);
    } else {
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.albumId);
    }
    //this.playListIndex = a;

    //var a = this.pagedItems.map(function (e) { return e._id; }).indexOf(this.videoId);
    //this.playListIndex = a;

    if (this.videoId != undefined) {
      this._cmsService
        .getcms(this.videoId)
        .subscribe((result) => this.allItemsReadyd(result));
    }
  }

  allItemsReadyd(video) {
    //console.log(video);
    if (
      this._cmsService.treelevels.length == 1 ||
      this._cmsService.treelevels.length == 2
    ) {
      this._cmsService.clear_treelevels();
      //this._cmsService.context(video);
    }

    this.video = video;
    if (this.videoId != undefined) {
      if (video.objectType == '5bf9d60fe2776742d80831e5') {
        // photo
        this.setImage();
      } else if (video.objectType == '5c0114dc962a560534e3e576') {
        // video
        this.setVideo();
      }
    }
  }

  loadImages() {
    setTimeout(function () {
      var cdiw = document.getElementsByClassName('movieimage');
      for (var c = 0; c < cdiw.length; c++) {
        if (c == 0) {
          var nwidth = cdiw[c].clientWidth;
          var nheight = cdiw[c].clientHeight;
        } else {
          cdiw[c].setAttribute('width', nwidth + 'px');
          cdiw[c].setAttribute('height', nheight + 'px');
        }
      }
    }, 500);
  }

  ngOnInit() {
    //console.log('In the videos component ...');
  }

  setTimer(seconds, c) {
    var cdiw = document.getElementsByClassName('blok_phone');
    let stimer = parseInt(
      (<HTMLInputElement>document.getElementById('slideshowTimer')).value
    );
    let timer = 1;
    let blokid = cdiw[c].getAttribute('id');
    let tthis = this;
    //seconds = ((stimer*timer)*1000);
    return setTimeout(function () {
      if (document.getElementById(blokid).classList.contains('image')) {
        //console.log('image?');
        document.getElementById('player').classList.add('hidden');
        document.getElementById('phoneimage').classList.remove('hidden');
        document
          .getElementById('phoneimage')
          .setAttribute('src', '/api/assets/content/' + blokid + '/main.jpg');
      } else {
        //console.log('video?');
        //document.getElementById('player').setAttribute('src', '');
        document.getElementById('phoneimage').classList.add('hidden');
        document.getElementById('player').classList.remove('hidden');
        document
          .getElementById('player')
          .setAttribute('src', '/api/assets/content/' + blokid + '/main.mp4');
      }
      //document.getElementById('pagerTimer').innerHTML = (c+1)+'/'+cdiw.length;
      document.getElementById('img' + blokid).scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
      //console.log(c + ' ' + cdiw.length);
      if (c + 1 == cdiw.length) {
        document.getElementById('stopSlideshowbutton').classList.add('hidden');
        document
          .getElementById('startSlideshowbutton')
          .classList.remove('hidden');
      }
      tthis.videoId = blokid;
      tthis._cmsService
        .getcms(tthis.videoId)
        .subscribe((result) => (tthis.video = result));
    }, seconds);
  }

  startSlideshow() {
    var cdiw = document.getElementsByClassName('blok_phone');
    let stimer = parseInt(
      (<HTMLInputElement>document.getElementById('slideshowTimer')).value
    );
    let timer = 0;
    let seconds = 0;

    for (var c = 0; c < cdiw.length; c++) {
      seconds = stimer * timer * 1000;
      this.slideshow.push(this.setTimer(seconds, c));
      timer++;
    }
    document.getElementById('stopSlideshowbutton').classList.remove('hidden');
    document.getElementById('startSlideshowbutton').classList.add('hidden');
  }

  stopSlideshow() {
    for (var c = 0; c < this.slideshow.length; c++) {
      clearTimeout(this.slideshow[c]);
    }
    document.getElementById('stopSlideshowbutton').classList.add('hidden');
    document.getElementById('startSlideshowbutton').classList.remove('hidden');
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollToBottom() {
    window.scroll({
      top: 2000,
      left: 0,
      behavior: 'smooth',
    });
  }

  videoready(video) {
    this.video = video;
    if (this.video.objectType == '5bf9d60fe2776742d80831e5') {
      // photo
      this.setImage();
    } else if (
      this.video.objectType == '5c0114dc962a560534e3e576' ||
      this.album.objectType == '5c0114ca962a560534e3e575'
    ) {
      // video
      this.setVideo();
    }
  }

  allItemsReady2(result) {
    //console.log(result);
    this.allItems2 = result;
    //this.pictures = result;
    if (!this.videoId) {
      this.videoId = this.allItems2[0]._id;
      this._cmsService
        .getcms(this.videoId)
        .subscribe((result) => this.videoready(result));
    }
    //console.log(this.pictures);
    this.setPage2(0, this._filterService.filterShf);
    //this.playlist();

    // var b = result.map(function (e) { return e._id; }).indexOf(this.videoId);
    // var bindex = ((b + 1) / this._filterService.filterShf);
    // if (Math.ceil(bindex) > 1) {
    //   this.setPage2(Math.ceil(bindex));
    //   //var a = this.pagedItems2.map(function (e) { return e._id; }).indexOf(this.videoId);
    // }
    //this.playListIndex2 = a;
    // var a = this.pagedItems.map(function (e) { return e._id; }).indexOf(this.videoId);
    // this.playListIndex = a;

    // if (this.videoId != undefined) {
    //   this._cmsService.getcms(this.videoId)
    //     .subscribe(result => this.allItemsReadyd(result))
    // }
  }

  updateHits(item) {
    item.hits = item.hits + 1;
    this._cmsService.updatePage(item).subscribe();
  }

  setVideoLink(index, video) {
    this.updateHits(video);
    this.currentItem = video;

    if (
      video.parent == '5bf9cd3ce2776742d808319c' ||
      video.parent == '5c01114b962a560534e3e574' ||
      video.parent == '5ca885cce19d492df0898192'
    ) {
      //this.router.navigate(['/Personal/' + video._id]);
      this.albumId = video._id;
      //this.videoId = video._id;
      this.album = video;
      //console.log(this.album.title);
      this._cmsService
        .getPagesVisible(video._id)
        .subscribe((result) => this.allItemsReady2(result));
      //console.log(' blaat?1');
      //console.log(video.objectType);
      this.scrollToTop();
      //console.log('1');
      this.playListIndex2 = 1;
    } else if (video.objectType == '5bf3d9d9005d272d4415722d') {
      //console.log('1b');
      this.person = video._id;
      //this.album = video;
      //this.albumId = video._id;
      this.getImages(video);
      this.scrollToTop();
      //this._cmsService.getPhotoPersons(video._id).subscribe(result => this.getImagesReadyPersons(result));
    } else if (this.videoId == undefined && !this.album) {
      //console.log(' blaat?3');
      //this.router.navigate(['/Personal/' + video.parent + '/' + video._id]);
      this.videoId = video._id;
      this.album = video;
      this.playListIndex = 1;
      if (video.objectType == '5bf9d60fe2776742d80831e5') {
        // photo
        this.setImage();
      } else if (video.objectType == '5c0114dc962a560534e3e576') {
        // video
        this.setVideo();
      }
    } else {
      //console.log(' blaat?4');

      this.videoId = video._id;
      this.video = video;

      var b = this.allItems2
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
      this.playListIndex = b + 1;
      this.playListIndex2 = index + 1;
      if (video.objectType == '5bf9d60fe2776742d80831e5') {
        // photo
        this.setImage();
        //console.log('image');
      } else if (video.objectType == '5c0114dc962a560534e3e576') {
        // video
        //console.log('video');
        this.setVideo();
        //console.log(video.objectType);
      }
      //document.getElementById('pagerTimer').innerHTML = (index+1)+'/'+this.allItems2.length;
    }

    //this._cmsService.getParentSelected(video.parent).subscribe(result => this.getAlbumReady(result));
    //this._cmsService.treelevels = [];
    //this._cmsService.context(this.video);
  }

  getImages(person) {
    this.updateHits(person);
    this.albumId = person._id;
    //this.album = person;
    //console.log(person.title);
    //this.videoId = person._id;
    this._cmsService
      .getPhotoPersons(person._id)
      .subscribe((result) => this.getImagesReadyPersons(result));
    //this.person = person;
  }

  getImagesReadyPersons(res) {
    //console.log(res);
    this.videoId = res[0]._id;
    this.allItems2 = res;
    this.setPage2(0, this._filterService.filterShf);

    this.video = res[0];
    this.playListIndex = 1;
    //this.pictures = res;
    //console.log(this.video.objectType);
    if (this.video.objectType == '5bf9d60fe2776742d80831e5') {
      // photo
      this.setImage(true);
      //console.log('image');
    } else if (this.video.objectType == '5c0114dc962a560534e3e576') {
      // video
      this.setVideo();
      //console.log('video');
    }

    //this.album = res;
    //this._cmsService.getParentSelected(this.video.parent).subscribe(result => this.getAlbumReady(result));
    //
    //this.updateHits(res[0]);
  }

  setImage(timer?) {
    //console.log('setImage');
    document.getElementById('player_time').classList.add('hidden');

    if (document.getElementById('player'))
      document.getElementById('player').setAttribute('src', '');
    if (timer) {
      setTimeout(() => {
        document.getElementById('player').classList.add('hidden');
        document.getElementById('phoneimage').classList.remove('hidden');
        document
          .getElementById('phoneimage')
          .setAttribute(
            'src',
            '/api/assets/content/' + this.videoId + '/main.jpg'
          );
      }, 500);
    } else {
      document.getElementById('player').classList.add('hidden');
      document.getElementById('phoneimage').classList.remove('hidden');
      document
        .getElementById('phoneimage')
        .setAttribute(
          'src',
          '/api/assets/content/' + this.videoId + '/main.jpg'
        );
    }
  }

  getImagesReady(res) {
    this.allItems2 = res;
    this.setPage2(1);
    this.videoId = res[0]._id;
    this.video = res[0];
    this.album = res;
    this.pictures = res;
    //this._cmsService.getParentSelected(this.video.parent).subscribe(result => this.getAlbumReady(result));
    //this.setImage();
    //this.updateHits(res[0]);
  }

  setFilterShf() {
    this._filterService.filterShf = (<HTMLInputElement>(
      document.getElementById('filterShf')
    )).value;
    this.pager2 = this.pagerService.getPager(
      this.allItems2.length,
      1,
      this._filterService.filterShf
    );
    this.pagedItems2 = this.allItems2.slice(
      this.pager2.startIndex,
      this.pager2.endIndex + 1
    );
  }

  getAlbumReady(res) {
    //this.album = res;
  }

  getFavByFind(id) {
    let a = this._userService.user_current.favorites.find((x) => x._id === id);
    //console.log(a);
    if (a !== -1 && a !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  toggleFavorite(page, title) {
    if (this._userService.user_current != undefined) {
      var a = this._userService.user_current.favorites
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      var b = this._userService.user_current.favorites_tmp
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      if (a == -1) {
        let obj = {};
        obj['_id'] = page._id;
        obj['title'] = title;
        this._userService.user_current.favorites.push(obj);
        this._userService.user_current.favorites_tmp.push(page);
        document.getElementById('fav' + page._id).classList.add('icmn-heart7');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart8');
        //console.log(this._userService.user_current.favorites);
      } else {
        //console.log('Remove');
        this._userService.user_current.favorites.splice(a, 1);
        this._userService.user_current.favorites_tmp.splice(b, 1);
        document.getElementById('fav' + page._id).classList.add('icmn-heart8');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart7');
        //console.log(this._userService.user_current.favorites);
      }
      this._userService.update(this._userService.user_current).subscribe();

      this._cmsService.allItems3 = this._userService.user_current.favorites_tmp;
      this._cmsService.pager3 = this.pagerService.getPager(
        this._cmsService.allItems3.length,
        this._cmsService.pager3.currentPage
      );
      this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
        this._cmsService.pager3.startIndex,
        this._cmsService.pager3.endIndex + 1
      );
    }
  }

  async processImage() {
    this.inputz = document.getElementById('phoneimage');

    // load weights
    //await faceDetectionNet.loadFromDisk('weights')
    //await faceapi.nets.faceLandmark68Net.loadFromDisk('weights')

    // load the image
    //const img = await canvas.loadImage('./src/images/1.jpg')

    // detect the faces with landmarks
    //const results = await faceapi.detectAllFaces(img, faceDetectionOptions).withFaceLandmarks();
    // create a new canvas and draw the detection and landmarks
    //const out = faceapi.createCanvasFromMedia(img);
    //faceapi.drawDetection(out, results.map(res => res.detection));
    //faceapi.drawLandmarks(out, results.map(res => res.landmarks), { drawLines: true, color: 'red' });

    // save the new canvas as image
    //saveFile('faceLandmarkDetection.jpg', out.toBuffer('image/jpeg'));
    //console.log('done, saved results to out/faceLandmarkDetection.jpg');

    //await faceDetectionNet.loadFromDisk('/app/face-api/weights');
    //const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 });
    //console.log(faceapi.nets);

    //const detections = await faceapi.detectAllFaces(this.inputz);
    //const detections = await faceapi.detectAllFaces(this.inputz, new faceapi.SsdMobilenetv1Options())

    //const detectionsWithLandmarks = faceapi.detectAllFaces(this.inputz).withFaceLandmarks()

    // Endpoint: https://westcentralus.api.cognitive.microsoft.com/face/v1.0
    // Key 1: ef990dc53c464d87b2255c1097a803cb
    // Key 2: ebb3eb7c16574ae19375e631e8bb5eea

    //await faceapi.nets.ssdMobilenetv1.loadFromDisk('/src/models/')

    //const detections = await faceapi.detectAllFaces(this.inputz);
    //const detections = await faceapi.detectAllFaces(this.inputz, new faceapi.SsdMobilenetv1Options())
    //await faceapi.nets.ssdMobilenetv1.loadFromDisk('/api/assets/content/' + this.videoId + '/main.jpg');

    //await faceDetectionNet.loadFromDisk('')
    //await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    //const thee = await canvas.loadImage('/api/assets/content/' + this.videoId + '/main.jpg');
    //const detections = await faceapi.detectAllFaces(this.inputz, faceDetectionOptions);
    //const img = await canvas.loadImage('/api/assets/content/' + this.videoId + '/main.jpg')
    //const detections = await faceapi.detectAllFaces(this.inputz);
    // const out = faceapi.createCanvasFromMedia(this.inputz) as any
    //faceapi.draw.drawDetections(out, detections);

    //const img = await canvas.loadImage('Y:/Websites/new.voormezelf/assets/content/' + this.videoId + '/main.jpg');
    //const detections = await faceapi.detectAllFaces(img, faceDetectionOptions);
    //console.log(detections);

    //await faceDetectionNet.loadFromDisk(this.inputz);
    //await faceDetectionNet.loadFromDisk('/api/js/face-api');
    //const detections = await faceapi.detectAllFaces(this.inputz);
    //const imgs = await canvas.loadImage('/api/assets/content/' + this.videoId + '/main.jpg');
    //const detections = await faceapi.detectAllFaces(imgs, faceDetectionOptions);

    //let canvas = await this.loadCanvas('/api/assets/content/' + this.videoId + '/main.jpg');
    //    let tt = await faceapi.detectAllFaces(canvas);
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

  seen(page) {
    let index = -1;
    if (this._userService.user_current)
      index = this._userService.user_current.urlHistory
        .map(function (e) {
          return e.title;
        })
        .indexOf(page.title);
    //console.log(index);
    if (index != -1) {
      return 'Seen';
    } else {
      return '';
    }
  }

  setVideo() {
    document.getElementById('phoneimage').classList.add('hidden');
    document.getElementById('player').classList.remove('hidden');
    document.getElementById('player_time').classList.remove('hidden');

    var vid: any = document.getElementById('player');
    let dhis = this;
    this.loadTrack(this.playListIndex);
    if (this._userService.getUserLoggedIn() == true) {
      document
        .getElementById('player')
        .addEventListener('playing', function () {
          if (document.getElementById('player_status') != undefined)
            document.getElementById('player_status').innerHTML =
              'Player started';
        });
      document.getElementById('player').addEventListener('pause', function () {
        if (document.getElementById('player_status') != undefined)
          document.getElementById('player_status').innerHTML = 'Player paused';
      });
      vid.addEventListener('timeupdate', function () {
        if (document.getElementById('player_time'))
          document.getElementById('player_time').innerHTML =
            dhis._cmsService.secondsToHms(
              vid.duration - parseInt(vid.currentTime)
            );
      });
    }
  }

  setVideoReady(video) {
    this.videoPlayer.src =
      'http://localhost:3001/api/assets/content/' + this.videoId + '/main.mp4';
  }

  checkAssetFileResult(res, fname, id) {
    //console.log(res);
    if (res != 'no') {
      document.getElementById('player').classList.add('hidden');
      document.getElementById('phoneimage').classList.remove('hidden');
      document
        .getElementById('phoneimage')
        .setAttribute(
          'src',
          '/api/assets/content/' + id + '/' + fname + '.jpg'
        );
    }
  }

  filterKeyword(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterText = event.target.value;
  }

  filterSelectFirstletter(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterFirstletter = event.target.value;
  }

  shuffle() {
    this._cmsService.shuffle(this.allItems2);
    this.setPage2(0, this.video ? this._filterService.filterShf : 10);
    if (this.video) this.setVideoLink(0, this.pagedItems2[0]);
  }

  filterSelectPerson(event) {
    var e = (<HTMLInputElement>document.getElementById('filterPersons')).value;
    var shis = this;
    this.pagedItems2 = this.allItems2;
    this._filterService.filterPersons = event.target.value;
    if (!e) {
      this.pager2 = this.pagerService.getPager(this.allItems2.length);
      this.pagedItems2 = this.allItems2.slice(
        this.pager2.startIndex,
        this.pager2.endIndex + 1
      );
      this.setPage2(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_phone');
        if (document.getElementById('allItemsCount'))
          (<HTMLInputElement>(
            document.getElementById('allItemsCount')
          )).innerHTML = shis.allItems2.length + ' results';
        if (document.getElementById('pagination'))
          document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_phone');
        if (document.getElementById('allItemsCount'))
          (<HTMLInputElement>(
            document.getElementById('allItemsCount')
          )).innerHTML = f.length + ' results';
        if (document.getElementById('pagination'))
          document.getElementById('pagination').classList.add('hidden');
      }, 500);
    }
  }

  playlist() {
    var playlist_text = [];
    for (var i = 0; i < this.pagedItems.length; i++) {
      playlist_text.push({
        _id: this.pagedItems[i]._id,
        track: i,
        title: this.pagedItems[i].title,
        videowidth: this.pagedItems[i].schemaextend[0].videowidth,
        videoheight: this.pagedItems[i].schemaextend[0].videoheight,
        videocodec: this.pagedItems[i].schemaextend[0].videocodec,
        filesiz: this.pagedItems[i].schemaextend[0].filesiz,
        fileextension: this.pagedItems[i].schemaextend[0].fileextension,
        year: this.pagedItems[i].schemaextend[0].year,
        dateandtime: this.pagedItems[i].schemaextend[0].dateandtime,
        moviegenre: this.pagedItems[i].schemaextend[0].moviegenre,
        imdb: this.pagedItems[i].schemaextend[0].imdb,
        imdbrating: this.pagedItems[i].schemaextend[0].imdbrating,
        content: this.pagedItems[i].schemaextend[0].content,
        file: 'main.mp4',
      });
    }
    this.tracks = playlist_text;
  }

  loadTrack(index) {
    var dhis = this;
    setTimeout(function () {
      dhis.videoPlayer.nativeElement.pause();
      document
        .getElementById('player')
        .setAttribute('src', dhis.mediaPath + dhis.video._id + '/main.mp4');
      dhis.videoPlayer.nativeElement.load();
    }, 500);
  }

  playTrack(index) {
    this.loadTrack(index);
    (<HTMLInputElement>(
      document.getElementById('player_startbutton')
    )).classList.remove('icmn-play4');
    (<HTMLInputElement>(
      document.getElementById('player_startbutton')
    )).classList.add('icmn-pause2');
    (<HTMLInputElement>document.getElementById('player_status')).innerHTML =
      'Started playing ..';
    this.videoPlayer.nativeElement.play();
    this.video.title = this.tracks[this.playListIndex].title;
    this.video.videowidth = this.tracks[this.playListIndex].videowidth;
    this.video.videoheight = this.tracks[this.playListIndex].videoheight;
    this.video.videocodec = this.tracks[this.playListIndex].videocodec;
    this.video.filesiz = this.tracks[this.playListIndex].filesiz;
    this.video.fileextension = this.tracks[this.playListIndex].fileextension;
    this.video.year = this.tracks[this.playListIndex].year;
    this.video.schemaextend[0].moviegenre =
      this.tracks[this.playListIndex].moviegenre;
    this.video.dateandtime = this.tracks[this.playListIndex].dateandtime;
    this.video.content = this.tracks[this.playListIndex].content;
    this.video.imdbrating = this.tracks[this.playListIndex].imdbrating;
    this.video.imdb = this.tracks[this.playListIndex].imdb;
  }

  player_forward() {
    if (this.playListIndex - 1 < this.allItems.length) {
      this.playListIndex++;
      this.videoId = this.tracks[this.playListIndex]._id;
      this.playTrack(this.playListIndex);
    } else {
      this.videoPlayer.nativeElement.pause();
      this.playListIndex = 0;
      this.loadTrack(this.playListIndex);
    }
  }

  player_backward() {
    if (this.playListIndex > 0) {
      this.playListIndex--;
      this.videoId = this.tracks[this.playListIndex]._id;
      this.playTrack(this.playListIndex);
    } else {
      this.videoPlayer.nativeElement.pause();
      this.playListIndex = 0;
      this.loadTrack(this.playListIndex);
    }
  }

  setPage(counter: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, counter);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    //if(this.videoId != undefined && this.video != undefined && this.video.objectType == '5bf9d60fe2776742d80831e5') {
    //   document.getElementById('stopSlideshowbutton').classList.add('hidden');
    //   document.getElementById('startSlideshowbutton').classList.remove('hidden');
    //}
  }

  setPage2(counter: number, shf?: number) {
    //this.setFilterShf();
    //console.log(this._filterService.filterShf);

    this.pager2 = this.pagerService.getPager(
      this.allItems2.length,
      counter,
      shf != undefined ? shf : this._filterService.filterShf
    );
    //console.log((this.pager2.startIndex));
    //console.log((parseInt(this.pager2.currentPage)) * this._filterService.filterShf );
    this.pagedItems2 = this.allItems2.slice(
      this.pager2.startIndex,
      parseInt(this.pager2.currentPage) * this._filterService.filterShf
    );
    this.videoId = this.pagedItems2[0]._id;
    this.video = this.pagedItems2[0];

    if (this.video.objectType == '5bf9d60fe2776742d80831e5') {
      // photo
      this.setImage();
    } else if (this.video.objectType == '5c0114dc962a560534e3e576') {
      // video
      this.setVideo();
    }

    var b = this.allItems2
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    this.playListIndex = b + 1;
    this.playListIndex2 = 1;
    //var b = this.allItems2.map(function (e) { return e._id; }).indexOf(this.videoId);
    //this.playListIndex = b+1;

    //this._filterService.filterShf = (<HTMLInputElement>document.getElementById('filterShf')).value;
    //this.pager2 = this.pagerService.getPager(this.allItems2.length, counter, (shf != undefined ? shf : this._filterService.filterShf));
    //this.pagedItems2 = this.allItems2.slice(this.pager2.startIndex, this.pager2.endIndex + 1);
    //if(this.videoId != undefined && this.video != undefined && this.video.objectType == '5bf9d60fe2776742d80831e5') {
    //   document.getElementById('stopSlideshowbutton').classList.add('hidden');
    //   document.getElementById('startSlideshowbutton').classList.remove('hidden');
    //}
  }

  settab(tid) {
    this.activeMenu = tid;
  }
}
