import { ElementRef, Component, ViewChild } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-homepagedocumentarys',
  templateUrl: './homepagedocumentarys.component.html',
  styleUrls: ['./homepagedocumentarys.component.css'],
})
export class homepageDocumentarysComponent {
  @ViewChild('carousel') private carousel: ElementRef;
  items = [];
  itemsCount = 0;
  enviapiurl = environment.API_URL;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
  ) {
    this.getAllDocumentarysLists();
  }

  reloadImages() {
    this.getAllDocumentarysLists();
  }

  getDocumentarysLists() {
    this._cmsService
      .getDashboardDocumentarys(this.itemsCount)
      .subscribe((result) => this.DocumentarysReady(result));
  }

  DocumentarysReady(res) {
    this.items = res;
    document
      .getElementById('homepagedocumentarys')
      .setAttribute(
        'src',
        environment.API_URL +
          '/api/assets/content/' +
          this.items[0]._id +
          '/thumb.jpg'
      );
  }

  getAllDocumentarysLists() {
    this._cmsService
      .getDashboardAllDocumentarys()
      .subscribe((result) => this.getAllDocumentarysListsReady(result));
  }

  getAllDocumentarysListsReady(res) {
    this.itemsCount = res;
    this.getDocumentarysLists();
  }
}
