import {
  HostListener,
  ElementRef,
  Pipe,
  PipeTransform,
  Directive,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { User, Address } from './../user/user';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Page } from './../../models/page';
import { News } from './../../models/bots/News';
import { MessageService } from './../services/message.service';
import { CmsObject } from './../../models/object';
import { CmsProperty } from './../../models/property';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-skids',
  templateUrl: './skids.component.html',
  styleUrls: ['./skids.component.css'],
})
export class SkidsComponent implements OnInit {
  pageId;
  parentName;
  public allItems: any[];

  constructor(
    private _userService: UserService,
    private activatedRoute: ActivatedRoute,
    private _cmsService: CmsService
  ) {
    document.title = this._userService.user_current
      ? 'Welcome ' + this._userService.user_current.first_name + ' | Voormezelf'
      : 'Voormezelf';

    this.activatedRoute.params.subscribe((params) => {
      this.parentName = params['parentName'];
      this.pageId = params['id'];

      this._cmsService
        .getPages(this.pageId)
        .subscribe((result) => this.allItemsReady(result));
    });
    document.querySelector('#search').classList.add('hidden');

    if (this._userService.user_current != undefined) {
      var favs = this._userService.user_current.favorites.length;
      var rand = Math.floor(Math.random() * favs);
      var url =
        '/api/assets/content/' +
        this._userService.user_current.favorites[rand]._id +
        '/main.jpg';
      //console.log("url(."+url+")");
      document.querySelector('body').style.backgroundImage =
        'url(.' + url + ')';
    }
  }
  router: Router;

  public first_name: string = '';

  ngOnInit() {
    if (this._userService.user_current != undefined) {
      var favs = this._userService.user_current.favorites.length;
      var rand = Math.floor(Math.random() * favs);
      var url =
        '/api/assets/content/' +
        this._userService.user_current.favorites[rand]._id +
        '/main.jpg';
      //console.log("url(."+url+")");
      document.querySelector('body').style.backgroundImage =
        'url(.' + url + ')';

      //this._cmsService.getBackgrounds()
      //  .then(res => this.getBackgroundsPush(res));
    } else {
      document.querySelector('body').style.backgroundColor = '#000000';
    }
  }

  allItemsReady(result) {
    this.allItems = result;
    this._cmsService.clear_treelevels();
    //this._cmsService.context(result);
  }
}
