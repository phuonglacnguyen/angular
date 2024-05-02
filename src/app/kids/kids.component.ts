import { HostListener, ElementRef, Pipe, PipeTransform, Directive, Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
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
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.css']
})
export class KidsComponent implements OnInit {
  pageId;
  parentName;
  public allItems: any[];

  constructor(
    private _userService: UserService,
    private activatedRoute: ActivatedRoute,
    private _cmsService: CmsService) {
    document.title = (this._userService.user_current ? 'Welcome ' + this._userService.user_current.first_name + ' | Voormezelf' : 'Voormezelf');

    this.activatedRoute.params.subscribe(params => {
      this.parentName = params['parentName'];
      this.pageId = params['id'];

      this._cmsService.getcms(this.pageId)
      .subscribe(result => this.gettitleready(result) );

      this._cmsService.getPagesVisible(this.pageId)
        .subscribe(result => this.allItemsReady(result));
    });
    document.querySelector('#search').classList.add('hidden');

    if(this._userService.user_current != undefined) {
      var favs = this._userService.user_current.favorites.length;
      var rand = Math.floor(Math.random() * favs);
      var url = '/api/assets/content/'+this._userService.user_current.favorites[rand]._id+'/main.jpg';
     //console.log("url(."+url+")");
      //document.querySelector('body').style.backgroundImage = "url(."+url+")";
    }
  }

  gettitleready(obj) {
    this.parentName = obj.title;
    //if(this._cmsService.treelevels.length == 1) {
      this._cmsService.scontext(obj);
    //}
  }
    router: Router;

    public first_name: string = "";

  ngOnInit() {
     if(this._userService.user_current != undefined) {
      var favs = this._userService.user_current.favorites.length;
      var rand = Math.floor(Math.random() * favs);
      var url = '/api/assets/content/'+this._userService.user_current.favorites[rand]._id+'/main.jpg';
      //console.log("url(."+url+")");
      // document.querySelector('body').style.backgroundImage = "url(."+url+")";
      
      //this._cmsService.getBackgrounds()
      //  .then(res => this.getBackgroundsPush(res));
    } else {
      //document.querySelector('body').style.backgroundColor = "#000000";
    }
  }

  allItemsReady(result) {
    this.allItems = result;
  }

  titlecheck(title: string) {
    var ntitle = '';
    ntitle = title.replace('Videos',"Media");
    ntitle = ntitle.replace('Music',"Media");   
    ntitle = ntitle.replace('Personal',"Media");
 //   ntitle = ntitle.replace('Videos',"Media");
    ntitle = ntitle.replace('Movies',"Videos");   
    ntitle = ntitle.replace('3D',"Videos");
    ntitle = ntitle.replace('Documentarys',"Videos");
    ntitle = ntitle.replace('Computer',"Videos");
    ntitle = ntitle.replace('Series',"Videos");
    ntitle = ntitle.replace('Phim bo',"Videos");
    ntitle = ntitle.replace('UFC',"Videos");

    ntitle = ntitle.replace('Fav movies',"Videos");
    ntitle = ntitle.replace('Fav personal',"Personal");
    ntitle = ntitle.replace('Artist',"Music");
    ntitle = ntitle.replace('Collections',"Music");
    ntitle = ntitle.replace('Singles',"Music");
    ntitle = ntitle.replace('SoundTracks',"Music");
    ntitle = ntitle.replace('Fav music',"Music");
    
    ntitle = ntitle.replace('Photo Albums',"Personal");
    ntitle = ntitle.replace('Video Albums',"Personal");
    ntitle = ntitle.replace('Albums',"Music");

    ntitle = ntitle.replace('Persons',"Personal");
    ntitle = ntitle.replace('Mobile',"Personal");
    

    ntitle = ntitle.replace('Food',"Apps");
    ntitle = ntitle.replace('Shopping List',"Food");
    ntitle = ntitle.replace('Recipes',"Food");
    

    return ntitle;
  }


}
