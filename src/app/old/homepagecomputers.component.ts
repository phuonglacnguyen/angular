import { ElementRef, Component, OnInit, ViewChild } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';
import { User } from '../user/user';

@Component({
  selector: 'app-homepagecomputers',
  templateUrl: './homepagecomputers.component.html',
  styleUrls: ['./homepagecomputers.component.css']
})
export class homepageComputersComponent implements OnInit {
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

  ngOnInit() { }

  reloadImages() {
    this.currentSlide = 0;
    this.getAllDocumentarysLists();
  }

  getDocumentarysLists() {
    this._cmsService.getDashboardComputers(this.itemsCount)
      .subscribe(result => this.DocumentarysReady(result));
  }

  DocumentarysReady(res) {
    this.items = res;
  }

  getAllDocumentarysLists() {
    this._cmsService.getDashboardAllComputers()
      .subscribe(result => this.getAllDocumentarysListsReady(result));
  }

  getAllDocumentarysListsReady(res) {
    this.itemsCount = res;
    this.getDocumentarysLists();
  }

}
