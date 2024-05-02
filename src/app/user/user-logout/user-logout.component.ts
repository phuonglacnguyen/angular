import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { User } from './../user';
import { Router } from "@angular/router";

@Component({
    selector: 'app-user-logout',
    templateUrl: './user-logout.component.html',
    styleUrls: ['./user-logout.component.css']
})

export class UserLogoutComponent implements OnInit {
    users: Array<User> = [

    ];
    public user: User = new User();

    constructor(public _userService: UserService, private router: Router) { }

    public is_logged_in = this._userService.getUserLoggedIn();

    ngOnInit() {
        this._userService.unsetUserLoggedIn();
        delete (this._userService.user_current);
        this.router.navigate(['/login']);
    }
  

}
