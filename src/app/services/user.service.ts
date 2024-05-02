//import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Address, Page } from './../user/user';
import { User } from './../../models/user';
import { Injectable, EventEmitter } from '@angular/core';
import { Media } from './../../models/media';
//import { Observable } from "rxjs";
import 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
//import { MessageService } from './message.service';
import { environment } from './../../environments/environment';

@Injectable()
export class UserService {
  public isUserLoggedIn;
  _baseURL: string = '/api/';
  users: Array<User> = [];
  userSelected: User = new User();
  public user_current: any;
  NewMediaId: any;
  userLevel: any;
  userSelectedUpdated = new EventEmitter<User>();
  usersListUpdated = new EventEmitter<Array<User>>();
  userSelectedEditable = false;
  tabEditCurrent: any;
  songsOriginal: any;
  filesToUpload: Array<File> = [];

  constructor(private http: HttpClient, private _http: HttpClient) {
    this.isUserLoggedIn = false;
  }

  moveoriginal(media: string) {
    return this._http
      .put('/api/moveoriginal', media)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  setUserSelected(user: User) {
    this.userSelected = user;
  }

  setUsers(users: any) {
    this.users = users;
  }

  mediaInfoRead(file: String) {
    return this.http
      .put(this._baseURL + 'mediaInfoRead', file)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  unsetUserLoggedIn() {
    this.isUserLoggedIn = false;
  }

  setUserLoggedIn() {
    this.isUserLoggedIn = true;
  }

  getUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  login(user: User) {
    //console.log(user);
    return this.http
      .post(environment.API_URL + '/api/login', user)
      .pipe(tap((res) => this.loginReady(res)));
  }

  loginReady(user) {
    this.user_current = user;
    this.setUserLoggedIn();
  }

  getEmployees(): Observable<any> {
    return this.http
      .get<any>(environment.API_URL + '/api/pages/5a111233aaa94d061a93e719')
      .pipe(retry(1), catchError(this.handleError));
  }

  getHeroes(): Observable<Page[]> {
    return this.http
      .get<Page[]>(environment.API_URL + '/api/pages/5a111233aaa94d061a93e719')
      .pipe(tap((_) => this.log('fetched heroes')));
  }

  setCurrentUser(data: String) {
    this.user_current = data;
  }

  create(user: User) {
    return this._http
      .post(environment.API_URL + '/api/users', user)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  destroy(user: User) {
    return this._http
      .delete(environment.API_URL + '/api/users/' + user._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  update(user: User) {
    return this._http
      .put(environment.API_URL + '/api/users/' + user._id, user)
      .pipe();
  }

  user_update(user: User) {
    return this._http
      .put(environment.API_URL + '/api/user_update/' + user._id, user)
      .pipe();
  }

  saveuser(user: User) {
    return this._http
      .post(environment.API_URL + '/api/userupdate/' + user._id, user)
      .pipe();
  }

  getUsers() {
    return this._http.get<Array<User>>(environment.API_URL + '/api/users');
  }

  getUser(user: User) {
    //return this.http.get<User[]>(`/api/users/`+ user._id);
    return this._http
      .get(environment.API_URL + '/api/users/' + user._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  filedelete(fname: any) {
    return this._http
      .delete(environment.API_URL + '/api/filedelete/' + this.userSelected._id)
      .pipe();
  }

  dirScanMedia(id: any) {
    return this._http
      .get(environment.API_URL + '/api/dirscan/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  upload(files: any) {
    let headers = new Headers();
    return this._http.put(
      environment.API_URL +
        this._baseURL +
        'uploadUser/' +
        this.userSelected._id,
      files
    );
  }

  userimage(fileToUpload: any, user: User) {
    let input = new FormData();
    input.append('file', fileToUpload);
    return this._http
      .get(environment.API_URL + '/api/filecheck_users' + user._id)
      .pipe();
  }

  update_edit_image_fields(page: any) {
    //console.log('check image man...');
    var tabrowl = document.getElementsByClassName('contentFileUpload');
    //var pagen = page._id;
    for (var i = 0; i < tabrowl.length; i++) {
      var tit = tabrowl[i].getAttribute('title');
      var pname = tabrowl[i].getAttribute('id');
      var id = tabrowl[i].getAttribute('data-dir');
      //console.log('update_edit_image_fields'+pname);
      this.testMet(tit, pname, page._id);
    }
  }

  testMet(fileN: String, inputId: String, id: String) {
    if (fileN != null && id != '') {
      this.checkAssetFile('main', inputId, id);
    }
  }

  testMeReady(res, fileN, inputId, id) {
    //console.log('/api/assetfile/' + res + '/' + fileN + ' - ' + inputId);
    var document: Document;
    if (res == 'no') {
      //  console.log('no?');
      if (document.getElementById('content_filetypeiuser'))
        document.getElementById('content_filetypeiuser').innerHTML = '';
      if (document.getElementById('delete_user'))
        document.getElementById('delete_user').classList.add('hidden');

      if (document.getElementById(inputId))
        document.getElementById(inputId).classList.remove('hidden');
      if (document.getElementById('filetypeiuser'))
        document.getElementById('filetypeiuser').classList.add('hidden');

      //document.getElementById('filetypei' + inputId).classList.add('hidden');
      var tabrowl = document.getElementsByClassName('contentthumbbutton');
      for (var i = 0; i < tabrowl.length; i++) {
        tabrowl[i].classList.remove('hidden');
      }
    } else {
      //console.log(id + '/main' + '.' + res + ' yes?');
      ///console.log(inputId);
      ///document.getElementById(inputId).classList.add('hidden');
      //document.getElementById('button_user').classList.add('hidden');
      ///document.getElementById('filetypeiuser').classList.remove('hidden');
      var file = '/api/assets/users/' + id + '/' + fileN + '.' + res;
      if (res == 'mp4') {
        document.getElementById('content_filetypeiuser').innerHTML =
          `<video width="100%" controls><source src = "/api/assets/content/` +
          id +
          `/` +
          fileN +
          `.` +
          res +
          `" type = "video/mp4" ></video>`;
      } else if (res == 'jpg' || res == 'gif' || res == 'png') {
        // document.getElementById('content_filetypeiuser').innerHTML = '<img src="/api/assets/users/' + id + '" alt="" class="contentthumb" id="userImage" />';
        document
          .getElementById('userImage')
          .setAttribute('src', '/api/assets/users/' + id + '/main.jpg');
      } else {
        //document.getElementById('content_filetypeiuser').innerHTML = '<a href="/api/assets/users/' + id + '/' + fileN + '.' + res + '">Open ' + fileN + '.' + res + '</a>' ; // <img class="float_r" src="/api/images/filetypeicons/' + res + '.png" alt="thumb" />
      }
      //var tabrowl = document.getElementsByClassName('contentthumbbutton');
      //for (var i = 0; i < tabrowl.length; i++) {
      //  tabrowl[i].classList.remove('hidden');
      //}
    }
  }

  userImageFile(res, id) {
    document
      .getElementById('userImage')
      .setAttribute('src', '/api/assets/users/' + id + '/main.' + res);
    document.getElementById('filetypeiuser').classList.remove('hidden');
  }

  checkAssetFile(fileN: String, fileId: any, id: any) {
    //console.log('/api/assetfile/' + id + '/' + fileN);
    return this._http
      .get(environment.API_URL + '/api/assetusers/' + id + '/' + fileN)
      .subscribe((res) => this.userImageFile(res, id));
  }

  userfacerec(id: any) {
    //console.log('/api/assetfile/' + id + '/' + fileN);
    return this._http
      .get(environment.API_URL + '/api/userfacerec/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
    console.log(message);
  }

  private handleError(error: any) {
    console.log(error);
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
