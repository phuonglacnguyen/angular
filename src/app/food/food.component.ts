import { ElementRef, AfterViewInit, ViewChild, Component, OnInit, Input, HostListener } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { FilterService } from './../services/filter.service';
import { PagerService } from './../services/pagination.service';
import { Page } from './../../models/page';
import { SafePipe } from './../pipes/url.pipe';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})

export class FoodComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: any; // , { static: true}
  @ViewChild('videoSource') videoSource: any; // , { static: true}
   @Input() filterText;
   @Input() filterFirstletter;
   @Input() filterGenre;
   currentView = '';
   activeMenu: string;
   toggleHidden = true;
   albumId;
   albumKids;
   videoId = '';
   video;
   mediaPath = '/api/assets/content/';
   tracks;
   private allItems: any[];
   pager: any = {};
   pagedItems = [];
   player;
   playerTime;
   playListIndex = 1;
  playersource;
  albums;
  album;
  currentAlbum = new Page();
   items = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");

   constructor(
      private router: Router,
      public _userService: UserService,
      private _cmsService: CmsService,
      private _filterService: FilterService,
      private activatedRoute: ActivatedRoute,
     private pagerService: PagerService,
     private elementRef: ElementRef
   ) {
     this.activatedRoute.params.subscribe(params => {
       this.albumId = params['albumName'];
       this.videoId = params['id'];

       if(this.videoId == '5dbaab24acd3962b3cb12e2d') { // shopping list
        this.currentView = 'ShoppingList';
       } else {
        this.currentView = 'Recipes';
       }

       if (this.videoId != undefined) { // && this._userService.getUserLoggedIn() == true
         this.setVideo();
         this._cmsService.getPagesDesc(this.videoId)
            .subscribe(result => this.albums = result);
       }
       if (this.albumId == '5c0d45ea64c6c530246b568c' || this.albumId == '5c0d45ea64c6c530246b568f' || this.albumId == '5c0d45ea64c6c530246b568a' || this.albumId == '5c0d45ea64c6c530246b568b') {
         this._cmsService.getPagesDesc(this.albumId)
           .subscribe(result => this.allItemsReady(result));
       } else {
         this._cmsService.getPagesAsc(this.albumId)
           .subscribe(result => this.allItemsReady(result));
       }
     });
     this.player = document.getElementById('player');
     this.playersource = document.getElementById('playersource');
     this.filterFirstletter = '';
     this.filterGenre = '';

     document.querySelector('#search').classList.remove('hidden');
     document.getElementById('search').setAttribute('display','inline-block');
   }

  allItemsReady(result) {
    this.allItems = result;
    //console.log(this.videoId);
    //this.setPage(1);
    //this.playlist();
   // var a = this.pagedItems.map(function (e) { return e._id; }).indexOf(this.videoId);
    
    //var b = result.map(function (e) { return e._id; }).indexOf(this.videoId);
    //var bindex = ((b + 1) / 10);

    //if (Math.ceil(bindex) > 1) {
    //  this.setPage(Math.ceil(bindex));
    //  this.playListIndex = Math.ceil(bindex);
    //}// else {
    //  this.playListIndex = a;
    //}
    //console.log('allItemsReady');
  }

  setRecipe(page) {
    this.video = page;
    if(document.getElementById('youtube'))
    document.getElementById('youtube').setAttribute('src' , 'http://www.youtube.com/embed/' + page.schemaextend[0].youtube );
  
    //this._cmsService.checkAssetFile('image', '', this.video._id).subscribe(res => this.checkAssetFileResult(res, 'image', this.video._id));

  }

  addToCart(index, page) {
    var a = this.pagedItems.map(function (e) { return e._id; }).indexOf(page._id);
    //console.log(a);
    if(a == -1)
    this.pagedItems.push(page);

   //this.albums.splice(index,1);
  }

  removeFromCart(index, page) {
    this.pagedItems.splice(index,1);
    //this.albums.push(page);
  }

  AddNewProduct() {
    var title = (<HTMLInputElement>document.getElementById('productName')).value;
    var nameCapitalized = title.charAt(0).toUpperCase() + title.slice(1)

    var a = this.albums.map(function (e) { return e.title; }).indexOf(nameCapitalized);

    if(a == -1) {
      var npage = new Page();
      npage.parent = '5dbaab24acd3962b3cb12e2d'; // shopping list
      npage.objectType = '5a62a7af2b0cae362ccddbe6'; // webpage
      npage.treelevel = 4;
      npage.title = nameCapitalized;
      npage.visible = true;
      var tmp = {};
      tmp['intro'] = '';
      tmp['content'] = '';
      tmp['keywords'] = '';
      npage.schemaextend[0] = tmp;

      this._cmsService.insertPage(npage)
                        .subscribe(page => this.newPageReady(page));
                        //.catch(err => this._messageService.SetAlertDanger(err));

    }
  }

  newPageReady (page) {
    //console.log(this.albumId);
    this._cmsService.getPagesAsc('5dbaab24acd3962b3cb12e2d')
           .subscribe(result => this.newPageReadyRes(result));
  }

    newPageReadyRes (result) {
    //console.log(this.albumId);
    this.albums = result;
    //this.albums.sort();
  }

  loadImages() {
    setTimeout(function () {
      var cdiw = document.getElementsByClassName('movieimage');
      for (var c = 0; c < cdiw.length; c++) {
        if (c == 0) {
          var nwidth = cdiw[c].clientWidth;
          var nheight = cdiw[c].clientHeight;
          //if (cdiw[c].classList.contains('blokmedia')) {
          cdiw[c].setAttribute('height', nwidth + 'px');

          if (nwidth == 0 || nwidth == undefined)
            nwidth = 100;
          if (nheight == 0 || nheight == undefined)
            nheight = 150;
          //}
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
    //console.log('In the videos component ...');
    //document.getElementById('player').addEventListener("playing", this.startedPlaying());
  }

  ngAfterViewInit() {
    //this.elementRef.nativeElement.querySelector('video')
    //  .addEventListener('onplay', this.onClick.bind(this));
    //var vidp = this.videoPlayer;
    var vid = document.getElementById("player");

    if (this._userService.getUserLoggedIn() == true) {
      if (this.videoId != undefined) {


        //vid.onplay = function () {
        //  alert("The video has started to play");
        //};
      }
    }
  }

  setVideo() {
    this._cmsService.getcms(this.videoId)
      .subscribe(result => this.setVideoReady(result))
  }

  loadalbum(album) {
    this._cmsService.getPages(album._id)
      .subscribe(result => this.loadalbumReady(result));

    document.getElementById('current_title').innerHTML = '<h4>' + album.title + '</h4>';
    this.currentAlbum = album;
    //this.playlist();
    //this.videoSource.setAttribute('src', this.tracks[this.playListIndex]);
  }

  loadalbumReady(album) {
    this.album = album;
    //this.setVideo();
    //this.playListIndex = 1;
    //this.playlist();
    //this.playTracks(0, 'api/assets/music/Albums/' +album[0].schemaextend[0].url);
  }

  setVideoReady(video) {
    this.video = video;

    this._cmsService.getPagesAsc(this.videoId)
      .subscribe(res => this.albums = res);

    this._cmsService.checkAssetFile('image', '', video._id).subscribe(res => this.checkAssetFileResult(res, 'image', video._id));

    //this.loadImages();

    
  }

  myFunction() {
    console.log('hello world');
  }

  checkAssetFileResult(res, fname, id) {
    if (res != 'no') {
      document.getElementById('detailimage').innerHTML = '<img src="./api/assets/content/' + id + '/' + fname + '.jpg" class="" width="120" alt="" />';
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

  setVideoLink(index, video) {
    //if (this._userService.getUserLoggedIn() == true) {
    if (video.parent == '5c35264fecfbd41448ff71ad') {
        this.router.navigate(['/Music/' + this.albumId + '/' + video._id]);
        //this.videoId = video._id;
        //this.playListIndex = index;
        //this.setVideo();
        //this.playTrack(index);
        //console.log('eh1');
      } else if (video.parent == '5c0d45ea64c6c530246b568c' || video.parent == '5c0d45ea64c6c530246b5690' || video.parent == '5c0d45ea64c6c530246b5691' || video.parent == '5c0d45ea64c6c530246b568f') {
        //console.log('eh2');
        this.router.navigate(['/Music/' + video._id]);
      } else {
        //console.log('eh3');
        this.router.navigate(['/Music/' + this.albumId + '/' + video._id]);
        this.videoId = video._id;
        this.playListIndex = index;
        this.video = video;
        this.setVideo();
      }
    //}
  }
  
  setPage(counter: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, counter);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    //this.loadImages();
  }

   settab(tid) {
       this.activeMenu = tid;
   }

}
