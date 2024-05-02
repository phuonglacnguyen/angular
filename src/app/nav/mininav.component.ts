import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
//import { UserLoginComponent } from './../user/user-login/user-login.component';
//import { FilterService } from './../services/filter.service';
//mport { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { User } from './../../models/user';

//import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-mininav',
  templateUrl: './mininav.component.html',
  styleUrls: ['./mininav.component.css'],
})
export class MiniNavComponent implements OnInit {
  activeMenu: string;
  toggleHidden = true;
  //public user: User = new User();

  constructor(
    // private router: Router,
    public _userService: UserService,
    public _cmsService: CmsService,
    private _router: Router,
    private route: ActivatedRoute // private _filterService: FilterService
  ) {}

  ngOnInit() {
    this.activeMenu = 'Home';
  }

  settab(title, tid) {
    this.activeMenu = title;
    //this._cmsService.context(tid);
  }

  settabc(title, tid) {
    this.activeMenu = title;
    //this._cmsService.scontext(tid);
  }

  d_toggle_searchdiv() {
    if (document.getElementById('ngpipes'))
      document.getElementById('ngpipes').classList.toggle('hidden');
  }

  resetBreadcrumb() {
    this._cmsService.clear_treelevels();
    //this._cmsService.context(this._cmsService.pageRoot);
  }

  dd_userlogin() {
    var usrlogin = document.getElementById('userloginform');
    var curmargd = usrlogin.style.display;
    console.log(curmargd);
    if (usrlogin.classList.contains('hidden') === true) {
      usrlogin.classList.remove('hidden');
      document.getElementById('header_loginbutton').style.display = 'none';
      document.getElementById('header_loginclose').style.display = 'block';
    } else {
      usrlogin.classList.add('hidden');
      document.getElementById('header_loginbutton').style.display = 'block';
      document.getElementById('header_loginclose').style.display = 'none';
    }
  }

  toggle_hidden() {
    var element = document.getElementsByClassName('button_hide');
    if (this.toggleHidden == false) {
      document.getElementById('button_hiddenFields').className = 'no_display';
      document.getElementById('button_hiddenFields').className =
        'icon_b pull-right';
      for (var i = 0; i < element.length; i++) {
        element[i].classList.add('hidden');
      }
    } else {
      document.getElementById('button_hiddenFields').className =
        'icon_b pull-right txt_red';
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove('hidden');
      }
    }
    this.toggleHidden = !this.toggleHidden;
  }

  dd_toggle_searchdiv() {
    var elema = document.getElementById('ngpipes');
    if (elema.classList.contains('hidden') === true) {
      elema.classList.remove('hidden');
      document.getElementById('search').innerHTML =
        '<div class="txt_lightgrey icmn-zoom-in2"></div>';
    } else {
      elema.classList.add('hidden');
      document.getElementById('search').innerHTML =
        '<div class="icmn-search2"></div>';
    }
  }
}
