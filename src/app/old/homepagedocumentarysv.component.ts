import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-homepagedocumentarysv',
  templateUrl: './homepagedocumentarysv.component.html',
  styleUrls: ['./homepagedocumentarysv.component.css']
})

export class homepageDocumentarysvComponent implements OnInit {
  items = [];
  itemsCount = 0;
  parent;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllComputersvLists();
  }

  ngOnInit() {
    var dhis = this;
      setTimeout(function() {
        document.addEventListener("scroll", (event) => {
        var video = document.getElementById('dashboardmovieplayerdcv') as HTMLVideoElement;
        if(document.getElementById('dashboardmovieplayerdcv') && dhis._cmsService.elementInViewport(document.getElementById('dashboardmovieplayerdcv')) == true && window.innerWidth < 600) {
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
    this.getAllComputersvLists();
  }

  getHomevideosLists() {
    this._cmsService.getDashboardDocumentarysv(this.itemsCount)
      .subscribe(result => this.HomevideosReady(result));
  }

  HomevideosReady(res) {
    this.parent = res;
    this._cmsService.getDashboardHomevideosKid(res[0]._id)
      .subscribe(result => this.getDashboardHomevideosKid(result, res[0]._id));
  }

  getDashboardHomevideosKid(res, parent) {
    this._cmsService.getDashboardHomevideosKidReady(res, parent)
      .subscribe(result => this.getDashboardHomevideosKidReady(result));
  }

  getDashboardHomevideosKidReady(res) {
    this.items = res;
  }

  getAllComputersvLists() {
    this._cmsService.getDashboardAllDocumentarysv()
      .subscribe(res => this.getAllHomevideosListsReady(res));
  }

  getAllHomevideosListsReady(res) {
    this.itemsCount = res;
    this.getHomevideosLists();
   }

}
