import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { User } from './../user';
import { Location } from '@angular/common';

@Component({
    selector: 'app-userstab',
    templateUrl: './user-tabs.component.html',
    styleUrls: ['./user-tabs.component.css']
})

export class UserTabsComponent implements OnInit {
    
    constructor(
        public _userService: UserService,
        public _cmsService: CmsService) {
        this._userService.userSelectedUpdated.subscribe(
          (userSelected: User) => this.geenIdee());
    }

    geenIdee() {
      //this.createForm();
    }

    ngOnInit() {  }

    settab(tid) {
        this._cmsService.tabEditCurrent = tid;
        //this.clicked = tid;
        var tabfield = document.getElementsByClassName('tabfield ');
        for (var i = 0; i < tabfield.length; i++) {
            tabfield[i].classList.add('hidden');
        }
        var myButtonClasses = document.getElementById(tid).classList;
        myButtonClasses.add('active');
        myButtonClasses.remove('hidden');
        document.getElementById(tid).classList.remove('hidden');
        //this._cmsService.resetDynamicTabs();
    }

}
