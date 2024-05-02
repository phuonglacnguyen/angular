import {
  ElementRef,
  AfterViewInit,
  ViewChild,
  Component,
  OnInit,
  Input,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from '../user/user';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-musicfavorites',
  templateUrl: './musicFavorites.component.html',
  styleUrls: ['./musicFavorites.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MusicFavoritesComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: any; // , { static: true}
  @ViewChild('videoSource') videoSource: any; // , { static: true}
  @Input() filtermusicGenre;
  @Input() filtermusicAlbumGenre;
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterArrayShuffle;
  filterTitleShort;
  activeMenu: string;
  toggleHidden = true;
  albumId;
  albumKids;
  videoId = '';
  video;
  mediaPath = 'api/assets/content/';
  tracks;
  private allItems: any[];
  pager: any = {};
  pagedItems: any[];
  player;
  playerTime;
  playListIndex = 0;
  playersource;
  albums: any = [];
  songs;
  song;
  album;
  currentAlbum = new Page();
  albumgenre;
  type;
  songsReady;
  oldsongs;
  listeners;
  albumurl;
  albumArray: Array<string> = [];
  songArray: Array<string> = [];
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

  constructor(
    private router: Router,
    public _userService: UserService,
    public _cmsService: CmsService,
    public _filterService: FilterService,
    private activatedRoute: ActivatedRoute,
    private pagerService: PagerService,
    private elementRef: ElementRef,
    private changeDetection: ChangeDetectorRef
  ) {
    this._cmsService
      .getcms('6553fed32704c658555d3324')
      .subscribe((result) => this.getPageReady(result));
    // 5c352827ecfbd41448ff71b0
    //document.querySelector('#search').classList.add('hidden');
    //document.getElementById('search').setAttribute('display','none');
    if (this._userService.user_current) {
      this._userService.user_current.songs_original =
        this._userService.user_current.songs_tmp;
      //this.allItems = this._userService.user_current.musicAlbum_tmp;
      //console.log(this.allItems);
      //this.setPage(1);
      //this._cmsService.shuffle(this._userService.user_current.songs_tmp);
    }
    if (this._cmsService.allItems) {
      //this.setPage(1);

      this.pager = this.pagerService.getPager(
        this._cmsService.allItems.length,
        1
      );
      this._cmsService.pagedItems = this._cmsService.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
    }
    this.filtermusicGenre = '';
    this.filtermusicAlbumGenre = '';
    this.filterFirstletter = '';
    // console.log(this.albumArray);
    //this.setFavMusic();

    let dhis = this;
    if (this._cmsService.songArray.length == 0) {
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
    if (dhis._cmsService.songArray.length == 0) {
      dhis._userService.user_current.songs.forEach(function (value) {
        var stri = value._id;
        dhis._cmsService.songArray.push(value._id);
      });
      dhis._cmsService
        .getAlbumsByArray(dhis._cmsService.songArray)
        .subscribe((res) => dhis.setmusicsongs(res));
    }

    dhis._userService.user_current.musicAlbum.forEach(function (value) {
      var stri = value._id;
      dhis.albumArray.push(value._id);
    });
    dhis._cmsService
      .getAlbumsByArray(dhis.albumArray)
      .subscribe((res) => dhis.setmusicalbum(res));
  }

  setmusicalbum(res) {
    this._userService.user_current.musicAlbum_tmp = res;
    this._cmsService.allItems = res;
    this._cmsService.pager = this.pagerService.getPager(
      this._cmsService.allItems.length,
      1
    );
    this._cmsService.pagedItems = this._cmsService.allItems.slice(
      this._cmsService.pager.startIndex,
      this._cmsService.pager.endIndex + 1
    );
  }

  setmusicsongs(res) {
    this._userService.user_current.songs_tmp = res;
    this._userService.user_current.songs_original = res;

    const ori = this._userService.user_current;
    this._userService.songsOriginal = ori;
    this._userService.songsOriginal = JSON.parse(JSON.stringify(ori));
    this._cmsService.shuffle(this._userService.user_current.songs_tmp);

    //if(this.router.url == '/')
    //this.reloadURL();
  }

  getPageReady(page) {
    this._cmsService.scontext(page);
  }

  eventlisteners() {
    this.listeners = true;
    //console.log('eventlisteners');
    var vid = document.getElementById('player');
    var tes = this;
    vid.addEventListener('ended', function () {
      //console.log('Player ended');
      document.getElementById('player_status').innerHTML = 'Player ended';
      tes.player_forward();
    });

    vid.addEventListener('play', function () {
      // document.getElementById('player_status').innerHTML = 'Playing ' + tes.songs[tes.playListIndex].title + '<span class="float_r">' + (tes.playListIndex + 1) + '/' + tes.songs.length + ' songs</span>';
    });
  }

  saveSongs() {
    this._userService.update(this._userService.user_current).subscribe();
  }

  getFavByFind(id) {
    let a = this._userService.user_current.songs.find((x) => x._id === id);
    if (a !== -1 && a !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  getFavByTitle(id) {
    let a = this._userService.user_current.songs.find((x) => x.title === id);
    if (a !== -1 && a !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  toggleFavorite(id, title) {
    if (this._userService.user_current != undefined) {
      var a = this._userService.user_current.songs
        .map(function (e) {
          return e._id;
        })
        .indexOf(id);
      if (a == -1) {
        let obj = {};
        obj['_id'] = id;
        obj['time'] = '0';
        obj['title'] = title;
        this._userService.user_current.songs.push(obj);
        document.getElementById('fav' + id).classList.add('icmn-heart7');
        document.getElementById('fav' + id).classList.remove('icmn-heart8');
      } else {
        this._userService.user_current.songs.splice(a, 1);
        document.getElementById('fav' + id).classList.add('icmn-heart8');
        document.getElementById('fav' + id).classList.remove('icmn-heart7');
      }
      this._userService.update(this._userService.user_current).subscribe();
    } else {
      alert('Only for registered users!');
    }
  }

  toggleFavorite2(page) {
    if (this._userService.user_current != undefined) {
      let ext = '';
      // if(page.schemaextend && page.schemaextend[0].url && page.schemaextend[0].url.match('Collections')) {
      //   ext = "api/assets/music/Albums/Collections/"
      // } else if(page.schemaextend && page.schemaextend[0].url && page.schemaextend[0].url.match('Soundtracks')) {
      //   ext = "api/assets/music/Albums/Soundtracks/"
      // } else if(page.schemaextend && page.schemaextend[0].url && page.schemaextend[0].url.match('Singles')) {
      //   ext = "api/assets/music/Albums/Singles/"
      // } else {
      //   ext = "api/assets/music/Albums/"
      // }
      var a = this._userService.user_current.songs
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      var b = this._userService.user_current.songs_tmp
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      if (a == -1) {
        let obj = {};
        obj['_id'] = page._id;
        obj['time'] = page.schemaextend[0].url;
        obj['title'] = page.title;
        this._userService.user_current.songs.push(obj);
        this._userService.user_current.songs_tmp.push(page);
        //document.getElementById('fav' + page._id).classList.add('-');
        //document.getElementById('fav' + page._id).classList.remove('+');
      } else {
        this._userService.user_current.songs.splice(a, 1);
        this._userService.user_current.songs_tmp.splice(b, 1);
        //document.getElementById('fav' + page._id).classList.add('+');
        //document.getElementById('fav' + page._id).classList.remove('_');
      }
      if (this.oldsongs) this._userService.user_current.songs = this.oldsongs;
      this._userService.update(this._userService.user_current).subscribe();
    } else {
      alert('Only for registered users!');
    }
  }

  fullscreen() {
    let url = document.getElementById('detailimage').getAttribute('src');
    //if(window.innerWidth > 600) {
    document.getElementById('PopupDiv').innerHTML =
      "<img src='" + url + "' alt='' />";
    document.getElementById('homepage').style.opacity = '0.0';
    document.getElementById('homepage').style.position = 'fixed';
    //}
  }

  clearPopupDiv() {
    document.getElementById('PopupDiv').innerHTML = '';
    document.getElementById('homepage').style.opacity = '1.0';
    document.getElementById('homepage').style.position = 'relative';
  }

  toggleFavorite3(page) {
    if (this._userService.user_current != undefined) {
      let ext;
      let nalbum = page.title.replace(/ /g, '_');
      let nalbumz = page.title.replace(/ /g, '_');
      if (this.albumId == '5c35264fecfbd41448ff71ad') {
        ext =
          'api/assets/music/Albums/' + nalbum + '/' + nalbumz + '/folder.jpg';
      } else if (this.albumId == '5c378f5b2b23de317cace407') {
        ext = 'api/assets/music/Albums/Collections/' + nalbumz + '/folder.jpg';
      } else if (this.albumId == '5c352687ecfbd41448ff71ae') {
        ext = 'api/assets/music/Albums/';
      } else if (this.albumId == '5c352840ecfbd41448ff71b1') {
        ext = 'api/assets/music/Albums/Soundtracks/' + nalbumz + '/folder.jpg';
      }
      var a = this._userService.user_current.musicAlbum
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      var b = this._userService.user_current.musicAlbum_tmp
        .map(function (e) {
          return e._id;
        })
        .indexOf(page._id);
      //
      if (a == -1) {
        let obj = {};
        obj['_id'] = page._id;
        obj['time'] = ext;
        obj['title'] = page._title;
        this._userService.user_current.musicAlbum.push(obj);
        this._userService.user_current.musicAlbum_tmp.push(page);
        document.getElementById('fav' + page._id).classList.add('icmn-heart7');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart8');
      } else {
        this._userService.user_current.musicAlbum.splice(a, 1);
        this._userService.user_current.musicAlbum_tmp.splice(b, 1);
        document.getElementById('fav' + page._id).classList.add('icmn-heart8');
        document
          .getElementById('fav' + page._id)
          .classList.remove('icmn-heart7');

        var c = this._cmsService.pagedItems
          .map(function (e) {
            return e._id;
          })
          .indexOf(page._id);
        this._cmsService.pagedItems.splice(c, 1);
      }
      this._userService.update(this._userService.user_current).subscribe();
    } else {
      alert('Only for registered users!');
    }
  }

  loadImages() {
    setTimeout(function () {
      var cdiw = document.getElementsByClassName('movieimage');
      for (var c = 0; c < cdiw.length; c++) {
        if (c == 0) {
          var nwidth = cdiw[c].clientWidth;
          var nheight = cdiw[c].clientHeight;
          cdiw[c].setAttribute('height', nwidth + 'px');
          if (nwidth == 0 || nwidth == undefined) nwidth = 100;
          if (nheight == 0 || nheight == undefined) nheight = 150;
        } else {
          if (cdiw[c].classList.contains('blokmovie')) {
            cdiw[c].setAttribute('width', nwidth + 'px');
            cdiw[c].setAttribute('height', nheight + 'px');
          } else {
            cdiw[c].setAttribute('width', nwidth + 'px');
            cdiw[c].setAttribute('height', nwidth + 'px');
          }
        }
      }
    }, 500);
  }

  ngOnInit() {}

  player_pause() {
    //console.log('pause');
    if (document.getElementById('player_status')) {
      //document.getElementById('player_status').innerHTML = 'Player paused';
      //document.getElementById('player_status').innerHTML = 'Paused ' + this.songs[this.playListIndex].title + '<span class="float_r">' + (this.playListIndex + 1) + '/' + this.songs.length + ' songs</span>';
      this.videoPlayer.nativeElement.pause();
      document.getElementById('player_startbutton').classList.remove('hidden');
      document.getElementById('player_pausebutton').classList.add('hidden');
    }
  }

  player_play() {
    //console.log('player play');
    if (!this.listeners) {
      this.eventlisteners();
    }
    if (document.getElementById('player_status')) {
      if (!document.getElementById('player').getAttribute('src')) {
        document
          .getElementById('player')
          .setAttribute(
            'src',
            'api/assets/music/Albums/' +
              this._userService.user_current.songs_tmp[this.playListIndex]
                .schemaextend[0].url
          );
        var nurl =
          'api/assets/music/Albums/' +
          this._userService.user_current.songs_tmp[
            this.playListIndex
          ].schemaextend[0].url.replace('Ballads/', '');
        this.loadTrack3(
          nurl,
          0,
          this._userService.user_current.songs_tmp[this.playListIndex]
        );
        //console.log('asdfsdaf');
      }
      this.videoPlayer.nativeElement.play();
      document.getElementById('player_startbutton').classList.add('hidden');
      document.getElementById('player_pausebutton').classList.remove('hidden');
    }
  }

  setVideo() {
    this._cmsService
      .getcms(this.videoId)
      .subscribe((result) => this.setVideoReady(result));
  }

  loadalbum(album) {
    this._cmsService
      .getPages(album._id)
      .subscribe((result) => this.loadalbumReady(result));

    this.currentAlbum = album;
    document.getElementById('title2').innerHTML = album.title;
    this.albumgenre = album.schemaextend[0].musicgenre;
  }

  loadalbumReady(album) {
    this.album = album;
    this.playlist();
    this.playTracks(
      0,
      'api/assets/music/Albums/' + album[0].schemaextend[0].url,
      album[0]
    );
  }

  player_fav() {
    if (!this.type) {
      this.toggleFavorite2(
        this._userService.user_current.songs[this.playListIndex]
      );
    } else {
      this.toggleFavorite2(this.songs[this.playListIndex]);
    }
  }

  favalbumcover(parent, album) {
    let a = this._cmsService.artists.find((x) => x._id === parent);
    var nalbum = album.replace(/ /g, '_');
    let url;
    if (parent == '5c378f5b2b23de317cace407') {
      url = 'api/assets/music/Albums/Collections/' + nalbum + '/Folder.jpg';
      return url;
    } else if (parent == '5c352840ecfbd41448ff71b1') {
      url = 'api/assets/music/Albums/Soundtracks/' + nalbum + '/Folder.jpg';
      return url;
    } else {
      if (a !== undefined) {
        var artisttitle = a.title.replace(/ /g, '_');
        url =
          'api/assets/music/Albums/' +
          artisttitle +
          '/' +
          nalbum +
          '/Folder.jpg';
        return url;
      } else {
        return url;
      }
    }
  }

  albumCover(album) {
    let nalbum = album.replace(/ /g, '_');
    let url;
    url = nalbum;
    return url;
  }

  albumCover2(album) {
    let nalbum = album.replace(/ /g, '_');
    let url;
    if (this.albumId == '5c378f5b2b23de317cace407') {
      url = 'api/assets/music/Collections/' + nalbum + '/Folder.jpg';
    } else if (this.albumId == '5c352840ecfbd41448ff71b1') {
      url = 'api/assets/music/Albums/Soundtracks/' + nalbum + '/Folder.jpg';
    }
    return url;
  }

  setVideoReady(video) {
    this.video = video;
    document.getElementById('title2').innerHTML = video.title;
    if (this.albumId === '5c378f5b2b23de317cace407') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => (this.album = res));
    } else if (this.albumId === '5c352840ecfbd41448ff71b1') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => (this.album = res));
    } else if (this.albumId === '5c352687ecfbd41448ff71ae') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => (this.album = res));
    } else {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => (this.albums = res));
    }
    //this._cmsService.checkAssetFile('image', '', video._id)
    //  .subscribe(res => this.checkAssetFileResult(res, 'image', video._id));
  }

  filterKeyword(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterText = event.target.value;
  }

  filterSelectFirstletter(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterFirstletter = event.target.value;
  }

  playlist() {
    if (this.album != undefined && this.album.length > 0) {
      var playlist_text = [];
      for (var i = 0; i < this.album.length; i++) {
        playlist_text.push({
          _id: this.album[i]._id,
          track: i,
          title: this.album[i].title,
          file: this.album[i].url,
        });
      }
      this.tracks = playlist_text;
    }
  }

  loadTrack(index) {
    this.videoPlayer.nativeElement.pause();
    if (this._userService.getUserLoggedIn() == true) {
      this.videoPlayer.nativeElement.load();
    } else {
      document.getElementById('playersource').setAttribute('src', '');
      this.videoPlayer.nativeElement.src = '';
    }
  }

  playTrack(index) {
    this.loadTrack(index);
    if (this._userService.getUserLoggedIn() == true) {
      this.videoPlayer.nativeElement.play();
    }
  }

  linkClicked(pagez, c) {
    this._cmsService.treelevels = [];
    //this._cmsService.context(pagez);
    if (this.albumId == '5c378f5b2b23de317cace407') {
      // collections
      pagez.schemaextend[0].url = pagez.schemaextend[0].url.replace(
        'Dance/',
        ''
      );
      pagez.schemaextend[0].url = pagez.schemaextend[0].url.replace(
        'Ballads/',
        ''
      );
      pagez.schemaextend[0].url = pagez.schemaextend[0].url.replace('POP/', '');

      document.getElementById('MusicAlbumList').classList.add('hidden');

      if (pagez.schemaextend[0].url.match(/Collections/g)) {
        var url = 'api/assets/music/' + pagez.schemaextend[0].url;
      } else {
        var url = 'api/assets/music/Albums/' + pagez.schemaextend[0].url;
      }
      console.log(url);
      this.playTracks(c, url, pagez);
    } else if (this.albumId == '5c352687ecfbd41448ff71ae') {
      // singles
      document.getElementById('MusicAlbumList').classList.add('hidden');
      var url = 'api/assets/music/' + pagez.schemaextend[0].url;
      console.log(url);
      this.playTracks(c, url, pagez);
    } else if (this.albumId == '5c352840ecfbd41448ff71b1') {
      // soundtracks
      this.album = this.albums;
      console.log(' Test');
      document.getElementById('MusicAlbumList').classList.add('hidden');
      var url = 'api/assets/music' + pagez.schemaextend[0].url;
      console.log(url);
      this.playTracks(c, url, pagez);
    } else {
      this.loadalbum(pagez);
      console.log('He?');
    }
  }

  playTracks(index, url, pagez) {
    //console.log('playTracks');
    this.loadTrack2(index, url);
    if (document.getElementById('albumurl'))
      document.getElementById('albumurl').innerHTML = url;

    this.playListIndex = index;

    document.getElementById('index').classList.remove('hidden');
    document.getElementById('index').classList.add('cell_left');
    if (this._userService.getUserLoggedIn() == true) {
      (<HTMLInputElement>(
        document.getElementById('player_startbutton')
      )).classList.add('hidden');
      (<HTMLInputElement>(
        document.getElementById('player_pausebutton')
      )).classList.remove('hidden');
      this.videoPlayer.nativeElement.play();
    }
  }

  loadTrack2(index, url) {
    this.videoPlayer.nativeElement.pause();
    if (this._userService.getUserLoggedIn() == true) {
      this.videoPlayer.nativeElement.src = url;
      this.videoPlayer.nativeElement.load();
    } else {
      document.getElementById('playersource').setAttribute('src', '');
      this.videoPlayer.nativeElement.src = '';
    }
  }

  getFavByFind2(id) {
    let a = this._userService.user_current.musicAlbum.find((x) => x._id === id);
    if (a !== -1 && a !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  loadSongs(page) {
    this.type = 'album';
    this.album = page;
    this.updateHits(page);
    var url = this.favalbumcover(page.parent, page.title);
    document.getElementById('detailimage').setAttribute('src', url);
    this._cmsService
      .getPages(page._id)
      .subscribe((res) => this.loadSongsReady(res));
    document.getElementById('detailimage').classList.remove('hidden');
    document.getElementById('Album').innerHTML = page.title;
  }

  filterSelectGenre(event) {
    //this.pagedItems = this.allItems;
    this._filterService.musicGenre = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterMusicGenre'))
      .value;
    if (!e) {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_line');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' songs';
        //document.getElementById("pagination").classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_line');
        document.getElementById('allItemsCount').innerHTML =
          f.length + ' songs';
        // document.getElementById("pagination").classList.add('hidden');
      }, 500);
    }
  }

  filterSelectAlbumGenre(event) {
    this._cmsService.pagedItems = this._cmsService.allItems;
    this._filterService.musicAlbumGenre = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filtermusicAlbumGenre'))
      .value;
    if (!e) {
      this._cmsService.pager = this.pagerService.getPager(
        this._cmsService.allItems.length
      );
      this._cmsService.pagedItems = this._cmsService.allItems.slice(
        this._cmsService.pager.startIndex,
        this._cmsService.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = shis._cmsService.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 200);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 200);
    }
  }

  filterKeyword2(event) {
    this._cmsService.pagedItems = this._cmsService.allItems;
    this._filterService.filterText = event.target.value;
    var e = (<HTMLInputElement>document.getElementById('filterText')).value;
    if (!e) {
      this._cmsService.pager = this.pagerService.getPager(
        this._cmsService.allItems.length
      );
      this._cmsService.pagedItems = this._cmsService.allItems.slice(
        this._cmsService.pager.startIndex,
        this._cmsService.pager.endIndex + 1
      );
      this.setPage(0);
      var shis = this;
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = shis._cmsService.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 200);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 200);
    }
  }

  filterSelectFirstletter2(event) {
    this._cmsService.pagedItems = this._cmsService.allItems;
    this._filterService.filterFirstletter = event.target.value;
    var e = (<HTMLInputElement>document.getElementById('filterFirstletter'))
      .value;
    if (!e) {
      this._cmsService.pager = this.pagerService.getPager(
        this._cmsService.allItems.length
      );
      this._cmsService.pagedItems = this._cmsService.allItems.slice(
        this._cmsService.pager.startIndex,
        this._cmsService.pager.endIndex + 1
      );
      this.setPage(0);
      var shis = this;
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = shis._cmsService.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 200);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>(
          document.getElementById('allItemsAlbumCount')
        )).innerHTML = f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 200);
    }
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

  loadSongsReady(res) {
    this.songs = res;
    this.songsReady = true;

    //document.getElementById('Songs').innerHTML = 'Songs: ' + res.length;
    if (!this.listeners) this.eventlisteners();
    this.playTracks(
      0,
      'api/assets/music/Albums/' + this.songs[0].schemaextend[0].url,
      this.songs[0]
    );
    if (!this.type) {
      this.songspec(this._userService.user_current.songs[0].time);
    } else {
      this.songspec(this.songs[0]);
    }
    this.playListIndex = 0;

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  setAlbumName(album) {
    document.getElementById('clip_album').innerHTML = '' + album.title + '';
    this.albumurl = '/Music/5c352818ecfbd41448ff71af/' + album._id;
    //document.getElementById('clip_album').setAttribute('routerLink','/Music/5c352818ecfbd41448ff71af');
    if (album.title) {
      document.getElementById('label_album').innerHTML = 'Album';
    } else {
      document.getElementById('label_album').innerHTML = '';
    }
  }

  songspec(song) {
    if (song.schemaextend[0].filesiz != undefined) {
      document.getElementById('clip_filesiz').innerHTML =
        this._cmsService.humanfilesize(song.schemaextend[0].filesiz, 'MB', 2);
    }
    document.getElementById('clip_musicgenre').innerHTML =
      song.schemaextend[0].musicgenre;
    document.getElementById('clip_length').innerHTML =
      this._cmsService.convertSeconds(song.schemaextend[0].length);

    if (!this.type) {
      this._cmsService
        .getcms(song.parent)
        .subscribe((result) => this.setAlbumName(result));
    }

    if (song.schemaextend[0].audiobitrate) {
      document.getElementById('clip_bitrate').innerHTML =
        song.schemaextend[0].audiobitrate + ' kbps';
    } else {
      document.getElementById('clip_bitrate').innerHTML = '';
    }
    if (song.schemaextend[0].artist != undefined) {
      document.getElementById('clip_artist').innerHTML =
        song.schemaextend[0].artist;
    }
    document.getElementById('clip_title').innerHTML = song.title;

    document.getElementById('songspec').classList.remove('hidden');

    document.getElementById('player_status').innerHTML =
      'Playing ' + song.title;

    if (
      song.schemaextend[0].filesiz &&
      song.schemaextend[0].filesiz != undefined
    ) {
      document.getElementById('label_filesiz').innerHTML = 'Filesize';
    } else {
      document.getElementById('label_filesiz').innerHTML = '';
    }
    if (song.schemaextend[0].musicgenre) {
      document.getElementById('label_musicgenre').innerHTML = 'Genre';
    } else {
      document.getElementById('label_musicgenre').innerHTML = '';
    }
    if (song.schemaextend[0].length) {
      document.getElementById('label_length').innerHTML = 'Length';
    } else {
      document.getElementById('label_length').innerHTML = '';
    }
    if (song.schemaextend[0].audiobitrate) {
      document.getElementById('label_bitrate').innerHTML = 'Bitrate';
    } else {
      document.getElementById('label_bitrate').innerHTML = '';
    }
    if (song.schemaextend[0].artist != undefined) {
      document.getElementById('label_artist').innerHTML = 'Artist';
    } else {
      //document.getElementById('label_artist').innerHTML = '';
      //document.getElementById('label_artist_tr').classList.add('hidden');
    }
    if (song.title) {
      document.getElementById('label_title').innerHTML = 'Title';
    } else {
      document.getElementById('label_title').innerHTML = '';
    }
  }

  player_volumedown() {
    let volume = this.videoPlayer.nativeElement.volume;
    if (volume > 0.2) this.videoPlayer.nativeElement.volume = volume - 0.1;
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

  player_hideshow() {
    this.videoPlayer.nativeElement.classList.toggle('hidden');
    if (this.videoPlayer.nativeElement.classList.contains('hidden')) {
      document.getElementById('video_buttons').style.margin =
        '0px 0px 10px 0px';
      document
        .getElementById('player_hideshowbutton')
        .classList.remove('icmn-box-remove');
      document
        .getElementById('player_hideshowbutton')
        .classList.add('icmn-box-add');
    } else {
      document.getElementById('video_buttons').style.margin =
        '-7px 0px 10px 0px';
      document
        .getElementById('player_hideshowbutton')
        .classList.remove('icmn-box-add');
      document
        .getElementById('player_hideshowbutton')
        .classList.add('icmn-box-remove');
    }
  }

  singles() {
    this.type = '';
    document.getElementById('Album').innerHTML =
      'Favorite songs <span style="float:right;">' +
      this._userService.user_current.songs_tmp.length +
      ' songs</span>';
    document.getElementById('detailimage').setAttribute('src', '');
    document.getElementById('detailimage').classList.add('hidden');
    this.loadTrack3(
      'api/assets/music/Albums/' +
        this._userService.user_current.songs_tmp[0].schemaextend[0].url,
      0,
      this._userService.user_current.songs_tmp[0]
    );
  }

  sortRestore() {
    this._userService.user_current.songs_tmp = [];
    this._userService.songsOriginal.songs_original.forEach((element) => {
      this._userService.user_current.songs_tmp.push(element);
    });
    this.changeDetection.detectChanges();
    this.loadTrack3(
      'api/assets/music/Albums/' +
        this._userService.user_current.songs_tmp[0].schemaextend[0].url.replace(
          'Ballads/',
          ''
        ),
      0,
      this._userService.user_current.songs[0]
    );
  }

  sortByTitle() {
    if (this.type) {
      this.songs.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      this.loadTrack3(
        'api/assets/music/Albums/' + this.songs[0].schemaextend[0].url,
        0,
        this.songs[0]
      );
    } else {
      if (!this.oldsongs) this.oldsongs = this._userService.user_current.songs;
      //document.getElementById('savesongs').style.display = 'inline-block';
      this._userService.user_current.songs_tmp.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
      this.loadTrack3(
        'api/assets/music/Albums/' +
          this._userService.user_current.songs_tmp[0].schemaextend[0].url.replace(
            'Ballads/',
            ''
          ),
        0,
        this._userService.user_current.songs[0]
      );
    }
  }

  sortBy() {
    if (this.type) {
      this.songs.reverse();
      this.loadTrack3(
        'api/assets/music/Albums/' + this.songs[0].schemaextend[0].url,
        0,
        this.songs[0]
      );
    } else {
      if (!this.oldsongs) this.oldsongs = this._userService.user_current.songs;
      //document.getElementById('savesongs').style.display = 'inline-block';
      this._userService.user_current.songs_tmp.reverse();
      this.loadTrack3(
        'api/assets/music/Albums/' +
          this._userService.user_current.songs_tmp[0].schemaextend[0].url
            .replace('Ballads/', '')
            .replace('Albums/', ''),
        0,
        this._userService.user_current.songs_tmp[0]
      );
    }
  }

  player_volumeup() {
    let volume = this.videoPlayer.nativeElement.volume;
    if (volume < 1) this.videoPlayer.nativeElement.volume = volume + 0.1;
  }

  updateHits(item) {
    item.hits = item.hits + 1;
    //console.log(item.hits);
    this._cmsService.page_update(item).subscribe();
  }

  shuffle() {
    if (this.type) {
      this._cmsService.shuffle(this.songs);
      this.loadTrack3(
        'api/assets/music/Albums/' + this.songs[0].schemaextend[0].url,
        0,
        this.songs[0]
      );
    } else {
      if (!this.oldsongs) {
        this.oldsongs = this._userService.user_current.songs_tmp;

        //this._userService.songsOriginal = Object.assign({}, this._userService.user_current);
      }
      //document.getElementById('savesongs').style.display = 'inline-block';
      this._cmsService.shuffle(this._userService.user_current.songs_tmp);
      //console.log(this._userService.songsOriginal);

      this.loadTrack3(
        'api/assets/music/Albums/' +
          this._userService.user_current.songs_tmp[0].schemaextend[0].url.replace(
            'Ballads/',
            ''
          ),
        0,
        this._userService.user_current.songs_tmp[0]
      );
    }
  }

  sortalbums() {
    this._cmsService.shuffle(this._cmsService.allItems);
    this._cmsService.pager = this.pagerService.getPager(
      this._cmsService.allItems.length,
      1
    );
    this._cmsService.pagedItems = this._cmsService.allItems.slice(
      this._cmsService.pager.startIndex,
      this._cmsService.pager.endIndex + 1
    );
  }

  sortByAlbums() {
    this._cmsService.allItems.reverse();
    //this._cmsService.pager = this.pagerService.getPager(this.allItems.length, 10);
    //this._cmsService.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.setPage(0);
    //this.playTracks(0, 'api/assets/music/Albums/' +this.album[0].schemaextend[0].url.replace('POP/', '').replace('Rock/', '').replace('Reggea/', '').replace('Dance/', '').replace('Hip-Hop/', ''), this.album[0]);
    //this.topscroller(0);
  }

  shuffleAlbum() {
    this._cmsService.shuffle(this._cmsService.allItems);
    //this._cmsService.pager = this.pagerService.getPager(this._cmsService.allItems.length, 10);
    //this._cmsService.pagedItems = this._cmsService.allItems.slice(this._cmsService.pager.startIndex, this._cmsService.pager.endIndex + 1);
    this.setPage(0);
    //this.playTracks(0, 'api/assets/music/Albums/' +this.album[0].schemaextend[0].url.replace('POP/', '').replace('Rock/', '').replace('Reggea/', '').replace('Dance/', '').replace('Hip-Hop/', ''), this.album[0]);
    //this.topscroller(0);
  }

  sortByAlbum() {
    this._cmsService.allItems.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    //this.pager = this.pagerService.getPager(this.allItems.length, 10);
    //this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.setPage(0);
    //this.playTracks(0, 'api/assets/music/Albums/' +this.album[0].schemaextend[0].url.replace('POP/', '').replace('Rock/', '').replace('Reggea/', '').replace('Dance/', '').replace('Hip-Hop/', ''), this.album[0]);
    //this.topscroller(0);
  }

  loadSong(result) {
    this.song = result;
    this.songspec(this.song);
  }

  loadTrack3(url, index, page) {
    //console.log('loadTrack3');
    if (this.videoId != undefined) {
      // this._cmsService
      //   .getcms(page._id)
      //   .subscribe((result) => this.loadSong(result));
      this.loadSong(this._userService.user_current.songs_tmp[index]);
    }
    this.updateHits(page);
    if (!this.listeners) this.eventlisteners();
    // console.log('loadtrack ? ');
    this.videoId = page._id;
    this.playListIndex = index;
    this.videoPlayer.nativeElement.pause();
    if (this._userService.getUserLoggedIn() == true) {
      this.videoPlayer.nativeElement.src = url.replace(
        'Collections/Collections/',
        'Collections/'
      );
      this.videoPlayer.nativeElement.load();
      document.getElementById('player_startbutton').classList.add('hidden');
      document.getElementById('player_pausebutton').classList.remove('hidden');
    } else {
      document.getElementById('playersource').setAttribute('src', '');
      this.videoPlayer.nativeElement.src = '';
    }
    const anchor = document.getElementById('pagez_songs' + index);
    //console.log('test ' + index)
    //anchor.scrollIntoView();
    this.topscroller(index);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  topscroller(index) {
    setTimeout(function () {
      const anchor = document.getElementById('pagez_songs' + index);
      anchor.scrollIntoView();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 500);
  }

  player_forward() {
    this.playListIndex++;
    if (
      this.type &&
      this.songsReady &&
      this.playListIndex == this.songs.length
    ) {
      this.playListIndex = 0;
    } else if (
      !this.type &&
      this.playListIndex == this._userService.user_current.songs.length
    ) {
      this.playListIndex = 0;
    }
    if (this.type) {
      this.videoId = this.songs[this.playListIndex]._id;
      document.getElementById('pagez_songs' + this.playListIndex).click();
    } else {
      this.videoId =
        this._userService.user_current.songs[this.playListIndex]._id;
      document.getElementById('pagez_songs' + this.playListIndex).click();
    }
    this.topscroller(this.playListIndex);
  }

  player_skipbackward() {
    if (this.playListIndex > 0) {
      this.playListIndex--;
      if (this.type) {
        this.videoId = this.songs[this.playListIndex]._id;
      } else {
        this.videoId =
          this._userService.user_current.songs[this.playListIndex]._id;
      }
      document.getElementById('pagez_songs' + this.playListIndex).click();
    } else {
      this.videoPlayer.nativeElement.pause();
      this.playListIndex = 0;
      this.loadTrack(this.playListIndex);
    }
    this.topscroller(this.playListIndex);
  }

  player_skip() {
    var time = document.getElementById('player').getAttribute('currentTime');
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime + 60;
  }

  player_backward() {
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime - 60;
  }

  setPage(counter: number) {
    this._cmsService.pager = this.pagerService.getPager(
      this._cmsService.allItems.length,
      counter
    );
    this._cmsService.pagedItems = this._cmsService.allItems.slice(
      this._cmsService.pager.startIndex,
      this._cmsService.pager.endIndex + 1
    );
  }
}
