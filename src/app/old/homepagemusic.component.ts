import { Component } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-homepagemusic',
  templateUrl: './homepagemusic.component.html',
  styleUrls: ['./homepagemusic.component.css']
})
export class homepageMusicComponent {
  items = [];
  itemsCount = 0;
  kids: any;
  album;
  artist;
  albums;
  
  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllHomevideosLists();
  }

  reloadImages() {
    this.getAllHomevideosLists();
  }

  getHomevideosLists() {
    this._cmsService.getDashboardMusic(this.itemsCount)
      .subscribe(result => this.HomevideosReady(result));
  }

  loadfile(url, album) {
    if (this._userService.user_current != undefined) {
      const video = document.getElementById('mp3player') as HTMLAudioElement | null;
      video.src = 'http://77.171.83.149:3001/api/assets/music/Albums/'+url;
    }
  }

  HomevideosReady(res) {
    this.items = res;
    this._cmsService.getPages(res[0]._id).subscribe(itemz => this.getDashboardmusicKids(itemz, res[0]._id));
  }

  albumReady(result) {
    this.album = result;
     this._cmsService.getcms(this.album.parent).subscribe(result => this.artist = result);
  }

  getDashboardmusicKids(res, parent) {
    this.albums = res;
    this._cmsService.getcms(parent)
          .subscribe(result => this.albumReady(result));

    this._cmsService.getPages(res[0]._id).subscribe(itemz => this.kids = itemz);
  }

  getDashboardHomevideosKidReady(res) {
    console.log(res);
    this.items = res;
    var tez = this;
    setTimeout(function () {
      const video = document.getElementById('dashboardmusicplayer') as HTMLVideoElement | null;
      document.getElementById('dashboardmusicplayersrc').setAttribute('src' , '/api/assets/content/'+tez.items[0]._id+'/main.mp3');
      video.load();
    }, 500);
    
    setTimeout(function () {
      var video = document.getElementById('dashboardmusicplayer');

      var tabrowl = document.getElementsByClassName('carouselimage');
      for (var i = 0; i < tabrowl.length; i++) {
        tabrowl[i].setAttribute("height" , (video.clientHeight) + 'px');
      }

      var tabrowl = document.getElementsByClassName('carousel-imagez');
      for (var i = 0; i < tabrowl.length; i++) {
        if (i == 0) {
          var wheight = tabrowl[i].clientHeight;
          var wwidth = (tabrowl[i].clientWidth - 40);
        } else {
          tabrowl[i].setAttribute('height', wheight + 'px');
        }
      }

      var tabrowl = document.getElementsByClassName('carousel-info');
      for (var i = 0; i < tabrowl.length; i++) {
        if (i == 0) {
          var height = tabrowl[i].clientHeight;
          var width = (tabrowl[i].clientWidth - 40);
        }
      }

    }, 3000);
  }

  getAllHomevideosLists() {
    this._cmsService.getDashboardAllMusic()
      .subscribe(result => this.getAllHomevideosListsReady(result));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
   }

}
