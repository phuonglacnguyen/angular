import { Component, OnInit } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-homepagemovies',
  templateUrl: './homepagemovies.component.html',
  styleUrls: ['./homepagemovies.component.css']
})

export class homepageMoviesComponent implements OnInit {
  items = [];
  itemsCount = 0;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
    ) {
    this.getAllMoviesLists();
  }

  ngOnInit() { }

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
