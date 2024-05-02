import { ElementRef, Component, ViewChild } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-homepageimages',
  templateUrl: './homepageImages.component.html',
  styleUrls: ['./homepageImages.component.css']
})

export class homepageImagesComponent {
  @ViewChild('carousel') private carousel: ElementRef; // , { static: true}
  items = [];
  itemsCount = 0;
  private currentSlide = 0;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService) {
    this.getAllImagesLists();
  }

  reloadImages() {
    this.currentSlide = 0;
    this.getAllImagesLists();
  }

  getImagesLists() {
    this._cmsService.getDashboardImages(this.itemsCount)
      .subscribe(result => this.getImagesListsReady(result));
  }

  getImagesListsReady(res) {
    this.items = res;
  }

  getAllImagesLists() {
    this._cmsService.getDashboardAllImages()
      .subscribe(result => this.getAllImagesListsReady(result));
  }

  getAllImagesListsReady(res) {
    this.itemsCount = res;
    this.getImagesLists();
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
      document.getElementById('PopupDiv').innerHTML = "<img src='"+url+"' alt='' />";
      document.getElementById('homepage').style.opacity = '0.0';
      document.getElementById('homepage').style.position = 'fixed';
    }
  }

}
