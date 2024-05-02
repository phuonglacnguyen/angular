import { Component } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

    constructor(
      public _cmsService: CmsService,
      public _userService: UserService) { }

  d_toggle_searchdiv(args) {
    document.getElementById('ngpipes').classList.toggle('hidden');
  }

  titlecheck(title: string) {
    var ntitle = '';
    ntitle = title.replace('Homepage',"homepage");
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
