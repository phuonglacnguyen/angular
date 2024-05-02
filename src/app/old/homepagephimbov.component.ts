import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-homepagephimbov',
  templateUrl: './homepagephimbov.component.html',
  styleUrls: ['./homepagephimbov.component.css']
})
export class homepagePhimBovComponent implements OnInit {
  items = [];
  itemsCount = 0;
  parent;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllPhimBoLists();
  }

  ngOnInit() {
    var dhis = this;
      setTimeout(function() {
          document.addEventListener("scroll", (event) => {
          var video = document.getElementById('dashboardmovieplayerpbspb') as HTMLVideoElement;
          var scrollTop = window.scrollY;
          const element = document.getElementById("dashboardmovieplayerpbspb");
          if(document.getElementById('dashboardmovieplayerpbspb') && scrollTop > 200 && dhis._cmsService.elementInViewport(element) == true && window.innerWidth < 600) {
            if(dhis._cmsService.videoPlaying == false) {
              var promise = video.play();
              dhis._cmsService.videoPlaying = true;
            }
          } else if(video) {
            video.pause();
            dhis._cmsService.videoPlaying = false;
          }
          });
      }, 2500);
  }

  reloadImages() {
    this.getAllPhimBoLists();
  }

  getHomevideosLists() {
    this._cmsService.getDashboardPhimbox(this.itemsCount)
      .subscribe(result => this.HomevideosReady(result));
  }

  HomevideosReady(res) {
    this.items = res;
    this.parent = res;
    this._cmsService.getDashboardHomevideosKid(res[0]._id).subscribe(result => this.getDashboardHomevideosKid(result, res[0]._id));
  }

  getDashboardHomevideosKid(res, parent) {
    this._cmsService.getDashboardHomevideosKidReady(res, parent).subscribe(result => this.getDashboardHomevideosKidReady(result));
  }

  getDashboardHomevideosKidReady(res) {
    this.items = res;
  }

  getAllPhimBoLists() {
    this._cmsService.getDashboardAllPhimboz()
      .subscribe(result => this.getAllHomevideosListsReady(result));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
   }
}
