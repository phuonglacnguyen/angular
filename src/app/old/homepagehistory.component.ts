import { ElementRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-urlhistory',
  templateUrl: './homepagehistory.component.html',
  styleUrls: ['./homepagehistory.component.css']
})

export class UrlHistoryComponent implements OnInit {
  items = [];
  itemsCount = 0;
  userHistory = [];

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
    ) {
    this.getAllMoviesLists();
  }

  ngOnInit() {
    if(this._userService.user_current != undefined) {
      this.userHistory = this._userService.user_current.urlHistory;
    }
  }

  urlConvert(url) {
    let tmp = url.split('/');
    return (tmp[3] ? (tmp[1]+'/'+tmp[3]) : url);
  }

  removeHistory(index) {
    this._userService.user_current.urlHistory.splice(index, 1);
    this._userService.update(this._userService.user_current).subscribe();
  }

  reloadImages() {
    this.getAllMoviesLists();
  }

  getAllMoviesLists() {
    this._cmsService.getDashboardAllMovies()
      .subscribe(result => this.getAllMoviesListsReady(result));
  }

  getAllMoviesListsReady(res) {
    this.items = res;
  }
}
