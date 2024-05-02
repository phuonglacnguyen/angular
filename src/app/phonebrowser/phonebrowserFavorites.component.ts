import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from '../user/user';

@Component({
  selector: 'app-phonebrowserFavorites',
  templateUrl: './phonebrowserFavorites.component.html',
  styleUrls: ['./phonebrowserFavorites.component.css'],
})
export class PhoneBrowserFavoritesComponent {
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
  videoId = '';
  video;
  mediaPath = '/api/assets/content/';
  tracks;
  allItems: any[];
  allItems2;
  pagedItems2;
  pager2;
  pager: any = {};
  pagedItems: any[];
  player;
  playListIndex = 1;
  playListIndex2 = 1;
  playersource;
  persons = [];
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
    public _userService: UserService,
    public _cmsService: CmsService,
    public _filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.allItems2 = [];
      this.pagedItems2 = [];
      this.pictures = [];
      this.videoId = undefined;

      this.albumId = params['parent'];
      this.videoId = params['id'];
      this.player = document.getElementById('player');
      this.playersource = document.getElementById('playersource');
      this._cmsService
        .getcms('65fe13f38015e06e0cd20048')
        .subscribe((result) => this.albumready(result));
    });
    this.getPersons();
    document.querySelector('#search').classList.remove('hidden');
    document.getElementById('search').setAttribute('display', 'inline-block');

    let dhis = this;
    if (this._cmsService.favArray.length == 0) {
      if (this._userService.user_current) {
        dhis.setFav();
      } else {
        setTimeout(function () {
          dhis.setFav();
        }, 4000);
      }
    }

    this._cmsService.updateLoginEvent.subscribe((pageSelected: Page) =>
      this.setFav()
    );
  }

  setFav() {
    let dhis = this;
    this._userService.user_current.favorites.forEach(function (value) {
      dhis._cmsService.favArray.push(value._id);
    });

    this._cmsService
      .getAlbumsByArray(this._cmsService.favArray)
      .subscribe((res) => this.setpersonalFavs(res));
  }

  setpersonalFavs(res) {
    this._userService.user_current.favorites_tmp = res;
    this._cmsService.allItems3 = res;
    //this._cmsService.shuffle(this._userService.user_current.favorites_tmp);
    this._cmsService.pager3 = this.pagerService.getPager(
      this._cmsService.allItems3.length,
      1
    );
    this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
      this._cmsService.pager3.startIndex,
      this._cmsService.pager3.endIndex + 1
    );
  }

  albumready(result) {
    //this._cmsService.clear_treelevels();
    //this._cmsService.context(result);
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

  getPersonsReady(res) {
    this.persons = res;
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
    var bindex = (b + 1) / this._filterService.filterShf;
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
    this.playListIndex = a;
    if (this.videoId != undefined) {
      this._cmsService
        .getcms(this.videoId)
        .subscribe((result) => this.allItemsReadyd(result));
    }
  }

  allItemsReadyd(video) {
    if (
      this._cmsService.treelevels.length == 1 ||
      this._cmsService.treelevels.length == 2
    ) {
      this._cmsService.scontext(video);
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

  setTimer(seconds, c) {
    var cdiw = document.getElementsByClassName('blok_phone');
    let blokid = cdiw[c].getAttribute('id');
    let tthis = this;
    return setTimeout(function () {
      if (document.getElementById(blokid).classList.contains('image')) {
        document.getElementById('player').classList.add('hidden');
        document.getElementById('phoneimage').classList.remove('hidden');
        document.getElementById('player').setAttribute('src', '');
        document
          .getElementById('phoneimage')
          .setAttribute('src', '/api/assets/content/' + blokid + '/main.jpg');
      } else {
        document.getElementById('phoneimage').classList.add('hidden');
        document.getElementById('player').classList.remove('hidden');
        document
          .getElementById('player')
          .setAttribute('src', '/api/assets/content/' + blokid + '/main.mp4');
      }
      document.getElementById('pagerTimer').innerHTML =
        c + 1 + '/' + cdiw.length;
      if (c + 1 == cdiw.length) {
        document.getElementById('stopSlideshowbutton').classList.add('hidden');
        document
          .getElementById('startSlideshowbutton')
          .classList.remove('hidden');
      }
      tthis.videoId = blokid;
      tthis._cmsService
        .getcms(tthis.videoId)
        .subscribe((result) => tthis.setTimerReady(result));
    }, seconds);
  }

  setTimerReady(page) {
    this.updateHits(page);
    this.video = page;
  }

  preslideshow() {
    //console.log('He?');
    this.setVideoLink(0, this._cmsService.pagedItems3[0]);
    let dhis = this;
    setTimeout(function () {
      dhis.startSlideshow();
    }, 1000);
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
    this.allItems2 = result;
    this.pictures = result;
    if (!this.videoId) {
      this.videoId = this.allItems2[0]._id;
      this._cmsService
        .getcms(this.videoId)
        .subscribe((result) => this.videoready(result));
    }
    this.setPage2(1);
    this.playlist();

    var b = result
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    var bindex = (b + 1) / 18;
    if (Math.ceil(bindex) > 1) {
      this.setPage2(Math.ceil(bindex));
    }
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
      this.albumId = video._id;
      this.album = video;
      this._cmsService
        .getPagesVisible(video._id)
        .subscribe((result) => this.allItemsReady2(result));
      //console.log(' blaat?1');
    } else {
      //console.log(' blaat?2');
      if (!this.video) {
        this._cmsService.pager3 = this.pagerService.getPager(
          this._cmsService.allItems3.length,
          1,
          this._filterService.filterShf
        );
        this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
          this._cmsService.pager3.startIndex,
          this._cmsService.pager3.endIndex + 1
        );
      }
      this._cmsService
        .getcms(video.parent)
        .subscribe((res) => (this.album = res));
      this.videoId = video._id;
      this.video = video;

      var b = this._cmsService.allItems3
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
      this.playListIndex = b + 1;

      //this.playListIndex = index+1;
      if (video.objectType == '5bf9d60fe2776742d80831e5') {
        // photo
        this.setImage();
        if (document.getElementById('player'))
          document.getElementById('player').setAttribute('src', '');
      } else if (video.objectType == '5c0114dc962a560534e3e576') {
        // video
        this.setVideo();
      }
    }
    //this._cmsService.getParentSelected(video.parent).subscribe(result => this.getAlbumReady(result));
  }

  setFilterShf() {
    this._filterService.filterShf = (<HTMLInputElement>(
      document.getElementById('filterShf')
    )).value;
    this.setPage2(1);
  }

  getFavByFind(id) {
    let a = this._userService.user_current.favorites.find((x) => x._id === id);
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
        console.log('Add');
      } else {
        this._userService.user_current.favorites.splice(a, 1);
        this._userService.user_current.favorites_tmp.splice(b, 1);
        document.getElementById('fav' + page._id).classList.add('icmn-heart8');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart7');
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

  setImage() {
    var dhis = this;
    setTimeout(function () {
      document.getElementById('player').setAttribute('src', '');
      document.getElementById('player').classList.add('hidden');
      document.getElementById('phoneimage').classList.remove('hidden');
      document.getElementById('player_time').classList.add('hidden');
      document
        .getElementById('phoneimage')
        .setAttribute(
          'src',
          '/api/assets/content/' + dhis.videoId + '/main.jpg'
        );
    }, 500);
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

  setVideo() {
    let dhis = this;
    setTimeout(function () {
      document.getElementById('phoneimage').classList.add('hidden');
      document.getElementById('player').classList.remove('hidden');
      document.getElementById('player_time').classList.remove('hidden');

      dhis.loadTrack(dhis.playListIndex);
      if (dhis._userService.getUserLoggedIn() == true) {
        var vidp = dhis.videoPlayer;
        var vid: any = document.getElementById('player');

        document
          .getElementById('player')
          .addEventListener('playing', function () {
            if (document.getElementById('player_status') != undefined)
              document.getElementById('player_status').innerHTML =
                'Player started';
          });

        document
          .getElementById('player')
          .addEventListener('pause', function () {
            if (document.getElementById('player_status') != undefined)
              document.getElementById('player_status').innerHTML =
                'Player paused';
          });

        vid.addEventListener('timeupdate', function () {
          if (document.getElementById('player_time'))
            document.getElementById('player_time').innerHTML =
              dhis._cmsService.secondsToHms(
                vid.duration - parseInt(vid.currentTime)
              );
        });
      }
    }, 1000);
  }

  seen(page) {
    let index = this._userService.user_current.urlHistory
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

  setVideoReady(video) {
    this.videoPlayer.src =
      'http://localhost:3001/api/assets/content/' + this.videoId + '/main.mp4';
  }

  checkAssetFileResult(res, fname, id) {
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

  shuffle() {
    this._cmsService.shuffle(this._cmsService.allItems3);
    if (this.video) this.setVideoLink(0, this._cmsService.pagedItems3[0]);
    this.setPage2(0, this.video ? this._filterService.filterShf : 30);
  }

  filterKeyword(event) {
    this._cmsService.pagedItems3 = this._cmsService.allItems3;
    this._filterService.filterText = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterText')).value;
    if (!e) {
      this._cmsService.pager3 = this.pagerService.getPager(
        this._cmsService.allItems3.length
      );
      this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
        this._cmsService.pager3.startIndex,
        this._cmsService.pager3.endIndex + 1
      );
      this.setPage2(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_phone');
        if (document.getElementById('allItemsCount'))
          (<HTMLInputElement>(
            document.getElementById('allItemsCount')
          )).innerHTML = shis._cmsService.allItems3.length + ' results';
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

  filterSelectFirstletter(event) {
    var e = (<HTMLInputElement>document.getElementById('filterFirstletter'))
      .value;
    var shis = this;
    this._cmsService.pagedItems3 = this._cmsService.allItems3;
    this._filterService.filterFirstletter = event.target.value;
    if (!e) {
      console.log('Leeg');
      //this._cmsService.pager3 = this.pagerService.getPager(this._cmsService.allItems3.length, 1 , 10);
      //this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(this._cmsService.pager3.startIndex, this._cmsService.pager3.endIndex + 1);
      this.setPage2(0, this.video ? this._filterService.filterShf : 30);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_phone');
        if (document.getElementById('allItemsCount'))
          (<HTMLInputElement>(
            document.getElementById('allItemsCount')
          )).innerHTML = shis._cmsService.allItems3.length + ' results';
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

  filterSelectPerson(event) {
    var e = (<HTMLInputElement>document.getElementById('filterPersons')).value;
    var shis = this;
    this._cmsService.pagedItems3 = this._cmsService.allItems3;
    this._filterService.filterPersons = event.target.value;
    if (!e) {
      this._cmsService.pager3 = this.pagerService.getPager(
        this._cmsService.allItems3.length
      );
      this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
        this._cmsService.pager3.startIndex,
        this._cmsService.pager3.endIndex + 1
      );
      this.setPage2(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_phone');
        if (document.getElementById('allItemsCount'))
          (<HTMLInputElement>(
            document.getElementById('allItemsCount')
          )).innerHTML = shis._cmsService.allItems3.length + ' results';
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

  setPage(counter: number, shf?) {
    //console.log(this._filterService.filterShf);
    this._cmsService.pager3 = this.pagerService.getPager(
      this._cmsService.allItems3.length,
      counter,
      shf ? shf : this._filterService.filterShf
    );
    this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
      this._cmsService.pager3.startIndex,
      parseInt(this._cmsService.pager3.currentPage) *
        this._filterService.filterShf
    );

    this.videoId = this._cmsService.pagedItems3[0]._id;
    this.video = this._cmsService.pagedItems3[0];
    this.playListIndex = 1;

    if (this.video.objectType == '5bf9d60fe2776742d80831e5') {
      // photo
      this.setImage();
    } else if (this.video.objectType == '5c0114dc962a560534e3e576') {
      // video
      this.setVideo();
    }

    var b = this._cmsService.allItems3
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    this.playListIndex = b + 1;
  }

  setPage2(counter: number, shf?) {
    //console.log(shf);
    this._cmsService.pager3 = this.pagerService.getPager(
      this._cmsService.allItems3.length,
      counter,
      shf ? shf : this._filterService.filterShf
    );
    this._cmsService.pagedItems3 = this._cmsService.allItems3.slice(
      this._cmsService.pager3.startIndex,
      parseInt(this._cmsService.pager3.currentPage) *
        this._filterService.filterShf
    );

    var b = this._cmsService.allItems3
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    this.playListIndex = b + 1;
  }
}
