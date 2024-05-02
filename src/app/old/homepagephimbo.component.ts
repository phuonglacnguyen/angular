import { ElementRef, Component, ViewChild } from '@angular/core';
import { CmsService } from '../services/cms.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-homepagephimbo',
  templateUrl: './homepagephimbo.component.html',
  styleUrls: ['./homepagephimbo.component.css']
})

export class homepagePhimBoComponent {
  @ViewChild('carousel') private carousel: ElementRef; // , { static: true}
  items = [];
  itemsCount = 0;
  private currentSlide = 0;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
    ) {
    this.getAllDocumentarysLists();
  }

  reloadImages() {
    this.currentSlide = 0;
    this.getAllDocumentarysLists();
  }

  getDocumentarysLists() {
    this._cmsService.getDashboardPhimBo(this.itemsCount)
      .subscribe(result => this.PhimBoReady(result));
  }

  PhimBoReady(res) {
    this.items = res;
  }

  getAllDocumentarysLists() {
    this._cmsService.getDashboardAllPhimBo()
      .subscribe(result => this.getAllDocumentarysListsReady(result));
  }

  getAllDocumentarysListsReady(res) {
    this.itemsCount = res;
    this.getDocumentarysLists();
  }

}
