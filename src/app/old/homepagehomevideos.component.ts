import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-homepagehomevideos',
  templateUrl: './homepagehomevideos.component.html',
  styleUrls: ['./homepagehomevideos.component.css']
})

export class homepageHomevideosComponent implements OnInit {
  items = [];
  itemsCount = 0;
  isMobile;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllHomevideosLists();
  }

  ngOnInit() {
    var dhis = this;
      setTimeout(function() {
          document.addEventListener("scroll", (event) => {
          var video = document.getElementById('dashboardmovieplayerhvv') as HTMLVideoElement;
          var scrollTop = window.scrollY;
          if(document.getElementById('dashboardmovieplayerhvv') && scrollTop > 200 && dhis._cmsService.elementInViewport(document.getElementById('dashboardmovieplayerhvv')) == true && window.innerWidth < 600) {
            if(dhis._cmsService.videoPlaying == false) {
              var promise = video.play();
              dhis._cmsService.videoPlaying = true;
            }
          } else if(video) {
            video.pause();
            dhis._cmsService.videoPlaying = false;
          }
          });
      }, 1500);
  }

  reloadImages() {
    this.getAllHomevideosLists();
  }

  getHomevideosLists() {
    this._cmsService.getDashboardHomevideos(this.itemsCount)
      .subscribe(result => this.HomevideosReady(result));
  }

  HomevideosReady(res) {
    this.items = res;
    this._cmsService.getDashboardHomevideosKid(res[0]._id)
      .subscribe(result => this.getDashboardHomevideosKid(result, res[0]._id));
  }

  getDashboardHomevideosKid(res, parent) {
    this._cmsService.getDashboardHomevideosKidReady(res, parent)
      .subscribe(result => this.getDashboardHomevideosKidReady(result));
  }

  getDashboardHomevideosKidReady(res) {
    this.items = res;
    var tez = this;
    setTimeout(function () {
      var video = document.getElementById('dashboardmovieplayerhvv') as HTMLVideoElement;
      if(document.getElementById('dashboardmovieplayerhvv')) {
        document.getElementById('dashboardmovieplayerhvv').setAttribute('src' , '/api/assets/content/'+tez.items[0]._id+'/main.mp4');
        video.load();
      }
    }, 100);
  }

  getAllHomevideosLists() {
    this._cmsService.getDashboardAllHomevideos()
      .subscribe(result => this.getAllHomevideosListsReady(result));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
   }

   scrollToTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
   }

   fullscreen(url) {
    if(window.innerWidth > 600) {
      document.getElementById('PopupDiv').innerHTML = "<video src='"+url+"' controls autoplay></video>";
      document.getElementById('homepage').style.opacity = '0.0';
      document.getElementById('homepage').style.position = 'fixed';
      setTimeout(function(){ 
        (<HTMLVideoElement>document.getElementById('dashboardmovieplayerhvv')).pause();
      }, 1000);
    }
  }

}
