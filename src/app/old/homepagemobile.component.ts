import { ElementRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';


@Component({
  selector: 'app-homepagemobile',
  templateUrl: './homepagemobile.component.html',
  styleUrls: ['./homepagemobile.component.css']
})

export class homepageMobileComponent implements OnInit {
  @ViewChild('carousel') private carousel: ElementRef; // , { static: true}
  items = [];
  itemsCount = 0;
  private currentSlide = 0;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllImagesLists();
  }
    
  ngOnInit() {
    var dhis = this;
      setTimeout(function() {
        document.addEventListener("scroll", (event) => {
        var video = document.getElementById('dashboardmobileplayer') as HTMLVideoElement;
        if(document.getElementById('dashboardmobileplayer') && dhis._cmsService.elementInViewport(document.getElementById('dashboardmobileplayer')) == true && window.innerWidth < 600) {
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
    this.currentSlide = 0;
    this.getAllImagesLists();
  }

  getImagesLists() {
    this._cmsService.getDashboardMobiles(this.itemsCount).subscribe(result => this.getImagesListsReady(result));
  }

  getImagesListsReady(res) {
    this._cmsService.getDashboardMobilesKid(res[0]._id, res[0].kids).subscribe(result => this.getDashboardMobilesKidReady(result));
  }

  getDashboardMobilesKidReady(evt) {
     this.items = evt;
  }

  getAllImagesLists() {
    this._cmsService.getDashboardAllMobiles()
      .subscribe(result => this.getAllImagesListsReady(result));
  }

  getAllImagesListsReady(res) {
    this.itemsCount = res;
    this.getImagesLists();
  }

  fullscreenVideo(url) {
    document.getElementById('PopupDiv').innerHTML = "<video src='"+url+"' controls autoplay></video>";
    setTimeout(function(){ 
      (<HTMLVideoElement>document.getElementById('dashboardmobileplayer')).pause();
     }, 1000);
     document.getElementById('homepage').style.opacity = '0.0';
     document.getElementById('homepage').style.position = 'fixed';
  }

  scrollToTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
   }

  fullscreenImage(url) {
    if(window.innerWidth > 600) {
      document.getElementById('PopupDiv').innerHTML = "<img src='"+url+"' alt='' />";
      document.getElementById('homepage').style.opacity = '0.0';
      document.getElementById('homepage').style.position = 'fixed';
    }
  }

}
