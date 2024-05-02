import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  Directive,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Address, MediaImage } from './../user';
import { User } from './../../../models/user';
import { Treeid } from './../../../models/treeid';
import { DatePipe } from '@angular/common';
import {
  FormGroupName,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  EmailValidator,
  AbstractControl,
} from '@angular/forms';
//import { ValidationService } from './../../validation.service';
//import { ControlMessagesComponent } from './../../control-messages.component';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { FileUploadModule } from 'ng2-file-upload';
import {
  FileSelectDirective,
  FileDropDirective,
  FileUploader,
} from 'ng2-file-upload/ng2-file-upload';
//import { Http, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
//import { bcrypt } from 'bcrypt';
import { MessageService } from '../../services/message.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  users: Array<User> = [];
  @Output() updateUserEvent = new EventEmitter();
  @Output() updateNewUserEvent = new EventEmitter();
  @Output() hideEditUserEvent = new EventEmitter();
  @Output() resszeEditUserEvent = new EventEmitter();

  @Output() destroyUserEvent = new EventEmitter();
  @Input() zzhowNewUser;
  @Input() user;
  @Input() create_user_form_val;
  @ViewChild('fileInput') fileInput; // , { static: true}
  @ViewChild('ngForm') ngForm; // , { static: true}

  public mediaPath;
  public mediaTitle;
  public lastModified;
  public mediaType;
  public mediaExtension;
  public imageCreated;
  public mediaWidth;
  public mediaHeight;
  public mediaFilesize;
  public icreated: Date = new Date();

  addressez = [];
  favoritez = [];
  urlHistoryz = [];
  moviez = [];
  songz = [];
  musicAlbumz = [];

  public mwidth;
  public mheight;
  public mpath;
  public mlmod;
  public mtype;
  public mext;
  public mfsize;
  public mdmod;

  //public yForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes
  public userImage = false;
  public userForm: FormGroup;

  //form: FormGroup;
  objectProps;
  dataObject;
  filesToUpload: Array<File> = [];

  //get first_name() { return this.userForm.get('first_name'); }
  // get last_name() { return this.userForm.get('last_name'); }
  //get password() { return this.userForm.get('password'); }

  get secretLairs(): FormArray {
    return this.userForm.get('secretLairs') as FormArray;
  }
  get secretImages(): FormArray {
    return this.userForm.get('secretImages') as FormArray;
  }
  get secretFavorites(): FormArray {
    return this.userForm.get('secretFavorites') as FormArray;
  }
  get secretUrlHistory(): FormArray {
    return this.userForm.get('secretUrlHistory') as FormArray;
  }
  get secretMovies(): FormArray {
    return this.userForm.get('secretMovies') as FormArray;
  }
  get secretSongs(): FormArray {
    return this.userForm.get('secretSongs') as FormArray;
  }
  get secretmusicAlbums(): FormArray {
    return this.userForm.get('secretmusicAlbums') as FormArray;
  }
  constructor(
    public fb: FormBuilder,
    public _userService: UserService,
    private _messageService: MessageService,
    private _http: HttpClientModule,
    private _cmsService: CmsService
  ) {
    this._userService.userSelectedUpdated.subscribe((userSelected: User) =>
      this.geenIdee()
    );

    // this.createForm();
    // this.logNameChange();
  }

  public clicked = 'tab_1';
  public cdate = new Date();

  ngOnInit() {
    //this.autoCreateInputs();
  }

  async faceR() {
    //console.log(faceapi.nets);

    // if you haven't already, install the SDK with "npm install sightengine --save"

    //await faceDetectionNet.loadFromDisk('./../weights')
    //await faceapi.nets.ssdMobilenetv1.loadFromDisk('./../../face-api/weights')
    //await faceDetectionNet.loadFromDisk('./../../face-api/weights');
    //const img = await canvas.loadImage('http://10.0.0.128:1337/api/assets/users/59ff9caa3e1ded32d4f184df/main.jpg');
    //const img = await canvas.loadImage('./../../../../../assets/users/59ff9caa3e1ded32d4f184df/main.jpg');
    //const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
    //    .withFaceLandmarks()

    //const detections = await faceapi.detectAllFaces(img, faceDetectionOptions);

    //const detections = await faceapi.detectAllFaces(<HTMLCanvasElement>input);
    this._userService
      .userfacerec(this._userService.userSelected._id)
      .subscribe((res) => this.faceReady(res));
  }

  faceReady(res) {
    console.log(res);
    (<HTMLInputElement>document.getElementById('faceCoords')).value = res;
  }

  geenIdee() {
    this.createForm();
    //this.addressez = this._userService.userSelected.addresses;
    //this.setAddresses(this.addressez);
    //if(this._userService.userSelected.favorites != undefined) {
    //  this.favoritez = this._userService.userSelected.favorites;
    //    this.setFavorites(this.favoritez);
    //}
  }

  closeMessageAlert() {
    document.getElementById('messagesAlert').classList.add('hidden');
  }

  set_user() {
    this._userService.userSelected = this.prepareSaveUser();
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }

    return formValidators;
  }

  createForm() {
    this.userForm = this.fb.group({
      _id: new FormControl(this._userService.userSelected._id, [
        Validators.required,
      ]),
      first_name: new FormControl(this._userService.userSelected.first_name, [
        Validators.required,
        Validators.minLength(2),
      ]),
      last_name: new FormControl(this._userService.userSelected.last_name, [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(this._userService.userSelected.email, [
        Validators.required,
        Validators.email,
      ]),
      telephone: new FormControl(
        this._userService.userSelected.telephone as string,
        [Validators.required, Validators.minLength(10)]
      ),
      secretLairs: this.fb.array([]),
      secretImages: this.fb.array([]),
      secretFavorites: this.fb.array([]),
      secretUrlHistory: this.fb.array([]),
      secretMovies: this.fb.array([]),
      secretSongs: this.fb.array([]),
      secretmusicAlbums: this.fb.array([]),
      password: new FormControl(this._userService.userSelected.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(60),
      ]),
      dateCreated: new FormControl(this._userService.userSelected.dateCreated),
      editable: new FormControl(this._userService.userSelected.editable),
      active: new FormControl(this._userService.userSelected.active),
      userRole: new FormControl(this._userService.userSelected.userRole, [
        Validators.required,
      ]),
      logins: new FormControl(this._userService.userSelected.logins),
      dateLast: new FormControl(this._userService.userSelected.dateLast),
      oldPassword: new FormControl(this._userService.userSelected.password),
      faceCoords: new FormControl(this._userService.userSelected.faceCoords),
      gender: new FormControl(this._userService.userSelected.gender),
    });

    // var asdf = this._userService;
    // setTimeout(function () {
    //   asdf.update_edit_image_fields(asdf.userSelected);
    // }, 500);
    if (this._userService.userSelected) {
      if (this._userService.userSelected.favorites != undefined) {
        this.favoritez = this._userService.userSelected.favorites;
        this.setFavorites(this.favoritez);
      }

      if (this._userService.userSelected.urlHistory != undefined) {
        this.urlHistoryz = this._userService.userSelected.urlHistory;
        this.setUrlHistory(this.urlHistoryz);
      }

      if (this._userService.userSelected.movies != undefined) {
        this.moviez = this._userService.userSelected.movies;
        this.setMovies(this.moviez);
      }

      if (this._userService.userSelected.songs != undefined) {
        this.songz = this._userService.userSelected.songs;
        this.setSongs(this.songz);
      }

      if (this._userService.userSelected.musicAlbum != undefined) {
        this.musicAlbumz = this._userService.userSelected.musicAlbum;
        this.setMusicAlbum(this.musicAlbumz);
      }
    }

    //console.log('hello?');
    //console.log(this.user_selected_e.images);
  }
  createForm2() {
    this.userForm = this.fb.group({
      _id: new FormControl(this._userService.userSelected._id, [
        Validators.required,
      ]),
      last_name: new FormControl(this._userService.userSelected.last_name, [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl(this._userService.userSelected.email, [
        Validators.required,
        Validators.email,
      ]),
      telephone: new FormControl(
        this._userService.userSelected.telephone as string,
        [Validators.required, Validators.minLength(10)]
      ),
      secretLairs: this.fb.array([]),
      secretImages: this.fb.array([]),
      secretFavorites: this.fb.array([]),
      secretUrlHistory: this.fb.array([]),
      secretMovies: this.fb.array([]),
      secretSongs: this.fb.array([]),
      secretmusicAlbums: this.fb.array([]),
      password: new FormControl(this._userService.userSelected.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(60),
      ]),
      dateCreated: new FormControl(this._userService.userSelected.dateCreated),
      editable: new FormControl(this._userService.userSelected.editable),
      active: new FormControl(this._userService.userSelected.active),
      userRole: new FormControl(this._userService.userSelected.userRole, [
        Validators.required,
      ]),
      logins: new FormControl(this._userService.userSelected.logins),
      dateLast: new FormControl(this._userService.userSelected.dateLast),
      oldPassword: new FormControl(this._userService.userSelected.password),
      faceCoords: new FormControl(this._userService.userSelected.faceCoords),
      gender: new FormControl(this._userService.userSelected.gender),
    });
    //console.log(this.user_selected_e.images);
  }

  imageReset() {
    //document.getElementById('userImageContents').innerHTML = '<img src="" alt="" id="userImage" /><div id="TheImageContents"></div>';
  }

  ngOnChanges() {
    //this.imageReset();
    this.createForm();

    //this.addressez = this._userService.userSelected.addresses;
    //this.setAddresses(this.addressez);
  }

  setFavorites(favorites: Treeid[]) {
    const favoritesFGs = favorites.map((favorites) => this.fb.group(favorites));
    const favoritesFormArray = this.fb.array(favoritesFGs);
    this.userForm.setControl('secretFavorites', favoritesFormArray);
  }

  setMovies(movies: Treeid[]) {
    const favoritesFGs = movies.map((movies) => this.fb.group(movies));
    const favoritesFormArray = this.fb.array(favoritesFGs);
    this.userForm.setControl('secretMovies', favoritesFormArray);
  }

  setSongs(songs: Treeid[]) {
    const songsFGs = songs.map((songs) => this.fb.group(songs));
    const songsFormArray = this.fb.array(songsFGs);
    this.userForm.setControl('secretSongs', songsFormArray);
  }

  setUrlHistory(urlHistory: Treeid[]) {
    //console.log(urlHistory);
    const urlHistoryFGs = urlHistory.map((urlHistory) =>
      this.fb.group(urlHistory)
    );
    const urlHistoryFormArray = this.fb.array(urlHistoryFGs);
    this.userForm.setControl('secretUrlHistory', urlHistoryFormArray);
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map((addresses) => this.fb.group(addresses));
    const addressFormArray = this.fb.array(addressFGs);
    this.userForm.setControl('secretLairs', addressFormArray);
  }

  setImages(images: MediaImage[]) {
    const imagesFGs = images.map((image) => this.fb.group(image));
    const imagesFormArray = this.fb.array(imagesFGs);
    this.userForm.setControl('secretImages', imagesFormArray);
  }

  setMusicAlbum(songs: Treeid[]) {
    const imagesFGs = songs.map((songs) => this.fb.group(songs));
    const imagesFormArray = this.fb.array(imagesFGs);
    this.userForm.setControl('secretmusicAlbums', imagesFormArray);
  }

  toggle_div(counter) {
    console.log(this.secretImages.at(counter).get('text_small'));
  }

  addLair() {
    //document.getElementById('addAddress').setAttribute('class', 'hidden');
    //document.getElementById('saveAddress').setAttribute('class', 'btn btn-primary');
    //document.getElementById('cancelAddress').setAttribute('class', 'btn btn-primary');
    // this.secretLairs.push(this.fb.group(new Address()));

    this.secretLairs.push(this.fb.group(new Address()));
    /*
      this.secretLairs.push(this.fb.group( {
          street: new FormControl('', [Validators.required, Validators.minLength(2)]),
          city: new FormControl('', [Validators.required, Validators.minLength(2)]),
          state: new FormControl('', [Validators.required, Validators.minLength(2)]),
          zip: new FormControl('', [Validators.required, Validators.minLength(2)]),
          country: new FormControl('', [Validators.required])

          //city: this._userService.userSelected.city as string,
          //state: this._userService.userSelected.state as string,
          //zip: this._userService.userSelected.zip as string,
         // country: this._userService.userSelected.country as string
         // addressCreated: this._userService.userSelected.addressCreated as Date
      } ));
      */
  }

  addFavorite() {
    //document.getElementById('addAddress').setAttribute('class', 'hidden');
    //document.getElementById('saveAddress').setAttribute('class', 'btn btn-primary');
    //document.getElementById('cancelAddress').setAttribute('class', 'btn btn-primary');
    // this.secretLairs.push(this.fb.group(new Address()));

    this.secretFavorites.push(this.fb.group(new Treeid()));
  }

  addMovies() {
    this.secretMovies.push(this.fb.group(new Treeid()));
  }

  addSongs() {
    this.secretSongs.push(this.fb.group(new Treeid()));
  }
  addMusicAlbum() {
    this.secretmusicAlbums.push(this.fb.group(new Treeid()));
  }
  addUrlHistory() {
    this.secretUrlHistory.push(this.fb.group(new Treeid()));
  }

  addImage() {
    this.secretImages.push(this.fb.group(new MediaImage()));
    document.getElementById('addImageButton').className = 'no_display';
    document.getElementById('cancelImageButton').className = 'btn btn-primary';
  }

  onSubmit() {
    const formModel = this.userForm.value;
    //console.log(this.userForm.value);
    let fi = this.fileInput.nativeElement;
    if (fi.files[0]) {
      this._userService.userimage(fi.files[0], this._userService.userSelected);
      // .then(data => this.fileUploadResult(data));
    }

    var oldPassword = this._userService.userSelected.password;
    var dateLastFix = this._userService.userSelected.dateLast
      .toString()
      .substring(0, 16);
    console.log(dateLastFix);

    this._userService.userSelected = this.prepareSaveUser();
    if (this._userService.userSelected._id != '') {
      this.updateUserEvent.emit({
        original: this.user,
        edited: this._userService.userSelected,
      });
      //console.log('update');
    } else {
      //console.log('insert');
      this.create(this._userService.userSelected);
    }
    // console.log('old pwd: ' + oldPassword);
    if (oldPassword != this._userService.userSelected.password) {
      this.resszeEditUserEvent.emit(1);
    }
    //console.log(this._userService.users.indexOf[this._userService.userSelected._id] + ' ? ');

    this.ngOnChanges();
    this._messageService.SetAlertInfo('User saved succesfully');
  }

  create(user: User) {
    this._userService.create(user).subscribe((status) => this.getUsers());
    this._userService.users.push(user);
  }

  getUsers() {
    this._userService
      .getUsers()
      .subscribe((users) => this._userService.setUsers(users));
  }

  getUser() {
    this._userService
      .getUser(this._userService.userSelected)
      .subscribe((user) => (this._userService.userSelected = this.user));
    console.log(this.user);
  }

  passgender(name, vale) {
    const formModel = this.userForm.value;
    formModel.editable = vale;
    (<HTMLInputElement>document.getElementById(name)).value = vale;
  }

  prepareSaveUser(): User {
    const formModel = this.userForm.value;
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );
    const secretImagesDeepCopy: MediaImage[] = formModel.secretImages.map(
      (image: MediaImage) => Object.assign({}, image)
    );
    const secretFavoritesDeepCopy: Treeid[] = formModel.secretFavorites.map(
      (treeid: Treeid) => Object.assign({}, treeid)
    );
    const secretUrlHistoryDeepCopy: Treeid[] = formModel.secretUrlHistory.map(
      (treeid: Treeid) => Object.assign({}, treeid)
    );
    const secretMoviesDeepCopy: Treeid[] = formModel.secretMovies.map(
      (treeid: Treeid) => Object.assign({}, treeid)
    );
    const secretSongsDeepCopy: Treeid[] = formModel.secretSongs.map(
      (treeid: Treeid) => Object.assign({}, treeid)
    );
    const secretAlbumsDeepCopy: Treeid[] = formModel.secretmusicAlbums.map(
      (treeid: Treeid) => Object.assign({}, treeid)
    );
    //const myDate = new Date();
    const saveUser: User = {
      _id: formModel._id as string,
      first_name: formModel.first_name as string,
      last_name: formModel.last_name as string,
      gender: formModel.gender as string,
      email: formModel.email as string,
      telephone: formModel.telephone as string,
      password: formModel.password as string,
      dateCreated: this._userService.userSelected.dateCreated as Date,
      editable: formModel.editable as boolean,
      userRole: formModel.userRole as string,
      active: formModel.active as boolean,
      logins: this._userService.userSelected.logins as number,
      dateLast: new Date() as Date,
      addresses: secretLairsDeepCopy,
      images: secretImagesDeepCopy,
      favorites: secretFavoritesDeepCopy,
      faceCoords: formModel.faceCoords as string,
      urlHistory: secretUrlHistoryDeepCopy,
      movies: secretMoviesDeepCopy,
      songs: secretSongsDeepCopy,
      musicAlbum: secretAlbumsDeepCopy,
      songs_tmp: secretSongsDeepCopy,
      musicAlbum_tmp: secretAlbumsDeepCopy,
      songs_original: secretSongsDeepCopy,
    };
    //saveUser.oldPassword = formModel.oldPassword;
    // console.log(formModel);
    return saveUser;
  }

  //revert() { this.ngOnChanges(); }

  save(model: User, isValid: boolean) {
    this.submitted = true;
    this._userService.userSelected = Object.assign({}, model);
    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
  }

  destroy() {
    var confirmText = 'Are you sure you want to delete this User?';
    if (confirm(confirmText)) {
      this.destroyUserEvent.emit(this._userService.userSelected);
    }
  }

  delete_address(index) {
    // document.getElementById('addAddress').setAttribute('class', 'btn btn-primary');
    //document.getElementById('saveAddress').setAttribute('class', 'hidden');
    // document.getElementById('cancelAddress').setAttribute('class', 'hidden');

    this.secretLairs.controls.splice(index, 1);
    delete this._userService.userSelected.addresses[index];
    this._userService.userSelected.addresses.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  delete_favorite(index) {
    this.secretFavorites.controls.splice(index, 1);
    delete this._userService.userSelected.favorites[index];
    this._userService.userSelected.favorites.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  delete_movies(index) {
    this.secretMovies.controls.splice(index, 1);
    delete this._userService.userSelected.movies[index];
    this._userService.userSelected.movies.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  delete_songs(index) {
    this.secretSongs.controls.splice(index, 1);
    delete this._userService.userSelected.songs[index];
    this._userService.userSelected.songs.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  delete_musicalbum(index) {
    this.secretmusicAlbums.controls.splice(index, 1);
    delete this._userService.userSelected.musicAlbum[index];
    this._userService.userSelected.musicAlbum.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  delete_UrlHistory(index) {
    this.secretUrlHistory.controls.splice(index, 1);
    delete this._userService.userSelected.urlHistory[index];
    this._userService.userSelected.urlHistory.splice(index, 1);

    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
  }

  userImageDeleteRes(data, index) {
    this.updateUserEvent.emit({
      original: this.user,
      edited: this._userService.userSelected,
    });
    this.ngOnChanges();
    // document.getElementById('addAddress').setAttribute('class', 'btn btn-primary');
    //document.getElementById('saveAddress').setAttribute('class', 'hidden');
    // document.getElementById('cancelAddress').setAttribute('class', 'hidden');
  }

  delete_mediaimage(index) {
    var confirmText =
      'Are you sure you want to delete ' +
      this._userService.userSelected.images[index].mediaTitle +
      ' media ?';
    if (confirm(confirmText)) {
      this.secretImages.controls.splice(index, 1);
      //delete this._userService.userSelected.images[index];
      var fname =
        this._userService.userSelected.images[index].mediaTitle +
        '.' +
        this._userService.userSelected.images[index].mediaExtension;
      this._userService.userSelected.images.splice(index, 1);
      this.updateUserEvent.emit({
        original: this.user,
        edited: this._userService.userSelected,
      });
      this.ngOnChanges();
      //this.imageReset();
      console.log(this._userService.userSelected);
      //this._userService.filedelete(fname)
      //    .then(data => this.userImageDeleteRes(data, index));
    }
  }

  showPassword() {
    document.getElementById('resetPassword').setAttribute('class', 'row');
  }

  settab(tabt, tid) {
    this.clicked = tid;
    document.getElementById('tab_1').className = 'hidden';
    //document.getElementById('tab_2').className = 'hidden';
    //document.getElementById('tab_3').className = 'hidden';
    document.getElementById('tab_4').className = 'hidden';
    //document.getElementById('tab_5').className = 'hidden';

    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('active');
    myButtonClasses.remove('hidden');
  }

  close_user_edit() {
    this.zzhowNewUser = false;
    this.updateNewUserEvent.emit(this.zzhowNewUser);
  }

  cancel_addAddress() {
    //document.getElementById('addAddress').setAttribute('class', 'icon icmn-home7');
    //document.getElementById('saveAddress').setAttribute('class', 'hidden');
    //document.getElementById('cancelAddress').setAttribute('class', 'hidden');
    var counter = this.secretLairs.length - 1;
    this.secretLairs.controls.splice(counter, 1);
    delete this._userService.userSelected.addresses[counter];
    this._userService.userSelected.addresses.splice(counter, 1);
  }

  cancel_addUrlHistory() {
    //document.getElementById('addAddress').setAttribute('class', 'icon icmn-home7');
    //document.getElementById('saveAddress').setAttribute('class', 'hidden');
    //document.getElementById('cancelAddress').setAttribute('class', 'hidden');
    var counter = this.secretUrlHistory.length - 1;
    this.secretUrlHistory.controls.splice(counter, 1);
    delete this._userService.userSelected.urlHistory[counter];
    this._userService.userSelected.urlHistory.splice(counter, 1);
  }

  cancel_addFavorites() {
    var counter = this.secretLairs.length - 1;
    this.secretFavorites.controls.splice(counter, 1);
    delete this._userService.userSelected.addresses[counter];
    this._userService.userSelected.addresses.splice(counter, 1);
  }

  cancel_addSongs() {
    var counter = this.secretSongs.length - 1;
    this.secretSongs.controls.splice(counter, 1);
    //delete this._userService.userSelected.songs[counter];
    //this._userService.userSelected.songs.splice(counter, 1);
  }

  cancel_musicalbum() {
    var counter = this.secretmusicAlbums.length - 1;
    this.secretmusicAlbums.controls.splice(counter, 1);
    //delete this._userService.userSelected.songs[counter];
    //this._userService.userSelected.songs.splice(counter, 1);
  }

  cancel_user_image() {
    // this.fileInput.value = '';
    //  document.getElementById('CancelImageButton').className = 'btn btn-primary';
    var counter = this.secretImages.length - 1;
    this.secretImages.controls.splice(counter, 1);
    delete this._userService.userSelected.images[counter];
    this._userService.userSelected.images.splice(counter, 1);
    // document.getElementById('addImageButton').setAttribute('class', 'hidden');
    //document.getElementById('saveImageButton').setAttribute('class', 'hidden');
    // document.getElementById('cancelImageButton').setAttribute('class', 'hidden');
    this.imageReset();
  }

  detect(URL) {
    var img = new Image();
    img.src = URL;
    document.getElementById('userImage').setAttribute('src', URL);
    //this.uploadImage();

    img.onload = function () {
      var width = img.naturalWidth;
      var height = img.naturalHeight;
      (<HTMLInputElement>document.getElementById('mediaHeight')).title =
        height + '';
      (<HTMLInputElement>document.getElementById('mediaWidth')).title =
        width + '';
    };
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.addImage();
      var counter = this.secretImages.length - 1;
      let fi = this.fileInput.nativeElement;
      var file = fi.files[0];
      var extension = file.name.replace(/^.*\./, '');

      if (
        extension != 'jpg' &&
        extension != 'gif' &&
        extension != 'png' &&
        extension != 'svg'
      ) {
        console.log('Only jpg, gif, svg and png images allowed');
      } else {
        this.detect(window.URL.createObjectURL(file));
        var size = file.size;
        var type = file.type;
        var lastmod = new Date(file.lastModifiedDate).toISOString();
        var fname = file.name.replace(/\.[^/.]+$/, '');

        setTimeout(() => {
          var width = (<HTMLInputElement>document.getElementById('mediaWidth'))
            .title;
          var height = (<HTMLInputElement>(
            document.getElementById('mediaHeight')
          )).title;
          this.test(type, fname, size, lastmod, extension, width, height);
        }, 1000);
        document
          .getElementById('saveImageButton')
          .setAttribute('class', 'btn btn-primary');
        // console.log(this.userForm.controls);
      }
    } else {
      var counter = this.secretImages.length - 1;
      this.delete_mediaimage(counter);
      document
        .getElementById('saveImageButton')
        .setAttribute('class', 'hidden');
      document
        .getElementById('cancelImageButton')
        .setAttribute('class', 'hidden');
      this.imageReset();
    }
  }

  fileUpload() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      if (files[i] != undefined)
        formData.append('uploads[]', files[i], files[i]['name']);
    }

    this._userService
      .upload(formData)
      .subscribe((result) => this.uploadResult(result));

    //document.getElementById(fileId).setAttribute('value' , '');
  }

  uploadResult(result) {
    if (result == true) {
      this._messageService.SetAlertSuccess('File upload succesfully');
      (<HTMLInputElement>document.getElementById('fileInput')).value = '';
      (<HTMLInputElement>document.getElementById('button_image')).classList.add(
        'hidden'
      );
    } else {
      this._messageService.SetAlertWarning('File upload failed');
    }
  }

  filedelete(fname) {
    var result = confirm('Delete user image?');
    if (result) {
      this._userService
        .filedelete(fname)
        .subscribe((res) => this.removeImage(res));
    }
  }

  removeImage(res) {
    document.getElementById('filetypeiuser').classList.add('hidden');
    document.getElementById('userImage').classList.add('hidden');
    this._messageService.SetAlertSuccess('User image deleted');
  }

  fileCheck(fileInput: any) {
    var userImageContents = '';
    var extenid = fileInput.target.id + '_extension';
    var inputId = fileInput.target.id;
    var inputValues = fileInput.target.title;
    //var inputName = this.file;
    //let fi = this.file.nativeElement;
    //document.getElementById('filetypeiuser').classList.add('hidden');
    //document.getElementById('content_filetypeiuser').innerHTML = '';
    //var element = document.getElementsByClassName('fileUpload_' + inputId);
    //for (var x = 0; x < element.length; x++) {
    //let fi = this._elRef.nativeElement;

    if (fileInput.target.files) {
      document.getElementById('button_image').classList.remove('hidden');
      document.getElementById('userImage').classList.add('hidden');
      this.filesToUpload = <Array<File>>fileInput.target.files;
      //console.log(this.filesToUpload);
      if (this.filesToUpload.length > 0) {
        for (let i = 0; i < fileInput.target.files.length; i++) {
          var file = fileInput.target.files[i];
          var url = window.URL.createObjectURL(file);
          var extension = file.name.replace(/^.*\./, '');
          var size = this.humanfilesize(file.size, '', 0);
          var fname = file.name.replace(/\.[^/.]+$/, '');
          //userImageContents = document.getElementById('filetypeiuser').innerHTML;
          //document.getElementById('filetypeiuser').classList.remove('hidden');
          //console.log(extension + ' ??');
          if (extension == 'mp4') {
            var video = document.createElement('video');
            video.src = url;
            video.controls = true;
            video.setAttribute('width', '100%');
            //console.log(url);
            document.getElementById('content_filetypeiuser').appendChild(video);
            document.getElementById('filetypeiuser').classList.remove('hidden');
          } else if (
            extension == 'jpg' ||
            extension == 'gif' ||
            extension == 'png'
          ) {
            var img = new Image();
            img.src = url;
            document.getElementById('content_filetypeiuser').innerHTML +=
              '<div><a class="thumbnail" id="userImage"><img src="' +
              url +
              '" alt="" /></a>';
            //(<HTMLInputElement>document.getElementById(inputId + '_extension')).value = extension;
            var cdiw = document.getElementsByClassName(inputId);
            for (var c = 0; c < cdiw.length; c++) {
              cdiw[c].classList.remove('hidden');
            }
            document.getElementById('filetypeiuser').classList.remove('hidden');
          } else if (
            extension == 'mpg' ||
            extension == 'avi' ||
            extension == 'wmv' ||
            extension == 'mkv'
          ) {
            var cont =
              `<object id="video_mp4" width="100%" height="100%" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" standby="Loading Media Player..."> 
                                        <param name="url" value="` +
              url +
              `"> 
                                        <param name="autoStart" value="true"> 
                                        <param name="uiMode" value="full"> 
                                        <param name="stretchToFit" value="true"> 
                                        <param name="wmode" value="transparent">
                                        <param name="mute" value="true">
                                        <embed wmode="transparent" type="application/x-ms-wmp" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" src="` +
              url +
              `" width="100%" autostart="0" ShowControls="1" DisplaySize="4" ></embed> 
                                        </object>`;
            document.getElementById('filetypeiuser').classList.remove('hidden');
            document.getElementById('content_filetypeiuser').innerHTML = cont;
          } else {
            document.getElementById('filetypeiuser').classList.remove('hidden');
            document.getElementById('content_filetypeiuser').innerHTML =
              '<a class="thumbnail"><img src="/api/images/filetypeicons/' +
              extension +
              '.png" height="48" width="48" alt="" /></a>';
          }
        }
      }
    } else {
      document.getElementById('button_' + inputId).classList.add('hidden');
      var cdiw = document.getElementsByClassName('filetypei');
      for (var c = 0; c < cdiw.length; c++) {
        cdiw[c].classList.add('hidden');
      }
    }
    //}
  }

  humanfilesize(size, unit, decimals) {
    if (size > 1024000000 && decimals > 0)
      return (size / 1024000000).toFixed(decimals) + ' GB';
    if ((!unit && size > 1024000000) || unit == 'GB')
      return (size / 1024000000).toFixed(0) + ' GB';
    if (!unit && size > 1024000 && decimals > 0)
      return (size / 1024000).toFixed(decimals) + ' MB';
    if ((!unit && size > 1024000) || unit == 'MB')
      return (size / 1024000).toFixed(2) + ' MB';
    if ((!unit && size < 1024000) || unit == 'KB')
      return (size / 1024).toFixed(0) + ' KB';
    if ((!unit && size < 1024) || unit == 'B')
      return size.toFixed(0) + ' bytes';
    return size + ' bytes';
  }

  test(type, fname, size, lastmod, extension, width, height) {
    var counter = this.secretImages.length - 1;

    this.secretImages.at(counter).patchValue(
      {
        mediaType: type,
        mediaPath: '/assets/users/' + fname + '.' + extension,
        mediaTitle: fname,
        mediaFilesize: size,
        lastModified: lastmod,
        mediaExtension: extension,
        mediaWidth: width,
        mediaHeight: height,
        imageCreated: this.icreated.toISOString(),
      },
      2000
    );
  }
  /*
  deleteFile(filename, fileid) {
    //console.log('He? ' + fileid);

    var confirmText = "Are you sure you want to delete the user image?";
    if (confirm(confirmText)) {
      document.getElementById('content_filetypeiuser').innerHTML = '';
      document.getElementById('filetypeiuser').classList.add('hidden');
      document.getElementById('saveImageButton').classList.add('hidden');
      document.getElementById('fileInput').classList.remove('hidden');
      //(<HTMLInputElement>document.getElementById(fileid)).value = '';
      let fileId = this._userService.userSelected._id;
      return this._http.get('/api/userimagedelete/' + fileId)
      //.pipe(map(data => data.json())).toPromise();
        .pipe(data => data).toPromise(); 
    }
  }
  */
}
