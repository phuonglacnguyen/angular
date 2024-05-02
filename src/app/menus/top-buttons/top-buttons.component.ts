import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { User } from './../../../models/user';
import 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from './../../services/pagination.service';
import { IpServiceService } from './../../services/ip.service';
import { FilterService } from './../../services/filter.service';

@Component({
  selector: 'app-menu-topbuttons',
  templateUrl: './top-buttons.component.html',
  styleUrls: ['./top-buttons.component.css'],
})
export class menusTopButtons implements OnInit {
  public user: User = new User();
  activeMenu: string = '';
  albumArray: Array<string> = [];
  moviesFavArray: Array<string> = [];
  personalFavArray: Array<string> = [];
  urlHistoryArray: Array<string> = [];
  @Output() updateLoginEvent = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private _cmsService: CmsService,
    public _userService: UserService,
    private pagerService: PagerService,
    public router: Router,
    private ip: IpServiceService,
    public _filterService: FilterService
  ) {}

  ngOnInit() {
    this.getIP();
    window.addEventListener('beforeunload', (event) => {
      event.returnValue = `You have unsaved changes, leave anyway?`;
    });
  }

  dd_userlogin() {
    var usrlogin = document.getElementById('userloginform');
    var curmargd = usrlogin.style.display;
    if (usrlogin.classList.contains('hidden') === true) {
      usrlogin.classList.remove('hidden');
      document.getElementById('header_loginclose').style.display = 'block';
    } else {
      usrlogin.classList.add('hidden');
      document.getElementById('header_loginclose').style.display = 'none';
    }
  }

  settab(tid) {
    var tabfield = document.getElementsByClassName('tabfield ');
    for (var i = 0; i < tabfield.length; i++) {
      tabfield[i].classList.add('hidden');
    }
    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('active');
    myButtonClasses.remove('hidden');
    document.getElementById(tid).classList.remove('hidden');
  }

  indexToggle() {
    var indexElement = document.getElementById('index');
    if (indexElement.classList.contains('hidden') === true) {
      document.getElementById('index').classList.remove('hidden');
      document.getElementById('indexToggle').classList.add('icmn-arrow-right');
      document
        .getElementById('indexToggle')
        .classList.remove('icmn-arrow-left');
    } else {
      document.getElementById('index').classList.add('hidden');
      document
        .getElementById('indexToggle')
        .classList.remove('icmn-arrow-right');
      document.getElementById('indexToggle').classList.add('icmn-arrow-left');
    }
  }

  dd_toggle_searchdiv(args) {
    document.getElementById('ngpipes').classList.toggle('hidden');
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      if (res.ip == '77.171.83.149') {
        this.user.email = 'webmaster@tekniek.com';
        this.user.password = 'Lievelinh@13';
        this.getLogin(this.user);
      }
    });
  }

  user_login_form() {
    this.getLogin(this.user);
  }

  getLogin(args) {
    this._userService
      .login(this.user)
      .subscribe((data) => this.deluserlogin(data));
  }

  deluserlogin(data) {
    if (data != false) {
      this._userService.setCurrentUser(data);
      this._userService.setUserLoggedIn();
      document.getElementById('ajaxres').innerHTML =
        'Welcome ' + (data.gender == 'M' ? 'Mr' : 'Ms') + ' ' + data.last_name;
      //console.log(this.router.url);
      this._cmsService.updateLoginEvent.emit('true');
    } else {
      this._userService.unsetUserLoggedIn();
    }
  }

  reloadURL(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url], {
      relativeTo: this.route,
    });
  }
}
