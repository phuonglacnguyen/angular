import {
  ElementRef,
  AfterViewInit,
  ViewChild,
  Component,
  OnInit,
  Input,
  HostListener,
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from '../user/user';

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.component.html',
  styleUrls: ['./musicplayer.component.css'],
})
export class MusicplayerComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: any; // , { static: true}
  @ViewChild('videoSource') videoSource: any; // , { static: true}
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterGenre;
  @Input() filtermusicGenre;
  activeMenu: string;
  toggleHidden = true;
  albumId;
  albumKids;
  videoId = '';
  video;
  mediaPath = 'api/assets/content/';
  tracks;
  public allItems: any[];
  pager: any = {};
  pagedItems: any[];
  player;
  playerTime;
  playListIndex = 1;
  playersource;
  albums;
  artistalbum;
  album;
  currentAlbum = new Page();
  artist;
  albumgenre;
  song;
  artists;
  parent;
  listener: boolean;

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
    private pagerService: PagerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.videoId = '';
      this.pagedItems = [];
      this._filterService.filterFirstletter = '';
      this._filterService.filterText = '';
      this._filterService.musicGenre = '';
      this.albumId = params['albumName'];
      this.videoId = params['id'];
      this.album = undefined;

      if (this.videoId != undefined) {
        if (this.albumId == '5c352818ecfbd41448ff71af') {
          this._cmsService
            .getcms(this.videoId)
            .subscribe((result) => this.getAlbumssReady(result));

          this._cmsService
            .getPages('5c35264fecfbd41448ff71ad')
            .subscribe((result) => (this.artists = result));

          this._cmsService
            .getMusicAlbums()
            .subscribe((result) => this.allItemsReady(result));

          this._cmsService
            .getPages(this.videoId)
            .subscribe((result) => this.allAlbumsReady(result));
        } else {
          this._cmsService
            .getcms(this.videoId)
            .subscribe((result) => this.getAlbumeady(result));
        }
      } else {
        this._cmsService
          .getcms(this.albumId)
          .subscribe((result) => this.getAlbumsrzeady(result));
      }
      if (this.videoId != undefined) this.setVideo();

      if (
        this.albumId == '5c0d45ea64c6c530246b568c' ||
        this.albumId == '5c0d45ea64c6c530246b568f' ||
        this.albumId == '5c0d45ea64c6c530246b568a' ||
        this.albumId == '5c0d45ea64c6c530246b568b'
      ) {
        this._cmsService
          .getPagesDesc(this.albumId)
          .subscribe((result) => this.allItemsReady(result));
      } else if (this.albumId == '5c352818ecfbd41448ff71af') {
        // Albums
        this._cmsService
          .getPages('5c35264fecfbd41448ff71ad')
          .subscribe((result) => (this.artists = result));

        this._cmsService
          .getMusicAlbums()
          .subscribe((result) => this.allItemsReady(result));
      } else {
        this.albums = [];
        this._cmsService
          .getPages(this.albumId)
          .subscribe((result) => this.allItemsReady(result));
      }
    });
    this.player = document.getElementById('player');
    this.playersource = document.getElementById('playersource');
    this.filterFirstletter = '';
    this.filterGenre = '';
    this.filtermusicGenre = '';
    document.querySelector('#search').classList.remove('hidden');
    document.getElementById('search').setAttribute('display', 'inline-block');
  }

  getAlbumssReady(res) {
    this.parent = res;
  }

  getAlbumsrzeady(res) {
    this.parent = res;
    //if(this._cmsService.treelevels.length == 1) {
    this._cmsService.scontext(res);
    //}
  }

  allAlbumsReady(res) {
    this.album = res;
    this.allItems = res;
    this.playListIndex = 0;
    //console.log(res);
    this._cmsService
      .getcms(this.videoId)
      .subscribe((result) => this.getAlbumsready(result));

    this._cmsService
      .getPages('5c35264fecfbd41448ff71ad')
      .subscribe((result) => (this.artists = result));
  }

  getAlbumsready(res) {
    this._cmsService
      .getcms(res.parent)
      .subscribe((result) => (this.artistalbum = result));
  }

  getAlbumeady(item) {
    this.artistalbum = item;
    let nartist = item.title.replace(/ /g, '_');
    if (item.parent == '5c378f5b2b23de317cace407') {
      document
        .getElementById('detailimage')
        .setAttribute(
          'src',
          'api/assets/music/Albums/Collections/' + nartist + '/Folder.jpg'
        );
    } else if (item.parent == '5c352840ecfbd41448ff71b1') {
      document
        .getElementById('detailimage')
        .setAttribute(
          'src',
          'api/assets/music/Albums/Soundtracks/' + nartist + '/Folder.jpg'
        );
    }
    //this._cmsService.scontext(item);
  }

  saveGenre(res, album) {
    if (res[0].schemaextend[0] && res[0].schemaextend[0].musicgenre) {
      album.schemaextend[0].musicgenre = res[0].schemaextend[0].musicgenre;
      this._cmsService.updatePage(album).subscribe();
    }
  }

  allItemsReady(result) {
    this.allItems = result;
    if (this.parent && this.parent.title == 'Collections') {
      document.getElementById('musiccat').innerHTML = 'Collections';
    } else if (this.parent && this.parent.title == 'SoundTracks') {
      document.getElementById('musiccat').innerHTML = 'Soundtracks';
    } else if (this.parent && this.parent.title == 'Singles') {
      document.getElementById('musiccat').innerHTML = 'Singles';
    }
    this.setPage(1);
    this.playlist();

    var a = this.pagedItems
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    var b = result
      .map(function (e) {
        return e._id;
      })
      .indexOf(this.videoId);
    var bindex = (b + 1) / 10;

    if (Math.ceil(bindex) > 1) {
      this.setPage(Math.ceil(bindex));
      this.playListIndex = Math.ceil(bindex);
    } else {
      this.playListIndex = a;
    }
    if (!this.listener) this.listeners();
  }

  listeners() {
    this.listener = true;
    if (this.videoId != undefined) {
      var vid = document.getElementById('player');
      var tes = this;
      vid.addEventListener('ended', function () {
        document.getElementById('player_status').innerHTML = 'Player ended';
        tes.player_forward();
      });
    }
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
    const found = this._userService.user_current.songs.find(
      (element) => element.title.trim() == id.trim()
    );
    if (found) {
      return true;
    } else {
      return false;
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

  shuffleAlbum() {
    this._cmsService.shuffle(this.allItems);
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
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

  sortByTitle() {
    this.album.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
    this.playTracks(
      0,
      'api/assets/music/Albums/' +
        this.album[0].schemaextend[0].url
          .replace('POP/', '')
          .replace('Rock/', '')
          .replace('Reggea/', '')
          .replace('Dance/', '')
          .replace('Hip-Hop/', ''),
      this.album[0]
    );
  }

  sortByTrack() {
    this.album.sort(function (a, b) {
      if (a.schemaextend[0].track < 10 && a.schemaextend[0].track.length < 2) {
        a.schemaextend[0].track = '0' + a.schemaextend[0].track;
      }
      return a.schemaextend[0].track.localeCompare(b.schemaextend[0].track);
    });
    this.playTracks(
      0,
      'api/assets/music/Albums/' +
        this.album[0].schemaextend[0].url
          .replace('POP/', '')
          .replace('Rock/', '')
          .replace('Reggea/', '')
          .replace('Dance/', '')
          .replace('Hip-Hop/', ''),
      this.album[0]
    );
  }

  sortBy() {
    this.album.reverse();
    this.playTracks(
      0,
      'api/assets/music/Albums/' +
        this.album[0].schemaextend[0].url
          .replace('POP/', '')
          .replace('Rock/', '')
          .replace('Reggea/', '')
          .replace('Dance/', '')
          .replace('Hip-Hop/', ''),
      this.album[0]
    );
  }

  player_fav() {
    this.toggleFavorite2(this.album[this.playListIndex]);
  }

  toggleFavorite(page) {
    if (this._userService.user_current != undefined) {
      let ext;
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
      if (a == -1) {
        let obj = {};
        obj['_id'] = page._id;
        obj['time'] = ext;
        obj['title'] = page.title;
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
      }
      this._userService.update(this._userService.user_current).subscribe();
    }
  }

  toggleFavorite2(page) {
    if (this._userService.user_current != undefined) {
      let ext = '';
      if (this.albumId == '5c35264fecfbd41448ff71ad') {
        ext = 'api/assets/music/Albums/';
      } else if (this.albumId == '5c378f5b2b23de317cace407') {
        ext = 'api/assets/music/Albums/Collections/';
      } else if (this.albumId == '5c352687ecfbd41448ff71ae') {
        ext = 'api/assets/music/Albums/';
      } else if (this.albumId == '5c352840ecfbd41448ff71b1') {
        ext = 'api/assets/music/Albums/Soundtracks/';
      } else {
        ext = 'api/assets/music/Albums/';
      }
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
        obj['time'] =
          ext +
          page.schemaextend[0].url
            .replace('Albums/Collections/', '')
            .replace('Albums/Soundtracks/', '')
            .replace('Collections/Ballads/', '');
        obj['title'] = page.title;
        this._userService.user_current.songs.push(obj);
        this._userService.user_current.songs_tmp.push(page);
      } else {
        this._userService.user_current.songs.splice(a, 1);
        this._userService.user_current.songs_tmp.splice(b, 1);
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

  ngOnInit() {
    //console.log('Initialising...');
  }

  ngAfterViewInit() {}

  shuffleAlbums() {
    this._cmsService.shuffle(this.allItems);
    this.setPage(0);
  }

  shuffle() {
    this._cmsService.shuffle(this.album);
    this.playTracks(
      0,
      'api/assets/music/Albums/' +
        this.album[0].schemaextend[0].url
          .replace('POP/', '')
          .replace('Rock/', '')
          .replace('Reggea/', '')
          .replace('Dance/', '')
          .replace('Hip-Hop/', '')
          .replace('Pop/', '')
          .replace('Oldies/', '')
          .replace('Other/', ''),
      this.album[0]
    );
  }

  player_pause() {
    var dhis = this;
    setTimeout(function () {
      if (dhis.videoPlayer.nativeElement)
        dhis.videoPlayer.nativeElement.pause();
      document.getElementById('player_startbutton').classList.remove('hidden');
      document.getElementById('player_pausebutton').classList.add('hidden');
    }, 500);
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

  player_volumeup() {
    let volume = this.videoPlayer.nativeElement.volume;
    if (volume < 1) this.videoPlayer.nativeElement.volume = volume + 0.1;
  }

  player_play() {
    document.getElementById('player_favbutton').classList.remove('hidden');
    if (
      !this.videoPlayer.nativeElement.src ||
      this.videoPlayer.nativeElement.src == 'http://77.171.83.149:4200/'
    ) {
      this.videoPlayer.nativeElement.src =
        'api/assets/music/Albums/' +
        this.album[this.playListIndex].schemaextend[0].url.replace(
          'Albums/',
          ''
        );
    }
    this.videoPlayer.nativeElement.play();
    document.getElementById('player_status').innerHTML =
      'Playing ' + this.album[this.playListIndex].title;
    document.getElementById('player_startbutton').classList.add('hidden');
    document.getElementById('player_pausebutton').classList.remove('hidden');
  }

  player_hideshow() {
    this.videoPlayer.nativeElement.classList.toggle('hidden');
    if (this.videoPlayer.nativeElement.classList.contains('hidden')) {
      document.getElementById('video_buttons').style.margin =
        '0px 0px 10px 0px';
      document.getElementById('video_buttons').style.padding =
        '10px 10px 6px 10px';
      document
        .getElementById('player_hideshowbutton')
        .classList.remove('icmn-box-remove');
      document
        .getElementById('player_hideshowbutton')
        .classList.add('icmn-box-add');
    } else {
      document.getElementById('video_buttons').style.margin =
        '-12px 0px 10px 0px';
      document.getElementById('video_buttons').style.padding =
        '0px 10px 6px 10px';
      document
        .getElementById('player_hideshowbutton')
        .classList.remove('icmn-box-add');
      document
        .getElementById('player_hideshowbutton')
        .classList.add('icmn-box-remove');
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
    this.albumgenre = album.schemaextend[0].musicgenre;
    document.getElementById('title1').innerHTML = 'Album ' + album.title;
  }

  loadalbumReady(album) {
    this.album = album;
    this.playTracks(
      0,
      'api/assets/music/Albums/' +
        album[0].schemaextend[0].url
          .replace('POP/', '')
          .replace('Rock/', '')
          .replace('Reggea/', '')
          .replace('Dance/', '')
          .replace('Hip-Hop/', '')
          .replace('Albums//', ''),
      album[0]
    );
  }

  albumCover(artist = '', album) {
    let nartist = artist.replace(/ /g, '_');
    let nalbum = album.replace(/ /g, '_');
    let url;
    url = 'api/assets/music/Albums/' + nartist + '/' + nalbum + '/Folder.jpg';
    return url;
  }

  albumCover3(album) {
    let a = this.artists.find((x) => x._id === album.parent);
    var b = this.artists
      .map(function (e) {
        return e._id;
      })
      .indexOf(album.parent);
    if (b != -1) {
      let nartist = this.artists[b].title.replace(/ /g, '_');
      let nalbum = album.title.replace(/ /g, '_');
      let url;
      url = 'api/assets/music/Albums/' + nartist + '/' + nalbum + '/Folder.jpg';
      return url;
    } else {
      return 'api/assets/content/' + album._id + '/main.jpg';
    }
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

  songspec(song) {
    if (song.schemaextend[0].filesiz != undefined)
      document.getElementById('clip_filesiz').innerHTML =
        this._cmsService.humanfilesize(song.schemaextend[0].filesiz, 'MB', 2);
    if (
      song.schemaextend[0].musicgenre != 'NaN:NaN' &&
      song.schemaextend[0].musicgenre != undefined
    )
      document.getElementById('clip_musicgenre').innerHTML =
        song.schemaextend[0].musicgenre;
    if (song.schemaextend[0].length != undefined) {
      document.getElementById('clip_length').innerHTML =
        this._cmsService.convertSeconds(song.schemaextend[0].length);
    } else {
      document.getElementById('clip_length').innerHTML = '';
    }
    if (song.schemaextend[0].audiobitrate) {
      document.getElementById('clip_bitrate').innerHTML =
        song.schemaextend[0].audiobitrate + ' kbps';
    } else {
      document.getElementById('clip_bitrate').innerHTML = '';
    }
    if (song.schemaextend[0].artist != undefined)
      document.getElementById('clip_artist').innerHTML =
        song.schemaextend[0].artist;
    document.getElementById('clip_title').innerHTML = song.title;

    document.getElementById('songspec').classList.remove('hidden');

    if (song.schemaextend[0].filesiz) {
      document.getElementById('label_filesiz').innerHTML = 'Filesize';
    } else {
      document.getElementById('label_filesiz').innerHTML = '';
    }
    if (
      song.schemaextend[0].musicgenre ||
      song.schemaextend[0].musicgenre != 'NaN:NaN' ||
      song.schemaextend[0].musicgenre != undefined
    ) {
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
    if (song.schemaextend[0].artist) {
      document.getElementById('label_artist').innerHTML = 'Artist';
    } else {
      document.getElementById('label_artist').innerHTML = '';
    }
    if (song.title) {
      document.getElementById('label_title').innerHTML = 'Title';
    } else {
      document.getElementById('label_title').innerHTML = '';
    }
  }

  loadalbumsReady(res) {
    this.album = res;
    if (
      this.artistalbum &&
      this.artistalbum.parent === '5c378f5b2b23de317cace407'
    ) {
      this.playTracks(
        0,
        'api/assets/music/' +
          this.album[0].schemaextend[0].url
            .replace('Pop/', '')
            .replace('Dance/', '')
            .replace('Ballads/', '')
            .replace('Other/', '')
            .replace('POP/', ''),
        this.album[0]
      );
    } else if (this.artistalbum === '5c352840ecfbd41448ff71b1') {
      this.playTracks(
        0,
        'api/assets/music/' + this.album[0].schemaextend[0].url,
        this.album[0]
      );
    } else {
      this.playTracks(
        0,
        'api/assets/music/Albums/' +
          this.album[0].schemaextend[0].url
            .replace('Rock/', '')
            .replace('Hip-Hop/', '')
            .replace('Reggea/', '')
            .replace('Albums/', ''),
        this.album[0]
      );
    }
  }

  setVideoReady(video) {
    this.video = video;
    //document.getElementById('title2').innerHTML = video.title;
    if (this.albumId === '5c378f5b2b23de317cace407') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => this.loadalbumsReady(res));
    } else if (this.albumId === '5c352840ecfbd41448ff71b1') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => this.loadalbumsReady(res));
    } else if (this.albumId === '5c352687ecfbd41448ff71ae') {
      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => this.loadalbumsReady(res));
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
    var e = (<HTMLInputElement>document.getElementById('filterText')).value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      var shis = this;
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

  filterSelectGenre(event) {
    this.pagedItems = this.allItems;
    this._filterService.musicGenre = event.target.value;
    var shis = this;
    var e = (<HTMLInputElement>document.getElementById('filterMusicGenre'))
      .value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 500);
    }
  }

  filterSort(event) {
    var columnSort = event.target.value;
    if (columnSort == 'title') {
      this.allItems.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    } else if (columnSort == '_id') {
      this.allItems.sort(function (a, b) {
        return a._id.localeCompare(b._id);
      });
      this.allItems.reverse();
    } else if (columnSort == 'date') {
      this.allItems.sort(function (a, b) {
        return a.dateLast.localeCompare(b.dateLast);
      });
      this.allItems.reverse();
    }
    this.pager = this.pagerService.getPager(this.allItems.length, 10);
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.setPage(0);
  }

  filterSelectFirstletter(event) {
    this.pagedItems = this.allItems;
    this._filterService.filterFirstletter = event.target.value;
    var e = (<HTMLInputElement>document.getElementById('filterFirstletter'))
      .value;
    if (!e) {
      this.pager = this.pagerService.getPager(this.allItems.length);
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );
      this.setPage(0);
      var shis = this;
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          shis.allItems.length + ' results';
        document.getElementById('pagination').classList.remove('hidden');
      }, 500);
    } else {
      setTimeout(function () {
        var f = document.getElementsByClassName('blok_kid');
        (<HTMLInputElement>document.getElementById('allItemsCount')).innerHTML =
          f.length + ' results';
        document.getElementById('pagination').classList.add('hidden');
      }, 500);
    }
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
    if (
      this._userService.getUserLoggedIn() == true &&
      document.getElementById('player')
    ) {
      var url = this.album[index].schemaextend[0].url
        .replace('Albums/', '')
        .replace('Hip-Hop/', '')
        .replace('Rock/', '')
        .replace('Reggea/', '')
        .replace('Rap/', '')
        .replace('Classics/', '')
        .replace('POP/', '')
        .replace('Pop/', '');
      this.videoPlayer.nativeElement.src = 'api/assets/Music/Albums/' + url;
    } else {
      if (document.getElementById('playersource'))
        document.getElementById('playersource').setAttribute('src', '');
      let shis = this;
      setTimeout(function () {
        shis.videoPlayer.nativeElement.src = '';
      }, 100);
    }
  }

  playTrack(index) {
    this.loadTrack(index);
    if (this._userService.getUserLoggedIn() == true) {
      let shis = this;
      setTimeout(function () {
        shis.videoPlayer.nativeElement.play();
      }, 100);
    }
    //this._cmsService.scontext(this.album[index]);
  }

  linkClicked(pagez, c) {
    //if(!this.listener)
    //console.log('listeners...');
    this.listeners();
    this.updateHits(pagez);
    this.playListIndex = 0;
    this._cmsService.treelevels = [];
    //this._cmsService.context(pagez);
    this.currentAlbum = pagez;
    if (this.artistalbum) {
      let imageurl = this.albumCover(
        this.video.title ? this.video.title : this.video.title,
        pagez.title
      );
      document.getElementById('detailimage').setAttribute('src', imageurl);
    }
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
      pagez.schemaextend[0].url = pagez.schemaextend[0].url.replace(
        'Reggea/',
        ''
      );
      pagez.schemaextend[0].url = pagez.schemaextend[0].url.replace(
        'Classics/',
        ''
      );

      if (pagez.schemaextend[0].url.match(/Collections/g)) {
        var url = 'api/assets/music/' + pagez.schemaextend[0].url;
      } else {
        var url = 'api/assets/music/Albums/' + pagez.schemaextend[0].url;
      }
      this.playTracks(c, url, pagez);
    } else if (this.albumId == '5c352687ecfbd41448ff71ae') {
      // singles
      var url = 'api/assets/music/' + pagez.schemaextend[0].url;
      console.log(url);
      this.playTracks(c, url, pagez);
    } else if (this.albumId == '5c352840ecfbd41448ff71b1') {
      // soundtracks
      this.album = this.albums;
      var url = 'api/assets/music' + pagez.schemaextend[0].url;
      console.log(url);
      this.playTracks(c, url, pagez);
    } else {
      this.loadalbum(pagez);
    }
  }

  playTracks(index, url, pagez) {
    this.updateHits(pagez);
    this.song = pagez;
    this.loadTrack(index);
    this.songspec(pagez);
    this.playListIndex = index;
    //if(document.getElementById('albumurl'))
    //document.getElementById('albumurl').innerHTML = url;

    document.getElementById('index').classList.remove('hidden');
    document.getElementById('index').classList.add('cell_left');
    //document.getElementById('title2').innerHTML = this.currentAlbum.title;
    document.getElementById('player_status').innerHTML =
      'Playing ' + this.album[this.playListIndex].title;

    document.getElementById('songspec').classList.remove('hidden');
    if (this._userService.getUserLoggedIn() == true) {
      (<HTMLInputElement>(
        document.getElementById('player_startbutton')
      )).classList.add('hidden');
      (<HTMLInputElement>(
        document.getElementById('player_pausebutton')
      )).classList.remove('hidden');
      this.videoPlayer.nativeElement.play();
      //this.listeners();
      //console.log('Play?');
      let shis = this;
      setTimeout(function () {
        if (!shis.listener) shis.listeners();

        shis.videoPlayer.nativeElement.play();
        document.getElementById('player_startbutton').classList.add('hidden');
        document
          .getElementById('player_pausebutton')
          .classList.remove('hidden');
      }, 1000);
    }
    if (document.getElementById('pagez' + index)) this.topscroller(index);
  }

  topscroller(index) {
    setTimeout(function () {
      const anchor = document.getElementById('pagez' + index);
      anchor.scrollIntoView();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 500);
  }

  player_forward() {
    this.playListIndex++;
    if (this.playListIndex < this.album.length) {
      document.getElementById('pagez' + this.playListIndex).click();
      document.getElementById('player_status').innerHTML =
        'Playing ' + this.album[this.playListIndex].title;
    } else {
      this.playListIndex = 0;
      this.videoId = this.album[this.playListIndex]._id;
      document.getElementById('pagez' + this.playListIndex).click();
    }
  }

  player_skipbackward() {
    if (this.playListIndex > 1) {
      this.playListIndex--;
      this.videoId = this.album[this.playListIndex]._id;
      document.getElementById('pagez' + this.playListIndex).click();
    } else {
      this.videoPlayer.nativeElement.pause();
      this.playListIndex = 0;
      this.loadTrack(this.playListIndex);
    }
  }

  player_skip() {
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime + 60;
  }

  player_backward() {
    this.videoPlayer.nativeElement.currentTime =
      this.videoPlayer.nativeElement.currentTime - 60;
  }

  getArtistReady(res, video) {
    this.albums = res;
    this.updateHits(video);
  }

  setVideoLink(index, video) {
    //console.log('hE? setVideoLink');
    this.playListIndex = index;
    this.albums = [];
    if (video.parent == '5c35264fecfbd41448ff71ad') {
      //console.log('1');
      if (!this.listener) this.listeners();
      this.artist = video;
      this.videoId = video._id;
      this.video = video;

      this._cmsService
        .getcms(video.parent)
        .subscribe((result) => (this.artistalbum = result));

      this._cmsService
        .getPages(video._id)
        .subscribe((result) => this.allAlbumsReady3(video, result));

      this._cmsService
        .getPages(this.videoId)
        .subscribe((res) => this.getArtistReady(res, video));
    } else if (
      video.parent == '5c0d45ea64c6c530246b568c' ||
      video.parent == '5c0d45ea64c6c530246b5690' ||
      video.parent == '5c0d45ea64c6c530246b5691' ||
      video.parent == '5c0d45ea64c6c530246b568f'
    ) {
      this.router.navigate(['/Music/' + video._id]);
      //console.log('2');
    } else if (video.parent == '5c378f5b2b23de317cace407') {
      //console.log('3');
      this.videoId = video._id;
      this.video = video;
      this.album = this.albums;
      if (
        this.albumId == '5c352818ecfbd41448ff71af' ||
        this.albumId == '5c378f5b2b23de317cace407'
      ) {
        this.playListIndex = 0;
        this._cmsService
          .getPages(video._id)
          .subscribe((result) => this.allAlbumsReady2(video, result));
      } else {
        this.setVideo();
        this.playTrack(index);
      }
    } else if (video.parent == '5c352840ecfbd41448ff71b1') {
      //console.log('4');
      this.videoId = video._id;
      this.video = video;
      //this.setVideo();
      let nartist = video.title.replace(/ /g, '_');
      document.getElementById('musiccat').innerHTML = 'Soundtracks';

      if (
        this.albumId == '5c352818ecfbd41448ff71af' ||
        this.albumId == '5c378f5b2b23de317cace407' ||
        this.albumId == '5c352840ecfbd41448ff71b1'
      ) {
        this.playListIndex = 0;
        this._cmsService
          .getPages(video._id)
          .subscribe((result) => this.allAlbumsReady2(video, result));
      }
    } else if (this.albumId == '5c352818ecfbd41448ff71af') {
      //console.log('5 ');
      //this.artistalbum = video;
      this.playListIndex = 0;
      this._cmsService
        .getPages(video._id)
        .subscribe((result) => this.allAlbumsReady2(video, result));
    } else {
      //console.log('6');
      this.videoId = video._id;
      this.video = video;
      this.playListIndex = 0;
      this._cmsService
        .getPages(video._id)
        .subscribe((result) => this.allAlbumsReady2(video, result));
    }
  }

  getartistalbum(res) {
    this.artistalbum = res;
  }

  allAlbumsReady3(video, result) {
    this.albums = result;
    document.getElementById('player_artist').innerHTML =
      video.title +
      '<span class="float_r">' +
      this.albums.length +
      ' albums</span>';
  }

  allAlbumsReady2(video, res) {
    this.album = res;
    this.videoId = video._id;
    this.video = video;
    let nalbum = video.title.replace(/ /g, '_');
    if (this.artists) {
      let a = this.artists.find((x) => x._id === video.parent);
      if (a && a.title) {
        let nartist = a.title.replace(/ /g, '_');
        document
          .getElementById('detailimage')
          .setAttribute(
            'src',
            'api/assets/music/Albums/' + nartist + '/' + nalbum + '/Folder.jpg'
          );
      } else if (this.artists[a]) {
        let nartist = this.artists[a].title.replace(/ /g, '_');
        document
          .getElementById('detailimage')
          .setAttribute(
            'src',
            'api/assets/music/Albums/' + nartist + '/' + nalbum + '/Folder.jpg'
          );
        console.log(this.artists[a]);
      } else if (video.parent == '5c352840ecfbd41448ff71b1') {
        // soundtracks
        document
          .getElementById('detailimage')
          .setAttribute(
            'src',
            'api/assets/music/Albums/Soundtracks/' + nalbum + '/Folder.jpg'
          );
      } else if (video.parent == '5c378f5b2b23de317cace407') {
        // collections
        document
          .getElementById('detailimage')
          .setAttribute(
            'src',
            'api/assets/music/Albums/Collections/' + nalbum + '/Folder.jpg'
          );
      }
    } else if (video.parent == '5c378f5b2b23de317cace407') {
      document
        .getElementById('detailimage')
        .setAttribute(
          'src',
          'api/assets/music/Albums/Collections/' + nalbum + '/Folder.jpg'
        );
    } else if (video.parent == '5c352840ecfbd41448ff71b1') {
      document
        .getElementById('detailimage')
        .setAttribute(
          'src',
          'api/assets/music/Albums/Soundtracks/' + nalbum + '/Folder.jpg'
        );
    }
    document.getElementById('title1').innerHTML = video.title;
    this.songspec(res[0]);
    if (this._userService.user_current) {
      var tmp = this.album[0].schemaextend[0].url
        .replace('Albums/', '')
        .replace('Hip-Hop/', '')
        .replace('Rock/', '')
        .replace('Reggea/', '')
        .replace('Rap/', '')
        .replace('Classics/', '')
        .replace('POP/', '')
        .replace('Pop/', '');
      var shis = this;
      setTimeout(function () {
        shis.videoPlayer.nativeElement.src = 'api/assets/music/Albums/' + tmp;
      }, 1000);
      setTimeout(function () {
        shis.listeners();
        shis.videoPlayer.nativeElement.play();
        document.getElementById('player_startbutton').classList.add('hidden');
        document
          .getElementById('player_pausebutton')
          .classList.remove('hidden');
        shis.updateHits(video);
        shis.updateHits(shis.album[0]);
        document.getElementById('player_status').innerHTML =
          'Playing ' + shis.album[0].title;
        //if(shis.listener == false)
      }, 1000);
      this.scrollToTop();
      //this._cmsService.scontext(this.album[0]);
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

  updateHits(item) {
    item.hits = item.hits + 1;
    this._cmsService.page_update(item).subscribe();
  }

  player_backwardzz() {
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
  }

  settab(tid) {
    this.activeMenu = tid;
  }
}
