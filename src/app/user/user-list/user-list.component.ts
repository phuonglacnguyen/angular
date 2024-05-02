import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
//import { MessageService } from '../../services/message.service.old';
import { Address } from './../user';
import { User } from './../../../models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { menusListImage } from './../../menus/list-image/list-image.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  newPage: User = new User();
  public goodbye = 'goodbye';

  //@Input() myAweSomeVallue;
  @Input() uplistClick;
  @Input() showEditUserz;
  //@Input() zhowNewUser;
  //@Input() user_selected_l;

  @Output() sshowNewUserEvent = new EventEmitter();
  @Output() sshowEditUserEvent = new EventEmitter();
  @Output() destroyUserEvent = new EventEmitter();
  @Output() updateUserEventt = new EventEmitter();
  @Output() editUserEvent = new EventEmitter();
  @Output() event = new EventEmitter();

  public darling = 'darling';

  constructor(
    public _userService: UserService,
    //private _messageService: MessageService,
    private _cmsService: CmsService
  ) {
    //this._userService.userSelectedUpdated.subscribe(
    //    (userSelected: User) => this.geenIdee());
  }

  geenIdee() {}

  ngOnInit() {
    //console.log('ngOnInit');
  }

  destroy(user: User) {
    this.destroyUserEvent.emit(user);
  }

  update(user) {
    this.updateUserEventt.emit(user);
  }

  setActiveRow(cid) {
    alert(cid);
    this._userService.setUserSelected(cid);
  }

  toggle_new_user() {
    if (this._userService.getUserLoggedIn() == false) {
      //this._messageService.SetAlertWarning('Please log in');
    } else {
      //this._messageService.SetAlertWarning('Create new user ');
      this.showEditUserz = true;
      this._userService.userSelected = new User();
      //document.getElementById('div_edit_page').style.display = 'block';
      this._userService.userSelectedUpdated.emit(
        this._userService.userSelected
      );

      //if (this._userService.getUserLoggedIn() == true)
      //  this.newPage.dateCreated = this._userService.user_current._id;

      //console.log(this.newPage);

      //this._cmsService.getParentSelected(this.newPage.parent)
      //  .then(parent => this.readyPro(this.newPage, parent));
    }
  }

  readyPro(page, parent) {
    //this._cmsService.pageredd(page, parent);
    //this.editPageEvent.emit(page);
  }

  user_edit(user) {
    this.showEditUserz = true;
    //this.zhowNewUser = false;

    //this._userService.userSelected = user;
    this._userService.setUserSelected(user);
    this._userService.userSelectedUpdated.emit(user);

    if (document.getElementById('userImage'))
      document.getElementById('userImage').setAttribute('src', '');
    //this._userService.usersListUpdated.emit(user);
    //this.editUserEvent.emit(user);

    //console.log('blaat?');
  }

  sendParentValue() {
    //this.myAweSomeVallue = 'clicked from user-list.component';
    //this.event.emit(this.myAweSomeVallue);
  }
}
