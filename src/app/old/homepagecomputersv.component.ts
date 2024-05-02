import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-homepagecomputersv',
  templateUrl: './homepagecomputersv.component.html',
  styleUrls: ['./homepagecomputersv.component.css'],
})
export class homepageComputersvComponent implements OnInit {
  items = [];
  itemsCount = 0;
  parent;
  enviapiurl = environment.API_URL;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
  ) {
    this.getAllComputersvLists();
  }

  ngOnInit() {
    var dhis = this;
    setTimeout(function () {
      document.addEventListener('scroll', (event) => {
        var video = document.getElementById(
          'dashboardcomputerplayercv'
        ) as HTMLVideoElement;
        var scrollTop = window.scrollY;
        if (
          document.getElementById('dashboardcomputerplayercv') &&
          scrollTop > 200 &&
          dhis._cmsService.elementInViewport(
            document.getElementById('dashboardcomputerplayercv')
          ) == true &&
          window.innerWidth < 600
        ) {
          if (dhis._cmsService.videoPlaying == false) {
            var promise = video.play();
            dhis._cmsService.videoPlaying = true;
          }
        } else if (video) {
          video.pause();
          dhis._cmsService.videoPlaying = false;
        }
      });
    }, 1500);
  }

  reloadImages() {
    this.getAllComputersvLists();
  }

  getHomevideosLists() {
    this._cmsService
      .getDashboardComputersv(this.itemsCount)
      .subscribe((result) => this.HomevideosReady(result));
  }

  HomevideosReady(res) {
    this.items = res;
    this.parent = res;

    this._cmsService
      .getDashboardHomevideosKid(res[0]._id)
      .subscribe((result) =>
        this.getDashboardHomevideosKid(result, res[0]._id)
      );
  }

  getDashboardHomevideosKid(res, parent) {
    this._cmsService
      .getDashboardHomevideosKidReady(res, parent)
      .subscribe((result) => this.getDashboardHomevideosKidReady(result));
  }

  getDashboardHomevideosKidReady(res) {
    this.items = res;
    document
      .getElementById('dashboardcomputerplayercvsrc')
      .setAttribute(
        'src',
        environment.API_URL +
          '/api/assets/content/' +
          this.items[0]._id +
          '/main.mp4'
      );
  }

  getAllComputersvLists() {
    this._cmsService
      .getDashboardAllComputersv()
      .subscribe((res) => this.getAllHomevideosListsReady(res));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
  }
}
