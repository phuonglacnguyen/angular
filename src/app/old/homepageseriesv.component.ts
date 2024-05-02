import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-homepageseriesv',
  templateUrl: './homepageseriesv.component.html',
  styleUrls: ['./homepageseriesv.component.css']
})

export class homepageSeriesvComponent implements OnInit {
  items = [];
  itemsCount = 0;
  parent;
  @ViewChild('dashboadmovieplayersv') videoPlayer: any;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllSeriesLists();
  }

  ngOnInit() {
    var dhis = this;
      setTimeout(function() {
        document.addEventListener("scroll", (event) => {
        var video = document.getElementById('dashboardmovieplayersvza') as HTMLVideoElement;
        var scrollTop = window.scrollY;
        if(document.getElementById('dashboardmovieplayersvza') && scrollTop > 200 && dhis._cmsService.elementInViewport(document.getElementById('dashboardmovieplayersvza')) == true && window.innerWidth < 600) {
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
    this.getAllSeriesLists();
  }

  getHomevideosLists() {
    this._cmsService.getDashboardSeriesV(this.itemsCount)
      .subscribe(result => this.HomevideosReady(result));
  }

  HomevideosReady(res) {
    this.items = res;
    this.parent = res;
    this._cmsService.getDashboardHomevideosKid(res[0]._id)
      .subscribe(result => this.getDashboardHomevideosKid(result, res[0]._id));
  }

  getDashboardHomevideosKid(res, parent) {
    this._cmsService.getDashboardSeriesVKidReady(res, parent)
      .subscribe(result => this.getDashboardHomevideosKidReady(result));
  }

  getDashboardHomevideosKidReady(res) {
    this.items = res;
  }

  getAllSeriesLists() {
    this._cmsService.getDashboardAllSeriesz()
      .subscribe(result => this.getAllHomevideosListsReady(result));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
   }
}
