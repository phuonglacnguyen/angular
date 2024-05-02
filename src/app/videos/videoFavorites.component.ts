import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from './../../models/page';
import { Treeid } from './../../models/treeid';

@Component({
  selector: 'app-videoFavorites',
  templateUrl: './videoFavorites.component.html',
  styleUrls: ['./videoFavorites.component.css'],
})
export class MoviesFavoritesComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer;
  @ViewChild('videoSource') videoSource;
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterGenre;
  @Input() filterFavorites;
  @Input() filterRating;
  album: Page = new Page();
  albumId: string = '';
  videoId: string = '';
  video: Page = new Page();
  mediaPath = '/api/assets/content/';
  allItems: Array<Page> = [];
  allItems2: Array<Page> = [];
  pager: any = {};
  pager2: any = {};
  pagedItems: Array<Page> = [];
  pagedItems2: Array<Page> = [];
  playerTime: number = 0;
  playListIndex: number = 1;
  playListIndex2: number = 1;
  playListIndex3: number = 0;
  lastEpisodeIndex: string = '';
  playListIndexTotal: number = 0;
  usertime: number = 0;
  parent: Page = new Page();
  userVideoTime: number = 0;
  listener: boolean = false;
  videoTimeSet: boolean = false;
  defaultLangSet = false;
  SubtitleTrackset = false;
  urlHistoryAlbum: number = -1;
  urlHistoryVideo: number = -1;

  constructor(
    public _userService: UserService,
    public _cmsService: CmsService,
    public _filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.albumId = params['parent'];
      this.videoId = params['id'];
      if (this.videoId != undefined) {
        this.setVideo();
      } else {
        //if(document.getElementById('player'))
        //  document.getElementById('player').setAttribute('src','');
      }
      if (
        this.albumId == '5c0d45ea64c6c530246b568c' ||
        this.albumId == '5c0d45ea64c6c530246b568f' ||
        this.albumId == '5c0d45ea64c6c530246b568a' ||
        this.albumId == '5c0d45ea64c6c530246b568b'
      ) {
        this._cmsService.getPagesDesc(this.albumId).subscribe();
      }
    });
    this.filterFirstletter = '';
    this.filterGenre = '';
    this.filterRating = '';
    this.filterFavorites = 'false';
    document.querySelector('#search').classList.remove('hidden');
    document.getElementById('search').setAttribute('display', 'inline-block');

    let dhis = this;
    if (this._cmsService.moviesFavArray.length == 0) {
      if (this._userService.user_current) {
        dhis.setFavMusic();
      } else {
        setTimeout(function () {
          dhis.setFavMusic();
        }, 4000);
      }
    }

    this._cmsService.updateLoginEvent.subscribe((pageSelected: Page) =>
      this.setFavMusic()
    );
  }

  setFavMusic() {
    let dhis = this;
    this._userService.user_current.movies.forEach(function (value, index) {
      dhis._cmsService.moviesFavArray.push(value._id);
    });

    this._cmsService
      .getAlbumsByArray(this._cmsService.moviesFavArray)
      .subscribe((res) => this.setmovieFavs(res));
  }

  setmovieFavs(res) {
    this._userService.user_current.movies_tmp = res;
    this._cmsService.allItems2 = res;
    //this._cmsService.shuffle(this._userService.user_current.movies_tmp);
    this._cmsService.pager2 = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      1
    );
    this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
      this._cmsService.pager2.startIndex,
      this._cmsService.pager2.endIndex + 1
    );

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

  ngOnInit() {
    // if(this._userService.user_current != undefined) {
    //   var favs = this._userService.user_current.favorites.length;
    //   var rand = Math.floor(Math.random() * favs);
    //   if(rand) {
    //     var url = '/api/assets/content/'+this._userService.user_current.favorites[rand]._id+'/main.jpg';
    //   }
    // }
  }

  seen(page) {
    let index = this._userService.user_current.urlHistory
      .map(function (e) {
        return e.title;
      })
      .indexOf(page.title);
    if (index != -1) {
      return 'Seen';
    } else {
      return '';
    }
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

  toggleFavorite(page, title) {
    if (this._userService.user_current != undefined) {
      var a = this._userService.user_current.movies
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      var b = this._userService.user_current.movies_tmp
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      var c = this._cmsService.allItems2
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      if (a == -1) {
        let obj = {};
        obj['_id'] = '/Videos/' + page._id;
        obj['time'] = '0';
        obj['title'] = title;
        this._userService.user_current.movies.push(obj);
        this._userService.user_current.movies_tmp.push(page);
        document.getElementById('fav' + page._id).classList.add('icmn-heart7');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart8');
      } else {
        this._userService.user_current.movies.splice(a, 1);
        this._userService.user_current.movies_tmp.splice(b, 1);
        document.getElementById('fav' + page._id).classList.add('icmn-heart8');
        document
          .getElementById('fav' + page._id)
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
        let obj = {};
        obj['_id'] = '/Videos/' + id;
        obj['time'] = '0';
        obj['title'] = title;
        this._userService.user_current.movies.push(obj);
      } else {
        this._userService.user_current.movies.splice(a, 1);
      }
      this._userService.saveuser(this._userService.user_current).subscribe();
    }
  }

  setSubtitleTrack(id, iso) {
    for (var i = 0; i < this.videoSource.textTracks.length; i++) {
      this.videoSource.textTracks[i].mode = 'hidden';
    }
    let trackName = iso.replace('GB', 'en').toLowerCase().trim();
    document
      .getElementById(trackName + 'Track')
      .setAttribute('src', '/api/assets/content/' + id + '/' + iso + '.vtt');
    let trackElem: any = document.querySelector('#' + trackName + 'Track');
    let track = trackElem.track;
    track.mode = 'showing';
    this.defaultLangSet = true;
  }

  allItemsReadyInfo() {
    console.log('allItemsReadyInfo');
    this.setPage(0);
    var b = this.allItems2
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
      this.playTrack(this.playListIndex);
    }
    this.playListIndexTotal = b;
  }

  settime(seconds) {
    if (seconds > 0) {
      this.videoPlayer.nativeElement.currentTime = seconds;
    }
  }

  setVideoTime() {
    if (this._userService.user_current && this.video) {
      this.urlHistoryVideo =
        this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.video.title
        );
      if (this.urlHistoryVideo != -1 && document.getElementById('player')) {
        this.userVideoTime =
          this._userService.user_current.urlHistory[this.urlHistoryVideo].time;
        if (this._userService.user_current.urlHistory[this.urlHistoryVideo]) {
          this.settime(
            this._userService.user_current.urlHistory[this.urlHistoryVideo].time
          );
        }
      }
    }
  }

  setUrlHistory(page) {
    //console.log('setUrlHistory');
    if (this._userService.user_current != undefined) {
      this.urlHistoryAlbum =
        this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.album.title
        );

      if (page.objectType == '5c0114dc962a560534e3e576') {
        this.urlHistoryVideo =
          this._userService.user_current.urlHistory.findIndex(
            (x) => x.title == page.title
          );
        if (this.urlHistoryVideo == -1) {
          let obj = new Treeid();
          if (
            document.getElementById('player') &&
            this.videoPlayer.currentTime
          ) {
            obj._id = '/Videos/' + this.albumId + '/' + this.video._id;
            obj.time = this.videoPlayer.currentTime;
          } else {
            obj._id = '/Videos/' + this.albumId + '/' + this.video._id;
            obj.time = '0';
          }
          obj.title = page.title;
          this._userService.user_current.urlHistory.unshift(obj);
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
          //console.log('Video inserted in URLHistory ' + this.video.title);
        } else {
          // console.log(
          //   this._userService.user_current.urlHistory[this.urlHistoryAlbum]
          //     .time +
          //     ' ' +
          //     page._id
          // );
          let b = this._userService.user_current.urlHistory.findIndex(
            (x) => x.title == this.album.title
          );
          if (b != -1) {
            // console.log(
            //   'updating ' + this._userService.user_current.urlHistory[b].title
            // );
            if (
              this._userService.user_current.urlHistory[b].time !=
              this.video._id
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
      if (this.album) {
        //console.log(this.album.title);

        if (this.urlHistoryAlbum == -1) {
          //console.log('Album inserted in URLHistory ' + this.album.title);
          let obj = new Treeid();
          obj._id = '/Videos/' + page._id;
          obj.time = this.video ? this.video._id : '0';
          obj.title = page.title;
          this._userService.user_current.urlHistory.unshift(obj);
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
        } else {
          // console.log(
          //   'Album updated in URLHistory ' +
          //     this.album.title +
          //     ' ' +
          //     this.video.title
          // );
          if (
            this._userService.user_current.urlHistory[this.urlHistoryAlbum]
              .time != this.video._id
          ) {
            this._userService.user_current.urlHistory[
              this.urlHistoryAlbum
            ].time = this.video ? this.video._id : '0';

            this._userService
              .saveuser(this._userService.user_current)
              .subscribe();
          }
        }
      }
    }
  }

  togglePlaylist() {
    if (
      document.getElementById('allitems').style.display == 'block' &&
      document.getElementById('allitems').style.display != ''
    ) {
      document.getElementById('allitems').style.display = 'none';
    } else {
      document.getElementById('allitems').style.display = 'block';
    }
  }

  lastTimeReset() {
    //console.log('lastTimeReset');
    this.userVideoTime = 0;
    let index = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    this._userService.user_current.urlHistory[index].time = '0';

    this._userService.saveuser(this._userService.user_current).subscribe();
  }

  eventslisteners() {
    var vid: any = document.getElementById('player');
    var thisp = this;
    //if(this.video)
    this.urlHistoryVideo = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    //let time = (this._userService.user_current.urlHistory[this.urlHistoryVideo].time);
    if (!this.listener) {
      vid.addEventListener('playing', function () {
        document.getElementById('player_status').innerHTML =
          'Playing ' + thisp.video.title;
      });

      // vid.addEventListener('loadedmetadata', function() {
      //   if(thisp._userService.user_current) {
      //     if(thisp.urlHistoryVideo != -1) {
      //       var bar = thisp._userService.user_current.urlHistory[thisp.urlHistoryVideo].time;
      //     }
      //   }
      // }, false);

      vid.addEventListener('pause', function () {
        thisp.saveVideoLastTime(thisp.video);
        if (document.getElementById('player_status'))
          document.getElementById('player_status').innerHTML =
            ' Paused ' + thisp.video.title;
      });

      window.addEventListener('beforeunload', (event) => {
        //thisp.saveVideoLastTime(thisp.video);
      });

      vid.addEventListener('play', (event) => {
        this.setVideoTime();
        this.setSubtitles();
        document.getElementById('player_startbutton').classList.add('hidden');
        document
          .getElementById('player_pausebutton')
          .classList.remove('hidden');
      });

      vid.addEventListener('timeupdate', function () {
        let timer = parseInt(vid.currentTime);
        if (document.getElementById('player_time'))
          document.getElementById('player_time').innerHTML =
            thisp._cmsService.secondsToHms(
              vid.duration - parseInt(vid.currentTime)
            );
        thisp.saveVideoTime(timer);
      });

      vid.addEventListener('onloadstart', function () {
        document.getElementById('player_status').innerHTML =
          'Starting to load video';
      });

      vid.addEventListener('ended', function () {
        thisp.player_forward();
      });
    }
    this.listener = true;
  }

  saveVideoTime(timer) {
    var vid: any = document.getElementById('player');
    let index = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == this.video.title
    );
    let updated = [];
    if (timer % 30 == 0 && timer > 0) {
      if (
        !updated[timer] &&
        this._userService.user_current.urlHistory[this.urlHistoryVideo]
      ) {
        //console.log('saveVideoTime');
        updated[timer] = timer;
        this.userVideoTime = timer;
        if (
          parseInt(vid.currentTime) >
          parseInt(this._userService.user_current.urlHistory[index].time) + 5
        ) {
          //console.log('saveVideoTime 2');
          this._userService.user_current.urlHistory[this.urlHistoryVideo].time =
            this.userVideoTime;
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
        }
      }
    }
  }

  saveVideoLastTime(page) {
    let vid: any = document.getElementById('player');
    this.urlHistoryVideo = this._userService.user_current.urlHistory.findIndex(
      (x) => x.title == page.title
    );
    if (
      this._userService.user_current &&
      this.urlHistoryVideo != -1 &&
      vid &&
      vid.currentTime
    ) {
      if (
        this.urlHistoryVideo != -1 &&
        page.objectType == '5c0114dc962a560534e3e576'
      ) {
        this._userService.user_current.urlHistory[this.urlHistoryVideo].time =
          parseInt(vid.currentTime) + 5 <= parseInt(vid.duration)
            ? vid.currentTime
            : 0;
        this.userVideoTime =
          this._userService.user_current.urlHistory[this.urlHistoryVideo].time;
        this._userService.saveuser(this._userService.user_current).subscribe();
      } else if (
        this.urlHistoryVideo == -1 &&
        page.objectType == '5c0114dc962a560534e3e576'
      ) {
        // video
        let obj = {};
        obj['_id'] = '/Videos/' + this.albumId + '/' + this.video._id;
        obj['time'] =
          parseInt(vid.currentTime) + 5 <= parseInt(vid.duration)
            ? vid.currentTime
            : 0;
        obj['title'] = this.video.title;
        this._userService.user_current.urlHistory.unshift(obj);
        this._userService.saveuser(this._userService.user_current).subscribe();
      } else if (
        this.urlHistoryVideo != -1 &&
        page.objectType != '5c0114dc962a560534e3e576'
      ) {
        // video
        if (
          parseInt(vid.currentTime) >
          parseInt(
            this._userService.user_current.urlHistory[this.urlHistoryVideo].time
          ) +
            5
        ) {
          this._userService.user_current.urlHistory[this.urlHistoryVideo].time =
            this.video._id;
          this._userService
            .saveuser(this._userService.user_current)
            .subscribe();
        }
      } else if (this.urlHistoryVideo == -1) {
        let obj = {};
        obj['_id'] = '/Videos/' + this.albumId;
        obj['time'] = this.videoId ? this.videoId : 0;
        obj['title'] = this.album.title;
        this._userService.user_current.urlHistory.unshift(obj);
        this._userService.saveuser(this._userService.user_current).subscribe();
      }
    }
  }

  setSubtitles() {
    if (this._userService.user_current && this.video) {
      this.video.schemaextend[0].subtitles.forEach((res) => {
        this._cmsService.setsubs('vtt', res.ISO, this.video._id);
      });
    }
  }

  setMovieTime() {
    if (!this.urlHistoryVideo)
      this.urlHistoryVideo =
        this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.video.title
        );
    if (this._userService.user_current && this.urlHistoryVideo != -1) {
      this._userService.user_current.urlHistory[this.urlHistoryVideo].time =
        this.videoPlayer.nativeElement.currentTime;
      this._userService.saveuser(this._userService.user_current).subscribe();
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
    this.allItems2.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.pager = this.pagerService.getPager(this.allItems2.length, 10);
    this.pagedItems = this.allItems2.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setVideoLink(0, this.pagedItems[0]);
    this.setPage(0);
    this.videoId = this.pagedItems[0]._id;
    this.video = this.pagedItems[0];
  }

  shuffle() {
    this._cmsService.shuffle(this._cmsService.allItems2);
    this.pager = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      10
    );
    this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
    this.setVideoLink(0, this._cmsService.pagedItems2[0]);
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
    this.allItems2 = this._cmsService.shuffle(this.allItems2);
    this.setVideoLink2(0, this.allItems2[0]);
  }

  sortBy() {
    this.allItems2.reverse();
    this.setVideoLink2(0, this.allItems2[0]);
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

  sortByAlbums() {
    this._cmsService.allItems2.reverse();
    this.pager = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      10
    );
    this.pagedItems = this._cmsService.allItems2.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  shuffleAlbum() {
    this._cmsService.shuffle(this._cmsService.allItems2);
    this.pager = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      10
    );
    this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  sortByAlbum() {
    this._cmsService.allItems2.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.pager = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      10
    );
    this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  filterKeyword(event) {
    this._cmsService.pagedItems2 = this._cmsService.allItems2;
    this._filterService.filterText = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterText')).value;
    if (!e) {
      this.pager = this.pagerService.getPager(
        this._cmsService.allItems2.length
      );
      this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis._cmsService.allItems2.length + ' results';
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

  filterSelectRating(event) {
    this._cmsService.pagedItems2 = this._cmsService.allItems2;
    this._filterService.filterRatings = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterRating')).value;
    if (!e) {
      this.pager = this.pagerService.getPager(
        this._cmsService.allItems2.length
      );
      this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis._cmsService.allItems2.length + ' results';
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
    this._cmsService.pagedItems2 = this._cmsService.allItems2;
    this._filterService.filterFirstletter = event.target.value;
    if (!e) {
      this.pager = this.pagerService.getPager(
        this._cmsService.allItems2.length
      );
      this.pagedItems = this._cmsService.allItems2.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis._cmsService.allItems2.length + ' results';
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
    this._cmsService.pagedItems2 = this._cmsService.allItems2;
    this._filterService.filterGenre = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterMovieGenre'))
      .value;
    if (!e) {
      this.pager = this.pagerService.getPager(
        this._cmsService.allItems2.length
      );
      this._cmsService.pagedItems = this._cmsService.allItems2.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_movie');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis._cmsService.allItems2.length + ' results';
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
    for (var i = 0; i < this._cmsService.pagedItems2.length; i++) {
      playlist_text.push({
        _id: this._cmsService.pagedItems2[i]._id,
        track: i,
        title: this._cmsService.pagedItems2[i].title,
        videowidth: this._cmsService.pagedItems2[i].schemaextend[0].videowidth,
        videoheight:
          this._cmsService.pagedItems2[i].schemaextend[0].videoheight,
        videocodec: this._cmsService.pagedItems2[i].schemaextend[0].videocodec,
        filesiz: this._cmsService.pagedItems2[i].schemaextend[0].filesiz,
        fileextension:
          this._cmsService.pagedItems2[i].schemaextend[0].fileextension,
        year: this._cmsService.pagedItems2[i].schemaextend[0].year,
        dateandtime:
          this._cmsService.pagedItems2[i].schemaextend[0].dateandtime,
        moviegenre: this._cmsService.pagedItems2[i].schemaextend[0].moviegenre,
        imdb: this._cmsService.pagedItems2[i].schemaextend[0].imdb,
        imdbrating: this._cmsService.pagedItems2[i].schemaextend[0].imdbrating,
        content: this._cmsService.pagedItems2[i].schemaextend[0].content,
        file:
          'api/assets/music/Albums/' +
          this._cmsService.pagedItems2[i].schemaextend[0].url,
      });
    }
    //this.tracks = playlist_text;
  }

  loadTrack(index) {
    this.videoPlayer.nativeElement.load();
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

  player_play() {
    var vid: any = document.getElementById('player');
    //if(this.videoPlayer.src != '') {
    //  this.playTrack(this.playListIndex);
    //  console.log('1');
    //} else {
    //  console.log('2');
    vid.play();
    //}
    document.getElementById('player_status').innerHTML =
      'Playing ' + this.video.title;
    document.getElementById('player_startbutton').classList.add('hidden');
    document.getElementById('player_pausebutton').classList.remove('hidden');
  }

  // check_subtitles() {
  //   this._cmsService.pagedItems2.forEach((page, index) => {
  //     this._cmsService.pagedItems2[index].schemaextend[0].subtitles = [];
  //     this._cmsService.subtitleBase.forEach((iso) => {
  //       this._cmsService
  //         .checkAssetFile(iso, '', page._id)
  //         .subscribe((result) => this.getsubsReady(index, result, iso));
  //     });
  //   });
  // }

  getsubsReady(index, res, iso) {
    if (res != 'no') {
      const newsubs = { ISO: iso };
      this._cmsService.pagedItems2[index].schemaextend[0].subtitles.push(
        newsubs
      );
    }
  }

  setsubs(res, name, id) {
    let filesplit = name.split('.');
    let fileName = filesplit[0];
    //let nameconvert = fileName.replace('GB', 'en').toLowerCase();
    if (res != 'no') {
      // document
      //   .getElementById(nameconvert + 'Track')
      //   .setAttribute(
      //     'src',
      //     '/api/assets/content/' + id + '/' + filesplit[0] + '.vtt'
      //   );
      if (!this.SubtitleTrackset) {
        this.setSubtitleTrack(id, fileName);
        this.SubtitleTrackset = true;
      }
    }
  }

  playTrack(index) {
    //console.log('playTrack');
    document.getElementById('enTrack').setAttribute('src', '');
    document.getElementById('nlTrack').setAttribute('src', '');

    document
      .getElementById('player')
      .setAttribute(
        'src',
        '/api/assets/content/' + this.video._id + '/main.mp4'
      );

    // if (this.video.schemaextend[0].subtitles) {
    //   this.video.schemaextend[0].subtitles.forEach((res) => {
    //     this.setsubs(
    //       'api/assets/content/' + this.video._id + '/',
    //       res.ISO + '.vtt',
    //       this.video._id
    //     );
    //   });
    // }
    //this._cmsService.subtitleBase.forEach(res => {
    //  this._cmsService.checkAssetFile2(res+".vtt", "", this.video._id).subscribe(rest => this.setsubs(rest, res+'.vtt', this.video._id));
    //});

    //(<HTMLInputElement>document.getElementById('player_pausebutton')).classList.remove('hidden');
    //(<HTMLInputElement>document.getElementById('player_startbutton')).classList.add('hidden');
    //this.videoTimeSet = true;
    //this.played = true;
    //this.videoPlayer.nativeElement.play();
  }

  setVideo() {
    this._cmsService
      .getcms(this.videoId)
      .subscribe((result) => this.setVideoReady(result));
  }

  setVideoReady(video) {
    console.log('setVideoReady');
    this.video = video;
    this.playTrack(this.playListIndex);
    if (this._userService.user_current) {
      let index = this._userService.user_current.urlHistory.findIndex(
        (x) => x.title == this.video.title
      );
      if (
        index != -1 &&
        this._userService.user_current.urlHistory[index].time > 0
      ) {
        this.videoPlayer.nativeElement.currentTime =
          this._userService.user_current.urlHistory[index].time;
        this.videoTimeSet = true;
      }
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
    if (document.getElementById('pagez' + index)) {
      const anchor = document.getElementById('pagez' + index);
      anchor.scrollIntoView();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }

  updateHits(item) {
    var hits = item.hits ? item.hits : 0;
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

  setVideoLink2(index, video, up?) {
    if (up === true) this.playListIndex3 = index;

    this.video = video;
    this.videoId = video._id;
    var videoplayer: any = document.getElementById('player');
    document
      .getElementById('player')
      .setAttribute('src', '/api/assets/content/' + video._id + '/main.mp4');
    //this.setVideoTime();
    //if(!this.listener)
    this.eventslisteners();
    //if(!this.urlHistoryVideo)
    //this.setUrlHistoryAlbum(this.album);
    this.setUrlHistory(video);

    // this.urlHistoryVideo = this._userService.user_current.urlHistory.findIndex(
    //   (x) => x.title == video.title
    // );
    // //if(!this.urlHistoryAlbum)
    // //this.urlHistoryAlbum = this._userService.user_current.urlHistory.findIndex( x => x.title == this.album.title);
    // if (this.urlHistoryVideo == -1) {
    //   let obj = {};
    //   obj['_id'] = '/Videos/' + this.albumId + '/' + video._id;
    //   obj['time'] = videoplayer.currentTime ? videoplayer.currentTime : '0';
    //   obj['title'] = video.title;
    //   this._userService.user_current.urlHistory.unshift(obj);
    //   this._userService.user_update(this._userService.user_current).subscribe();
    // }
    // this.urlHistoryAlbum = this._userService.user_current.urlHistory.findIndex(
    //   (x) => x.title == this.album.title
    // );
    // if (
    //   this.urlHistoryAlbum != -1 &&
    //   this._userService.user_current.urlHistory[this.urlHistoryAlbum].time !=
    //     this.video._id
    // ) {
    //   this._userService.user_current.urlHistory[this.urlHistoryAlbum].time =
    //     video._id;
    //   console.log(
    //     this.urlHistoryAlbum +
    //       ' ' +
    //       this._userService.user_current.urlHistory[this.urlHistoryAlbum].time
    //   );
    //   this._userService.user_update(this._userService.user_current).subscribe();
    // } else {
    //   let obj = {};
    //   obj['_id'] = '/Videos/' + this.albumId;
    //   obj['time'] = video._id;
    //   obj['title'] = this.album.title;
    //   this._userService.user_current.urlHistory.unshift(obj);
    //   this._userService.user_update(this._userService.user_current).subscribe();
    // }
    //this.setUrlHistory(video);

    //if(document.getElementById('title'))
    //  document.getElementById('title').innerHTML = '<< ' + this.album.title;
    if (
      document.getElementById('detailimage') &&
      document.getElementById('detailimage').getAttribute('src') != ''
    )
      document
        .getElementById('detailimage')
        .setAttribute('src', '/api/assets/content/' + video._id + '/image.jpg');

    this.updateHits(video);
    this.playTrack(index);
  }

  videoReady(res) {
    this.video = res;
    //this.setUrlHistory(this.album);
  }

  setVideoLink(index, video, listupdate?) {
    this.allItems2 = [];
    this.playListIndex = index;
    this.player_pause();
    if (listupdate == true) {
      //this.playListIndex = index;
      //if(!this.urlHistoryVideo)
    }
    // this.urlHistoryAlbum = this._userService.user_current.urlHistory.findIndex(
    //   (x) => x.title == video.title
    // );
    if (video.objectType != '5c0114dc962a560534e3e576') {
      //if (this.video) this.saveVideoLastTime(this.video);
      this.album = video;
      this.albumId = video._id;
      //this.setUrlHistory(this.album);
      this._cmsService
        .getPages(this.album._id)
        .subscribe((result) => this.getChildReady(result, video));

      console.log('1');
    } else {
      console.log('2');
      this.albumId = undefined;
      this.playListIndex3 = 0;
      this.allItems2 = [];
      this.album.title = video.title;
      this.video = video;
      this.videoId = video._id;
      this.setVideoTime();
      this.playTrack(index);
      this.setUrlHistory(video);
      this.updateHits(video);
      if (!this.listener) this.eventslisteners();
      if (document.getElementById('title'))
        document.getElementById('title').innerHTML = this.video.title;
    }

    //var c = this._cmsService.allItems2.findIndex((x) => x.title == video.title);
    //this.playListIndex2 = c;
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

  getChildReady(res, album?, index?) {
    //console.log('getChildReady');
    if (album) {
      this.allItems2 = res;
      this.album.cmsSubPages = res;

      this.urlHistoryAlbum =
        this._userService.user_current.urlHistory.findIndex(
          (x) => x.title == this.album.title
        );

      if (this.urlHistoryAlbum != -1) {
        this.lastEpisodeIndex =
          this._userService.user_current.urlHistory[this.urlHistoryAlbum].time;
      }

      let d = this.allItems2.findIndex((x) => x._id == this.lastEpisodeIndex);
      let dhis = this;
      if (d != -1) {
        setTimeout(function () {
          dhis.topscroller(d);
        }, 500);
        this.videoId = this.allItems2[d]._id;
        this.video = this.allItems2[d];
        this.playListIndex3 = d;
        // document
        //   .getElementById('player')
        //   .setAttribute(
        //     'src',
        //     '/api/assets/content/' + this.video._id + '/main.mp4'
        //   );
        //console.log('AA');
        this.playTrack(d);
        this.setVideoTime();
        //this.setUrlHistory(album);
      } else {
        //console.log('BB');
        this.videoId = res[0]._id;
        this.video = res[0];
        //this.playListIndex = 0;
        document
          .getElementById('player')
          .setAttribute(
            'src',
            '/api/assets/content/' + this.video._id + '/main.mp4'
          );
        setTimeout(function () {
          dhis.topscroller(0);
          dhis.playTrack(0);
          dhis.setVideoTime();
        }, 500);
      }
      if (!this.listener) this.eventslisteners();

      // this._cmsService.subtitleLang = [];
      // this._cmsService.subtitleBase.forEach((res) => {
      //   this._cmsService
      //     .checkAssetFile(res, '', this.video._id)
      //     .subscribe((rest) =>
      //       this.setsubs(rest, res + '.vtt', this.video._id)
      //     );
      // });
    }
  }

  player_forward() {
    if (this.allItems2) {
      if (
        this.allItems2.length == this.playListIndex3 + 1 &&
        this.playListIndex == 9 &&
        this._cmsService.pager2.currentPage ==
          this._cmsService.pager2.totalPages
      ) {
        //console.log('1 AA');
        this.playListIndex = 0;
        this.setPage(1);
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex],
          false
        );
      } else if (
        this.allItems2.length == this.playListIndex3 + 1 &&
        this.playListIndex == 9
      ) {
        //console.log('1 AB');
        this.playListIndex = 0;
        this.setPage(this._cmsService.pager2.currentPage + 1);
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex],
          false
        );
      } else if (this.allItems2.length == this.playListIndex3 + 1) {
        //console.log('1 AC');
        this.playListIndex++;
        this.playListIndex3 = 0;
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex],
          false
        );
      } else if (this.playListIndex3 < this.allItems2.length) {
        //console.log('1 Ba');
        this.playListIndex3++;
        this.setVideoLink2(
          this.playListIndex3,
          this.allItems2[this.playListIndex3],
          false
        );
      } else if (this.playListIndex == 9) {
        //console.log('1 BD');
        this.playListIndex = 0;
        this.setPage(this._cmsService.pager2.currentPage + 1);
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex],
          false
        );
      } else if (this.playListIndex3 < this.allItems2.length) {
        this.playListIndex3++;
        this.setVideoLink2(
          this.playListIndex3,
          this.allItems2[this.playListIndex3],
          false
        );
        //console.log('1 BE');
      } else {
        //console.log('1 BF');
        this.playListIndex++;
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex],
          true
        );
      }
    }
  }

  player_backward() {
    if (this.allItems2) {
      if (
        this.playListIndex3 == 0 &&
        this.playListIndex == 0 &&
        this._cmsService.pager2.currentPage == 1
      ) {
        //console.log('Back to last movie');
        this.playListIndex = 9;
        this.setPage(this._cmsService.pager2.totalPages);
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex]
        );
      } else if (this.playListIndex3 == 0 && this.playListIndex > 0) {
        //console.log('Back to previous episode A');
        this.playListIndex--;
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex]
        );
      } else if (this.playListIndex3 > 0) {
        //console.log('Back to previous episode B');
        this.playListIndex3--;
        this.setVideoLink2(
          this.playListIndex3,
          this.allItems2[this.playListIndex3]
        );
      } else if (this.playListIndex == 0) {
        //console.log('Back to previous page movies');
        this.setPage(this._cmsService.pager2.currentPage - 1);
        this.playListIndex = 9;
        this.setVideoLink(
          this.playListIndex,
          this._cmsService.pagedItems2[this.playListIndex]
        );
      } else {
        //console.log('Back to episode');
        this.playListIndex3--;
        this.setVideoLink2(
          this.playListIndex3,
          this.allItems2[this.playListIndex3]
        );
      }
    }
  }

  setPage(counter: number) {
    //this.allItems = this._userService.user_current.movies_tmp;
    this._cmsService.pager2 = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      counter
    );
    this._cmsService.pagedItems2 = this._cmsService.allItems2.slice(
      this._cmsService.pager2.startIndex,
      this._cmsService.pager2.endIndex + 1
    );
  }

  setPage2(counter: number) {
    this.pager2 = this.pagerService.getPager(
      this._cmsService.allItems2.length,
      counter
    );
    this.pagedItems2 = this._cmsService.allItems2.slice(
      this.pager2.startIndex,
      this.pager2.endIndex + 1
    );
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
