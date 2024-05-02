import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { UserService } from './../../services/user.service';
import { User } from './../../../models/user';
//import { Http, Headers, URLSearchParams } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from "rxjs";
import "rxjs";
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
    users: Array<User> = [

    ];
    public user: User = new User();

    constructor(public _userService: UserService, private router: Router) { }

    public is_logged_in = this._userService.getUserLoggedIn();

    ngOnInit() {

    }

    user_login_form() {
        console.log('he?');
        //this._userService.login(this.user);
        this.getLogin(this.user);
    }

    deluserlogin(data) { 
        
        if (data != false) {
            this._userService.setUserLoggedIn();
            this.user = Object.assign({}, data);
            this._userService.setCurrentUser(data);
        } else {
            this._userService.unsetUserLoggedIn();
        }
        
    }

    getLogin(args: User) {
        //console.log('He?');
        this._userService.login(args) 
            .subscribe(user => this.deluserlogin(user));
           
    }
   

}
