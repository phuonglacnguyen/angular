import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { Address } from './user';
import { User } from './../../models/user';
import { UserTabsComponent } from './user-tabs/user-tabs.component';
import { MessageService } from '../services/message.service';

import { ParentPipe } from './../pipes/parent.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { UserListComponent } from './user-list/user-list.component';
import { Observable } from 'rxjs';
//import { CanActivate, Router,ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route} from '@angular/router';

@Component({
  selector: 'app-usertab',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  //users: Array<User> = [];
  public newUser = new User();
  public showNewUser = false;
  public showEditUser = false;
  public userEdit: User = new User();
  public user_selected = new User();
  @Input() user: User;

  public hello = 'user base value';
  public goodbye: string;
  public listClick = new User();
  public activeRow = '';

  items = new Array(
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  );
  @Input() filterText;
  @Input() filterFirstletter;
  @Input() filterParent;
  @Input() filterMediaList;
  @Input() filterKidsList;
  @Input() cmsFilterVisible;
  @Input() cmsFilterSecure;
  @Input() cmsFilterdateCreated;
  @Input() cmsFilterEnddate;
  @Input() cmsFilterStartdate;

  @Output() updateUserEventt = new EventEmitter();
  @Output() updateUserEditCreateForm = new EventEmitter();
  @Output() updateNewUserEvent = new EventEmitter();

  //form: FormGroup;
  objectProps;
  userObject;

  constructor(
    private sanitizer: DomSanitizer,
    public _messageService: MessageService,
    public _cmsService: CmsService,
    public _userService: UserService //, //private router: Router
  ) {
    document.querySelector('#search').classList.add('hidden');
    document.getElementById('search').setAttribute('display', 'none');
  }

  ngOnInit() {
    document.title = 'Users Management Page';
    this.getUsers();

    this.filterFirstletter = '';
    this.cmsFilterVisible = 0;
    this.cmsFilterSecure = 0;
    this.filterParent = '';
    this.filterMediaList = '';
    this.filterKidsList = '';
  }

  closeMessageAlert() {
    document.getElementById('messagesAlert').classList.add('hidden');
  }

  showEditUs(user) {
    this.showEditUser = true;
    //this.showNewUser = false;
    //this.userEdit = user;
    //this.user_selected = user;
    //this.updateUserEditCreateForm.emit(user);
  }

  toggle_hideedit(event) {
    this.showEditUser = false;
    this.updateNewUserEvent.emit(this.showEditUser);
  }

  public setDataFromChild(data) {
    this.goodbye = data;
  }

  public setDataFromChilld(data) {
    this.goodbye = data;
  }

  setShowNewUser(val) {
    this.showNewUser = val;
  }

  toggleShowNewUser() {
    this.showNewUser = !this.showNewUser;
  }

  getShowNewUser() {
    return this.showNewUser;
  }

  updateshowNewUserEvent(data) {
    this.showNewUser = data;
  }

  settab(tid) {
    // this._userService.tabEditCurrent = tid;
    //this.clicked = tid;
    var tabfield = document.getElementsByClassName('tabfield ');
    for (var i = 0; i < tabfield.length; i++) {
      tabfield[i].classList.add('hidden');
    }
    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('active');
    myButtonClasses.remove('hidden');
    document.getElementById(tid).classList.remove('hidden');
    // this._userService.resetDynamicTabs();
  }

  saved(users: any) {
    this.userEdit = Object.assign({}, users.original);
    const i = this._userService.users.indexOf(users.original);
    this._userService.users[i] = users.original;
  }

  edit(user: User) {
    Object.assign(this.userEdit, user);
  }

  create(user: User) {
    this._userService.create(user).subscribe((status) => this.getUsers());
    this._userService.users.push(user);
  }

  destroy(user: User) {
    this._userService.destroy(user).subscribe((status) => this.getUsers());
    this.showEditUser = false;
  }

  update(user: any) {
    if (user.edited != '') {
      console.log(user.edited);
      this._userService
        .update(user.edited)
        .subscribe((status) => this.getUsers());
    } else {
      this.create(user);
    } //this.getUserById(user.edited);
  }

  hideEditUser() {
    this.showEditUser = false;
  }

  userPasswordSet() {
    for (var i = 0; i < this._userService.users.length; i++) {
      if (this._userService.users[i]._id === this.userEdit._id) {
        console.log('Found: ' + this._userService.users[i].password);
        this.userEdit.password = this._userService.users[i].password;
        //break loop;
      }
    }
  }

  getUser() {
    this._userService
      .getUser(this.userEdit)
      .subscribe((user) => (this.userEdit = user));
  }

  getUserById(user: any) {
    this._userService
      .getUser(user)
      .subscribe((users) => (this._userService.users = users));
  }

  updatez(users: any) {
    const i = this._userService.users.indexOf(users.original);
    this._userService.users[i] = users.edited;
  }

  getUsers() {
    this._userService
      .getUsers()
      .subscribe((users) => this._userService.setUsers(users));
  }

  changeParentValue() {
    this.hello = 'clicked from user.component';
  }
}
