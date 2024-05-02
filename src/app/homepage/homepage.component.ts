import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { CmsService } from '../services/cms.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  ipAddress: string;
  bloks = [
    {
      _id: '5c0d45ea64c6c530246b568a', // moviesV
      type: 'v',
    },
    {
      _id: '5c0d45ea64c6c530246b568c', // documentarys
      type: 'c',
    },
    {
      _id: '5c0d45ea64c6c530246b568f', // computer
      type: 'd',
    },
    {
      _id: '5c0d45ea64c6c530246b5690', // series
      type: 'c',
    },
    {
      _id: '5c01114b962a560534e3e574', // personal video albums
      type: 'p',
    },
    {
      _id: '5c35264fecfbd41448ff71ad', // music album
      type: 'm',
    },
    {
      _id: '5c0d45ea64c6c530246b5690', // series
      type: 'd',
    },
    {
      _id: '5bf9cd3ce2776742d808319c', // photoalbums
      type: 'q',
    },
    {
      _id: '5c0d45ea64c6c530246b5691', // phimbo
      type: 'd',
    },
    {
      _id: '5c0d45ea64c6c530246b5691', // phimbo
      type: 'c',
    },
    {
      _id: '5ca885cce19d492df0898192', // mobile
      type: 'q',
    },
    {
      _id: '5c0d45ea64c6c530246b568f', // mobile
      type: 'c',
    },
    {
      _id: '5c0d45ea64c6c530246b568c', // documentarysV
      type: 'v',
    },
    {
      _id: '5c0d45ea64c6c530246b568a', // movies
      type: 'c',
    },
    {
      _id: 'history', // history
      type: 'h',
    },
  ];

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
  ) {
    document.title = this._userService.user_current
      ? 'Welcome ' + this._userService.user_current.first_name + ' | Voormezelf'
      : 'Voormezelf';

    document.querySelector('#search').classList.add('hidden');
    document.getElementById('search').setAttribute('display', 'none');

    this._cmsService
      .getcms('5a11ca02aaa94d061a93e71c')
      .subscribe((result) => this.getPageRmeady(result));
  }

  getPageRmeady(page) {
    this._cmsService.scontext(page);
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollToBottom() {
    window.scroll({
      top: 8000,
      left: 0,
      behavior: 'smooth',
    });
  }

  clearPopupDiv() {
    document.getElementById('PopupDiv').innerHTML = '';
    document.getElementById('homepage').style.opacity = '1.0';
    document.getElementById('homepage').style.position = 'relative';
  }
}
