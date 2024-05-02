import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  activeMenu: string;
  toggleHidden = true;

  constructor(
    public _userService: UserService,
    public _cmsService: CmsService
  ) {}

  ngOnInit() {
    this.activeMenu = 'Home';
  }

  settab(title, tid) {
    this.activeMenu = title;
    if (title == 'Users') {
      //this._cmsService.clear_treelevels();
    }
    //console.log('Deze?');
    this._cmsService.getcms(tid).subscribe((res) => this.settabReady(res));
  }

  settabReady(res) {
    this._cmsService.scontext(res);
  }

  settabc(title, tid) {
    this.activeMenu = title;

    this._cmsService.getcms(tid).subscribe((res) => this.settabReady(res));
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
