import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from './../../models/page';
import { Treeid } from './../../models/treeid';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
})
export class VideosComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer;
  @ViewChild('videoSource') videoSource;
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterGenre;
  @Input() filterFavorites;
  @Input() filterRating;
  activeMenu: string;
  toggleHidden = true;
  album: Page = new Page();
  albumId: string;
  videoId: string;
  video: any;
  mediaPath = '/api/assets/content/';
  allItems: Array<Page> = [];
  pager: any = {};
  pagedItems: Array<Page> = [];
  playerTime: number = 0;
  playListIndex: number = 1;
  playListIndex2: number = 0;
  playListIndexTotal: number = 0;
  usertime: number;
  parent: Page = new Page();
  listener: boolean = false;
  defaultLangSet: boolean = false;
  lastEpisodeIndex: string;
  urlHistoryAlbum: number = -1;
  urlHistoryVideo: number = -1;

  constructor(
    private router: Router,
    public _userService: UserService,
    public _cmsService: CmsService,
    public _filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.albumId = params['parent'];
      this.videoId = params['id'];
      if (this.videoId) this.setVideo();
      if (document.getElementById('player'))
        document.getElementById('player').setAttribute('src', '');
      if (this.albumId) {
        this._cmsService
          .getPages(this.albumId)
          .subscribe((result) => this.allItemsReady(result));
      }
    });
    //this.playersource = document.getElementById('playersource');
    this.filterFirstletter = '';
    this.filterGenre = '';
    this.filterRating = '';
    this.filterFavorites = 'false';
    document.querySelector('#search').classList.remove('hidden');
    document.getElementById('search').setAttribute('display', 'inline-block');

    let dhis = this;
    if (this._cmsService.urlHistoryArray.length == 0) {
      if (this._userService.user_current) {
        dhis.setFavHistory();
      } else {
        setTimeout(function () {
          dhis.setFavHistory();
        }, 4000);
      }
    }

    this._cmsService.updateLoginEvent.subscribe((pageSelected: Page) =>
      this.setFavHistory()
    );
  }

  setFavHistory() {
    let dhis = this;
    if (dhis._cmsService.urlHistoryArray.length == 0) {
      this._userService.user_current.urlHistory.forEach(function (value) {
        if (value._id) {
          let tmp = value._id.split('/');
          let varz = '';
          if (tmp[3] != undefined) {
            varz = tmp[3].replace('/', '');
          } else if (tmp[2] != undefined) {
            varz = tmp[2].replace('/', '');
          } else if (tmp[1] != undefined) {
            varz = tmp[1].replace('/', '');
          }
          if (varz != '') dhis._cmsService.urlHistoryArray.push(varz);
        }
      });
      this._cmsService
        .getAlbumsByArray(this._cmsService.urlHistoryArray)
        .subscribe((res) => this.seturlHistoryFavs(res));
    }
  }

  seturlHistoryFavs(res) {
    this._userService.user_current.urlHistory_tmp = res;
    this._cmsService.allItems4 = res;
    //this._cmsService.shuffle(this._userService.user_current.urlHistory_tmp);
    this._cmsService.pager4 = this.pagerService.getPager(
      this._cmsService.allItems4.length,
      1
    );
    this._cmsService.pagedItems4 = this._cmsService.allItems4.slice(
      this._cmsService.pager4.startIndex,
      this._cmsService.pager4.endIndex + 1
    );
    //console.log(this._userService.user_current.urlHistory_tmp);
  }

  setVideo() {
    //console.log('setVideo');
    this._cmsService
      .getcms(this.videoId)
      .subscribe((result) => this.setVideoReady(result));
  }

  setVideoReady(video: Page) {
    this.video = video;
    //console.log(video.title + ' Deze? ');
    this._cmsService.scontext(video);
    if (video.objectType == '5c0114dc962a560534e3e576') {
      if (!this.listener) this.eventslisteners();
      //(<HTMLVideoElement>document.getElementById('player')).muted = true;
      let dhis = this;
      this.playTrack(dhis.playListIndex);
      this.updateHits(video);
    }
  }

  ngOnInit() {
    // if(this._userService.user_current != undefined) {
    //   var favs = this._userService.user_current.favorites.length;
    //   var rand = Math.floor(Math.random() * favs);
    //   if(rand) {
    //     var url = '/api/assets/content/'+this._userService.user_current.favorites[rand]._id+'/main.jpg';
    //   }
    // }
  }

  checkFavorites() {
    var element = document.getElementsByClassName('favorites');
    for (var i = 0; i < element.length; i++) {
      var tekt = element[i].getAttribute('id').replace('fav', '');
      if (this._userService.user_current != undefined) {
        var a = this._userService.user_current.favorites
          .map(function (e) {
            return e._id;
          })
          .indexOf(tekt);
        if (a != -1) {
          document.getElementById('fav' + tekt).classList.remove('icmn-heart8');
          document.getElementById('fav' + tekt).classList.add('icmn-heart7');
        } else {
          document.getElementById('fav' + tekt).classList.remove('icmn-heart7');
          document.getElementById('fav' + tekt).classList.add('icmn-heart8');
        }
      }
    }
  }

  getFavByFind(id) {
    let a = this._userService.user_current.movies.find((x) => x._id === id);
    if (a !== -1 && a !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  toggleFavorite(video, title) {
    if (this._userService.user_current != undefined) {
      var a = this._userService.user_current.movies
        .map(function (e) {
          return e._id;
        })
        .indexOf(video._id);
      var b = this._userService.user_current.movies_tmp
        .map(function (e) {
          return e._id;
        })
        .indexOf(video._id);
      if (a == -1) {
        let obj = new Treeid();
        obj._id = video._id;
        obj.time = '0';
        obj.title = title;
        this._userService.user_current.movies.push(obj);
        this._userService.user_current.movies_tmp.push(video);
        document.getElementById('fav' + video._id).classList.add('icmn-heart7');
        document
          .getElementById('fav' + video._id)
          .classList.remove('icmn-heart8');
      } else {
        this._userService.user_current.movies.splice(a, 1);
        this._userService.user_current.movies_tmp.splice(b, 1);
        document.getElementById('fav' + video._id).classList.add('icmn-heart8');
        document
          .getElementById('fav' + video._id)
          .classList.remove('icmn-heart7');
      }
      this._userService.saveuser(this._userService.user_current).subscribe();
      this._cmsService.allItems2 = this._userService.user_current.movies_tmp;
      this._cmsService.pager2 = this.pagerService.getPager(
        this._cmsService.allItems2.length,
        this._cmsService.pager2.currentPage
      );
      this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
        this._cmsService.pager2.startIndex,
        this._cmsService.pager2.endIndex + 1
      );
    }
  }

  toggleFavorite2(id, title) {
    if (this._userService.user_current != undefined) {
      var a = this._userService.user_current.movies
        .map(function (e) {
          return e._id;
        })
        .indexOf(id);
      if (a == -1) {
        let obj = new Treeid();
        obj._id = id;
        obj.time = '0';
        obj.title = title;
        this._userService.user_current.movies.push(obj);
      } else {
        this._userService.user_current.movies.splice(a, 1);
      }
      this._userService.saveuser(this._userService.user_current).subscribe();
    }
  }

  // testMeReady(res, fileN, inputId) {
  //   console.log(res);
  // }

  setSubtitleTrack(id, iso) {
    var video: any = document.querySelector('#player');
    for (var i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'hidden';
    }
    let trackName = iso.replace('GB', 'en').toLowerCase().trim();
    // this._cmsService
    //   .checkAssetFile('main', '', id)
    //   .subscribe((res) => this.testMeReady(res, 'main', this.video._id));
    document
      .getElementById(trackName + 'Track')
      .setAttribute('src', '/api/assets/content/' + id + '/' + iso + '.vtt');
    let trackElem: any = document.querySelector('#' + trackName + 'Track');
    let track = trackElem.track;
    track.mode = 'showing';
    this.defaultLangSet = true;
  }

  albumReady(page) {
    this.album = page;
    this._cmsService
      .getcms(page.parent)
      .subscribe((result) => (this.parent = result));
    if (this._userService.user_current) {
      let a = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == page.title
      );
      if (a && a != -1) {
        var lastEpisodeIndex =
          this._userService.user_current.urlHistory[a].time;
        let type = typeof lastEpisodeIndex;
        if (
          lastEpisodeIndex != -1 &&
          lastEpisodeIndex != 0 &&
          type != 'number'
        ) {
          this.lastEpisodeIndex = lastEpisodeIndex;

          if (this.lastEpisodeIndex) {
            if (!this.videoId) {
              this._cmsService
                .getcms(this.lastEpisodeIndex)
                .subscribe((video) => this.setVideoReady(video));
            }

            // this._cmsService
            //   .getcms(this.albumId)
            //   .subscribe((album) => this.albumReadyInfo(album));
            this.videoId = lastEpisodeIndex;

            this.playListIndex2 = this.allItems.findIndex(
              (x) => x._id == this.lastEpisodeIndex
            );
            this.topscroller(this.playListIndex2);
            //this.playTrack(this.playListIndex2);
            if (!this.listener) this.eventslisteners();
          }
        }
      }
    }
  }

  albumReadyInfo(album) {
    if (this.lastEpisodeIndex) {
      this.allItemsReadyInfo();
      // this.videoPlayer.nativeElement.setAttribute(
      //   'src',
      //   '/api/assets/content/' + this.lastEpisodeIndex + '/main.mp4'
      // );
      // this.videoPlayer.nativeElement.play();
    }
  }

  allItemsReadyInfo() {
    //console.log('allItemsReadyInfo');
    this.setPage(0);
    var b = this.allItems
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.lastEpisodeIndex);
    var bindex = (b + 1) / 10;
    if (Math.ceil(bindex) > 1) {
      this.setPage(Math.ceil(bindex));
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.lastEpisodeIndex);
    } else {
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.lastEpisodeIndex);
    }
    if (a == -1) {
      this.playListIndex = 0;
    } else {
      this.playListIndex = a;
    }
    if (
      (this.videoId || this.lastEpisodeIndex) &&
      this._userService.user_current
    ) {
      if (this.videoPlayer.src == '') {
        //this.playTrack(this.playListIndex);
        console.log('allItemsReadyInfo');
      }
    }
    this.topscroller(b);
    this.playListIndexTotal = b;
  }

  setSubtitles() {
    if (
      this._userService.user_current &&
      this.video &&
      this.video.schemaextend[0].subtitles
    ) {
      this.video.schemaextend[0].subtitles.forEach((res) => {
        this._cmsService.setsubs('vtt', res.ISO, this.video._id);
      });
    }
  }

  setVideoTime() {
    if (this._userService.user_current && this.video) {
      let index = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == this.video.title
      );
      if (index != -1 && document.getElementById('player')) {
        let dhis = this;
        if (this._userService.user_current.urlHistory[index]) {
          this.settime(dhis._userService.user_current.urlHistory[index].time);
        }
      }
    }
  }

  settime(seconds) {
    if (
      parseInt(seconds) + 5 <= parseInt(this.video.schemaextend[0].length) &&
      seconds > 0
    ) {
      //if (this.albumId != '5c0d45ea64c6c530246b568a')
      this.videoPlayer.nativeElement.currentTime = seconds;
    }
  }

  allItemsReady(result) {
    //console.log('allItemsReady');
    this.allItems = result;
    this.setPage(1);
    this.playlist();
    this._cmsService
      .getcms(this.albumId)
      .subscribe((res) => this.albumReady(res));

    var b = result
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    var bindex = (b + 1) / 10;
    if (Math.ceil(bindex) > 1) {
      this.setPage(Math.ceil(bindex));
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
    } else {
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
    }
  }

  getsubsReady(index, res, iso, page) {
    if (res != 'no') {
      const newsubs = { ISO: iso };
      this.pagedItems[index].schemaextend[0].subtitles.push(newsubs);
    }
  }

  seen(page) {
    let index = -1;
    if (this._userService.user_current != undefined) {
      index = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == page.title
      );
    }
    if (index != -1) {
      return 'Seen';
    } else {
      return '';
    }
  }

  setUrlHistory() {
    //console.log('setUrlHistory');
    if (this._userService.user_current != undefined) {
      if (this.video) {
        let a = this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.video.title
        );
        var video: any = document.getElementById('player');
        if (a == -1) {
          let obj = new Treeid();
          if (!this.videoId) {
            obj._id = '/Videos/' + this.albumId;
            obj.time = '';
          } else {
            obj._id = '/Videos/' + this.albumId + '/' + this.video._id;
            obj.time = video.currentTime;
          }
          obj.title = this.video.title;
          this._userService.user_current.urlHistory.unshift(obj);
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
          //console.log('inserting ' + obj);
        }
      }
      let b = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == this.album.title
      );
      if (b != -1) {
        // console.log(
        //   'updating ' + this._userService.user_current.urlHistory[b].title
        // );
        if (
          this._userService.user_current.urlHistory[b].time != this.video._id
        ) {
          this._userService.user_current.urlHistory[b].time = this.videoId
            ? this.videoId
            : '';
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
        }
      }
    }
  }

  atTime() {
    if (this._userService.user_current) {
      let index = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == this.video.title
      );
      if (this._userService.user_current.urlHistory && index != -1) {
        var res = this._userService.user_current.urlHistory[index].time;
        this.usertime = res;
        var test = this.usertime;
        return this._cmsService.secondsToHms(test);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  lastTimeReset() {
    this.usertime = 0;
    let index = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    this._userService.user_current.urlHistory[index].time = '0';
    this._userService.saveuser(this._userService.user_current).subscribe();
  }

  fullscreen(url) {
    document.getElementById('PopupDiv').innerHTML =
      "<img src='" + url + "' alt='' />";
    document.getElementById('homepage').style.opacity = '0.0';
    document.getElementById('homepage').style.position = 'fixed';
  }

  clearPopupDiv() {
    document.getElementById('PopupDiv').innerHTML = '';
    document.getElementById('homepage').style.opacity = '1.0';
    document.getElementById('homepage').style.position = 'relative';
  }

  sortByAlbums() {
    this.allItems.reverse();
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  shuffleAlbum() {
    this._cmsService.shuffle(this.allItems);
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  sortByAlbum() {
    this.allItems.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  getsubs(iso, page) {
    console.log(page.title);
  }

  togglePlaylist() {
    //console.log(document.getElementById('allitems').style.display);
    if (
      document.getElementById('allitems').style.display == 'block' ||
      document.getElementById('allitems').style.display == ''
    ) {
      document.getElementById('allitems').style.display = 'none';
    } else {
      document.getElementById('allitems').style.display = 'block';
    }
  }

  eventslisteners() {
    if (!this.listener) {
      var vid: any = document.getElementById('player');
      var thisp = this;
      vid.addEventListener('playing', function () {
        document.getElementById('player_startbutton').classList.add('hidden');
        document
          .getElementById('player_pausebutton')
          .classList.remove('hidden');
      });

      vid.addEventListener(
        'loadedmetadata',
        function () {
          if (thisp._userService.user_current) {
            let index = thisp._userService.user_current.urlHistory.findIndex(
              (x) => x.title == thisp.video.title
            );
            if (index != -1) {
              var bar = thisp._userService.user_current.urlHistory[index].time;
            }
          }
        },
        false
      );

      var dhis = this;
      vid.addEventListener('pause', function () {
        dhis.saveVideoLastTime();
        if (document.getElementById('player_status')) {
          document.getElementById('player_status').innerHTML =
            ' Paused ' + dhis.video.title;
          document
            .getElementById('player_startbutton')
            .classList.remove('hidden');
          document.getElementById('player_pausebutton').classList.add('hidden');
        }
      });

      window.addEventListener('beforeunload', (event) => {
        // thisp._userService.user_current.urlHistory[thisp.urlHistoryVideo].time =
        //   vid.currentTime;
        // thisp._userService.update(thisp._userService.user_current).subscribe();
      });

      vid.addEventListener('play', (event) => {
        if (dhis.allItems && dhis.allItems.length)
          document.getElementById('player_status').innerHTML =
            'Playing ' + dhis.video.title;
        document.getElementById('player_startbutton').classList.add('hidden');
        document
          .getElementById('player_pausebutton')
          .classList.remove('hidden');
        this.setSubtitles();
      });

      vid.addEventListener('timeupdate', function () {
        if (document.getElementById('player_time'))
          document.getElementById('player_time').innerHTML =
            dhis._cmsService.secondsToHms(
              vid.duration - parseInt(vid.currentTime)
            );
        let updated = [];
        let timer = parseInt(vid.currentTime);
        if (timer % 30 == 0 && timer > 0) {
          if (!updated[timer]) {
            dhis.usertime = vid.currentTime;
            dhis.saveVideoLastTime();
            //console.log('Saving video time');
          }
        }
      });

      vid.addEventListener('onloadstart', function () {
        document.getElementById('player_status').innerHTML =
          'Starting to load video';
      });

      vid.addEventListener('ended', function () {
        thisp.player_forward();
        dhis.saveVideoLastTime();
      });
    }
    this.listener = true;
  }

  saveVideoLastTime() {
    var vid: any = document.getElementById('player');
    let index = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    if (
      this._userService.user_current &&
      index != -1 &&
      vid &&
      parseInt(vid.currentTime) >
        parseInt(this._userService.user_current.urlHistory[index].time) + 5
    ) {
      this._userService.user_current.urlHistory[index].time =
        parseInt(vid.currentTime) + 5 <= parseInt(vid.duration)
          ? vid.currentTime
          : 0;
      console.log();
      this._userService.saveuser(this._userService.user_current).subscribe();
    }
  }

  setMovieTime() {
    let test = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    if (this._userService.user_current && test != -1) {
      this._userService.user_current.urlHistory[test].time =
        this.videoPlayer.nativeElement.currentTime;
      //this._userService.user_update(this._userService.user_current).subscribe();
    }
  }

  movieinfotoggle() {
    if (
      document.getElementById('movieinfo').style.display != '' &&
      document.getElementById('movieinfo').style.display != 'none'
    ) {
      document.getElementById('movieinfo').style.display = 'none';
    } else {
      document.getElementById('movieinfo').style.display = 'inline-block';
    }
    if (document.getElementById('movieinfobutton').innerHTML == 'More ...') {
      document.getElementById('movieinfobutton').innerHTML = 'Less ...';
    } else {
      document.getElementById('movieinfobutton').innerHTML = 'More ...';
    }
  }

  player_lastplay() {
    var vid: any = document.getElementById('player');
    let index = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    if (index != -1)
      vid.currentTime = this._userService.user_current.urlHistory[index].time;
    vid.play();
  }

  player_volume_decrease() {
    const newVolume = this.videoPlayer.nativeElement.volume - 0.1;
    if (newVolume > 0) this.videoPlayer.nativeElement.volume = newVolume;
  }

  player_volume_increase() {
    const newVolume = this.videoPlayer.nativeElement.volume + 0.1;
    if (newVolume < 1) this.videoPlayer.nativeElement.volume = newVolume;
  }

  player_pause() {
    this.videoPlayer.nativeElement.pause();
    document.getElementById('player_startbutton').classList.remove('hidden');
    document.getElementById('player_pausebutton').classList.add('hidden');
    document.getElementById('player_status').innerHTML =
      'Paused ' + this.video.title;
  }

  player_mute() {
    if (this.videoPlayer.nativeElement.muted == false) {
      this.videoPlayer.nativeElement.muted = true;
      document
        .getElementById('player_muteoffbutton')
        .classList.remove('hidden');
      document.getElementById('player_muteonbutton').classList.add('hidden');
    } else {
      this.videoPlayer.nativeElement.muted = false;
      document.getElementById('player_muteoffbutton').classList.add('hidden');
      document.getElementById('player_muteonbutton').classList.remove('hidden');
    }
  }

  sortByTitle() {
    this.allItems.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setVideoLink(0, this.pagedItems[0]);
    this.setPage(0);
    this.videoId = this.pagedItems[0]._id;
    this.video = this.pagedItems[0];
  }

  shuffle() {
    this._cmsService.shuffle(this.allItems);
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setVideoLink(0, this.pagedItems[0]);
  }

  shufflemovies() {
    this._cmsService.shuffle(this.allItems);
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(1);
    this.setVideoLink(0, this.pagedItems[0]);
  }

  shuffle2() {
    this._cmsService.shuffle(this.allItems);
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(1);
    this.setVideoLink(0, this.pagedItems[0]);
  }

  sortBy() {
    this.allItems.reverse();
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setVideoLink(0, this.pagedItems[0]);
    this.setPage(0);
    this.videoId = this.pagedItems[0]._id;
    this.video = this.pagedItems[0];
  }

  checkAssetFileResult(res, fname, id) {
    if (res == 'jpg' || res == 'gif' || res == 'png')
      document
        .getElementById('detailimage')
        .setAttribute(
          'src',
          '/api/assets/content/' + id + '/' + fname + '.' + res
        );
  }

  filterKeyword(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterText = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterText')).value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      var f = document.getElementsByClassName('blok_movie');
      (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
        shis.allItems.length + ' results';
      document.getElementById('pagination').classList.remove('hidden');
    } else {
      let f = document.getElementsByClassName('blok_movie');
      (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
        f.length + ' results';
      document.getElementById('pagination').classList.add('hidden');
    }
  }

  filterSelectRating(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterRatings = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterRating')).value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 500);
    }
  }

  filterSelectFirstletter(event) {
    var e = (<HTMLInputElement>document.getElementById('filterFirstletter'))
      .value;
    var shis = this;
    this.pagedItems = this.allItems;
    this._filterService.filterFirstletter = event.target.value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      var f = document.getElementsByClassName('blok_movie');
      (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
        shis.allItems.length + ' results';
      document.getElementById('pagination').classList.remove('hidden');
    } else {
      var f = document.getElementsByClassName('blok_movie');
      (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
        f.length + ' results';
      document.getElementById('pagination').classList.add('hidden');
    }
  }

  filterInputFavorites(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterFavorites = '';
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterfavorites'))
      .value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 500);
    }

    if (event.target.value == 'true') {
      var fser = this._filterService;
      this._userService.user_current.movies.forEach(function (s) {
        fser.filterFavorites += s._id + ' ';
      });
    } else if (event.target.value == 'false') {
      var guser = this._userService;
      var gsys = this.pagedItems;
      var fser = this._filterService;

      this.pagedItems.forEach(function (s) {
        if (guser.user_current.movies.indexOf(s._id) != -1) {
        } else {
          fser.filterFavorites += s._id + ' ';
        }
      });
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    }
  }

  filterSelectGenre(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterGenre = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterMovieGenre'))
      .value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' results';
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
        file:
          'api/assets/music/Albums/' + this.pagedItems[i].schemaextend[0].url,
      });
    }
    //this.tracks = playlist_text;
  }

  loadTrack(index) {
    this.videoPlayer.nativeElement.load();
  }

  player_play(next = false) {
    if (next == true) {
      this.playTrack(this.playListIndex);
    } else {
      this.videoPlayer.nativeElement.play();
    }

    //this.playTrack(this.playListIndex);
  }

  playTrack(index) {
    document.getElementById('enTrack').setAttribute('src', '');
    document.getElementById('nlTrack').setAttribute('src', '');
    if (
      this._userService.getUserLoggedIn() == true &&
      this.video &&
      document.getElementById('player')
    ) {
      //console.log(!this.videoPlayer.nativeElement.src.includes(this.video._id));
      if (
        this.videoPlayer.nativeElement.src == '' ||
        this.videoPlayer.nativeElement.src.includes(this.video._id) == false
      ) {
        this.videoPlayer.nativeElement.src =
          this.mediaPath + this.video._id + '/main.mp4';
      }

      //this.setVideoTime();
      let index = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == this.video.title
      );
      if (
        index != -1 &&
        this._userService.user_current.urlHistory[index].time > 0
      ) {
        this.videoPlayer.nativeElement.currentTime =
          this._userService.user_current.urlHistory[index].time;
      }
      (<HTMLInputElement>(
        document.getElementById('player_pausebutton')
      )).classList.remove('hidden');
      (<HTMLInputElement>(
        document.getElementById('player_startbutton')
      )).classList.add('hidden');
      //this.played = true;
      //this.videoPlayer.nativeElement.play();
      //if ((<HTMLVideoElement>document.getElementById('player')).muted == true) {
      // setTimeout(function () {
      //   (<HTMLVideoElement>document.getElementById('player')).muted = false;
      // }, 2000);
      //}
    }
  }

  player_skip() {
    var time = document.getElementById('player').getAttribute('currentTime');
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime + 60;
  }

  player_skipbackward() {
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime - 60;
  }

  topscroller(index) {
    setTimeout(function () {
      const anchor = document.getElementById('pagez' + index);
      if (document.getElementById('pagez' + index)) anchor.scrollIntoView();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 1000);
  }

  updateHits(item) {
    var hits = item && item.hits ? item.hits : 0;
    item.hits = hits + 1;
    this._cmsService.page_update(item).subscribe();
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

  clearSearchFilters() {
    this._filterService.filterFirstletter = '';
    this._filterService.filterGenre = '';
    this._filterService.filterRatings = '';
    this._filterService.filterFavorites = '';
    this._filterService.filterText = '';
  }

  setVideoLink2(index, video) {
    this.scrollToTop();
    this.updateHits(video);
    this.videoId = video._id;
    this.albumId = video.parent;
    this.video = video;
    this.videoId = video._id;
    var b = this.allItems
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.video._id);
    var bindex = (b + 1) / 10;
    var page = Math.ceil(bindex);

    if (page > 1) {
      //this.setPage(Math.ceil(bindex));
      this.setPage(page);
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
    } else {
      var a = this.pagedItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.videoId);
    }
    this.setUrlHistory();
    if (this._userService.user_current) {
      this.playTrack(this.playListIndex);
      //console.log('setVideoLinnk2');
    }
  }

  setVideoLink(index, video) {
    //console.log(video);
    this.scrollToTop();
    this.clearSearchFilters();
    if (
      video.parent == '5c0d45ea64c6c530246b568a' ||
      video.parent == '5c0d45ea64c6c530246b568b'
    ) {
      if (this._userService.user_current && this.video) {
        var vid: any = document.getElementById('player');
        let test = this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.video.title
        );
        if (this._userService.user_current && test != -1) {
          this._userService.user_current.urlHistory[test].time =
            parseInt(vid.currentTime) + 5 <= parseInt(vid.duration)
              ? vid.currentTime
              : 0;
          // this._userService
          //   .saveuser(this._userService.user_current)
          //   .subscribe();
        }
      }
      this.videoId = video._id;
      this.playListIndex = index;
      this.video = video;
      if (this._userService.user_current) {
        document.getElementById('player_status').innerHTML =
          'Playing ' + this.video.title;
        this.setUrlHistory();
        this.updateHits(video);
      }
      if (document.getElementById('detailimage'))
        document
          .getElementById('detailimage')
          .setAttribute(
            'src',
            '/api/assets/content/' + video._id + '/image.jpg'
          );
      this.playTrack(this.playListIndex);
      //console.log('setVideoLinnk a');
      // this._cmsService.subtitleLang = [];
      // this._cmsService.subtitleBase.forEach((res) => {
      //   this._cmsService
      //     .checkAssetFile2(res + '.vtt', '', this.video._id)
      //     .subscribe((rest) =>
      //       this._cmsService.setsubslang(rest, res, this.video._id)
      //     );
      // });
      this.playListIndex2 = this.allItems.findIndex(
        (x) => x.title == video.title
      );

      this.topscroller(this.playListIndex2);
      if (!this.listener) this.eventslisteners();

      this._cmsService.scontext(video);
      console.log('eh1');
    } else if (
      video.parent == '5c0d45ea64c6c530246b568c' ||
      video.parent == '5c0d45ea64c6c530246b5690' ||
      video.parent == '5c0d45ea64c6c530246b5691' ||
      video.parent == '5c0d45ea64c6c530246b568f'
    ) {
      console.log('eh2 ' + this.allItems[index].title);
      //this.video = this.allItems[0];
      //this.videoId = this.allItems[0]._id;
      this.albumId = video.parent;
      //this.setUrlHistory();
      this.updateHits(video);
      this.playListIndex = 0;
      this.topscroller(0);
      this._cmsService.scontext(video);
      this.router.navigate(['/Videos/' + video._id]);
    } else {
      console.log('eh3');
      this.updateHits(video);
      this.videoId = video._id;
      this.albumId = video.parent;
      this.playListIndex = index;
      this.video = video;
      this.playListIndex2 = this.allItems.findIndex(
        (x) => x.title == video.title
      );

      var b = this.allItems
        .map(function (e) {
          return e._id;
        })
        .indexOf(this.video._id);
      var bindex = (b + 1) / 10;
      var page = Math.ceil(bindex);
      this.playListIndexTotal = b;

      if (page > 1) {
        //this.setPage(Math.ceil(bindex));
        this.setPage(page);
        var a = this.pagedItems
          .map(function (e) {
            return e._id;
          })
          .indexOf(this.videoId);
      } else {
        var a = this.pagedItems
          .map(function (e) {
            return e._id;
          })
          .indexOf(this.videoId);
      }
      this.playListIndex = a;
      this.setUrlHistory();
      if (document.getElementById('pagez' + b)) this.topscroller(b);
      if (this._userService.user_current) {
        this.playTrack(this.playListIndex);
        //console.log('setVideoLinnk b');
      }
      if (!this.listener) this.eventslisteners();
      this._cmsService.scontext(video);
    }
  }

  dateFormat(date) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let formattedToday = dd + '/' + mm + '/' + yyyy;
    return formattedToday;
  }

  setTitle(res) {
    if (document.getElementById('title'))
      document.getElementById('title').innerHTML = this.album.title;
  }

  player_forward() {
    this.playListIndex++;
    //console.log(this.playListIndex + ' | ' + this.pager.currentPage + ' | ' + this.pager.totalPages);
    if (
      this.playListIndex == 10 &&
      this.pager.currentPage != this.pager.totalPages
    ) {
      this.setPage(this.pager.currentPage + 1);
      this.playListIndex = 0;
    }
    this.setVideoLink(this.playListIndex, this.pagedItems[this.playListIndex]);
  }

  player_backward() {
    if (this.playListIndex > 0) {
      this.playListIndex--;
      this.setVideoLink2(
        this.playListIndex,
        this.pagedItems[this.playListIndex]
      );
    } else {
      this.playListIndex = 1;
      this.setPage(1);
    }
  }

  setPage(counter: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, counter);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    // console.log(typeof this.pager);
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
}
