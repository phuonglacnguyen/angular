import { ElementRef, Component, ViewChild } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-homepageseries',
  templateUrl: './homepageseries.component.html',
  styleUrls: ['./homepageseries.component.css'],
})
export class homepageSeriesComponent {
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

  getAllDocumentarysLists() {
    this._cmsService
      .getDashboardAllSeries()
      .subscribe((result) => this.getAllDocumentarysListsReady(result));
  }

  getAllDocumentarysListsReady(res) {
    this.items = res;
    this.itemsCount = res;
    this.getDocumentarysLists();
  }

  getDocumentarysLists() {
    this._cmsService
      .getDashboardSeries(this.itemsCount)
      .subscribe((result) => this.DocumentarysReady(result));
  }

  DocumentarysReady(res) {
    this.items = res;
    document
      .getElementById('homepageseries')
      .setAttribute(
        'src',
        environment.API_URL +
          '/api/assets/content/' +
          this.items[0]._id +
          '/thumb.jpg'
      );
  }
}
