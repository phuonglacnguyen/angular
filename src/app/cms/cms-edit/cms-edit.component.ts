import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { User, Address, MediaImage, mediaId } from './../../user/user';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Injectable } from '@angular/core';
import 'rxjs';
import { CmsService } from './../../services/cms.service';
import { Page } from './../../../models/page';
import { CmsPipe } from './../../../models/cmspipe';
import { Video } from './../../../models/video';
import { VideoGenre } from './../../../models/videogenre';
import { Media } from './../../../models/media';
import { Treeid } from './../../../models/treeid';
import { StringID } from './../../../models/stringid';
import { Country } from './../../../models/country';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './../../services/message.service';
import { CmsProperty } from './../../../models/property';
import { News } from './../../../models/bots/News';
import { Webpage } from './../../../models/bots/Webpage';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MediaService } from './../../services/media.service';
import { FilterService } from './../../services/filter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cms-edit',
  templateUrl: './cms-edit.component.html',
  styleUrls: ['./cms-edit.component.css'],
})
@Injectable()
export class CmsEditComponent {
  pageedit: Page;
  @Input() parent;
  @Input() createNew;
  @Input() userlogin;
  @ViewChild('values') values; //, { static: true}
  @ViewChild('labels') labels;
  @ViewChild('propertyselect') propertyselect;
  questions: any[];
  filesToUpload: Array<File> = [];
  maxFiles = 10;
  rtf_content;
  selectedOption;
  pagefiles = [];
  public submitted: boolean;
  public events: any[] = [];
  public pageForm: FormGroup;
  public propForm: FormGroup;
  public filterForm: FormGroup;
  progress = 0;
  public clicked = 'tab_1';
  public icreated: Date = new Date();
  rootId = '5a111233aaa94d061a93e719';
  modelTextView: string;
  nameChangeLog: string[] = [];
  patientCategory: FormGroup;
  selected2 = [];
  properties = [];

  @ViewChild('file') file; // , { static: true}

  @Output() updatePageEvent = new EventEmitter();
  @Output() toggleCreateNew = new EventEmitter();
  @Output() destroyPageEvent = new EventEmitter();
  @Output() getMediaSelected = new EventEmitter();

  public mwidth;
  public mheight;
  public mpath;
  public mlmod;
  public mtype;
  public mext;
  public mfsize;
  public mdmod;
  objectProps;
  dataObject;
  addressObject;
  addressez = [];
  moviegenrez = [];
  subtitlez = [];
  photopersonz = [];
  mediaz = [];
  datasObject;
  _hero;
  linesseperateby = 'n';
  insertListVisible = true;
  insertListSecure = false;
  insertListObject;
  multifieldsupload = 0;
  newMedia: any;
  tmparray = '';
  treeId;

  constructor(
    public fb: FormBuilder,
    public _userService: UserService,
    private _http: HttpClient,
    public _cmsService: CmsService,
    public _mediaService: MediaService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    public _messageService: MessageService,
    public _filterService: FilterService
  ) {
    this._cmsService.pageSelectedUpdated.subscribe((pageSelected: Page) =>
      this.ngPageSelected(pageSelected)
    );
    this._cmsService.getModels();
    this.properties = this._cmsService.propertiesFull;
    this.createForm();
    this._cmsService
      .scanbots()
      .subscribe((prop) => (this._cmsService.setbots = prop));
    this.activatedRoute.params.subscribe((params) => {
      if (params['id'] == '5a111233aaa94d061a93e719' && !this.treeId) {
        this.treeId = '5dcac71ab5db6e1f986c5c30';
      } else {
        this.treeId = params['id'];
      }
      this.properties = this._cmsService.propertiesFull;
      // this._cmsService
      //   .getcms(this.treeId)
      //   .subscribe((res) => this.getAlbumReady(res));
    });
    var cmss = this;
    this._userService
      .getUsers()
      .subscribe((res) => (this._userService.users = res));

    setTimeout(function () {
      cmss._cmsService
        .getParentSelected(cmss.treeId)
        .subscribe((result) => cmss.getAlbumReady(result));
      //cmss._cmsService.resetPropFull();
    }, 1000);
  }

  getAlbumReady(res: Page) {
    //console.log(res);
    //this._cmsService.pagetpropertiesFull = [];
    if (res.schemaextend && res.schemaextend[0]?.url)
      res.schemaextend[0].url = res.schemaextend[0].url.replace('Albums/', '');
    //this.properties = this._cmsService.propertiesFull;
    this._cmsService.page_edit(res, 0);
  }

  ngPageSelected(pageSelected: Page) {
    //this._cmsService.page_edit(pageSelected, 0);
    //console.log(pageSelected);
    //setTimeout(() => {
    this.createForm();
    //}, 1000);

    if (this._cmsService.pageSelected.objectType != '') {
      this.insertListObject = this._cmsService.pageSelected.objectType;
    } else {
      this.insertListObject = '';
    }
  }

  get secretLairs(): FormArray {
    return this.pageForm.get('secretLairs') as FormArray;
  }

  get secretPhotoPerson(): FormArray {
    return this.pageForm.get('secretPhotoPerson') as FormArray;
  }

  get secretMovieGenre(): FormArray {
    return this.pageForm.get('secretMovieGenre') as FormArray;
  }

  get secretSubtitle(): FormArray {
    return this.pageForm.get('secretSubtitle') as FormArray;
  }

  setAddresses(addresses: Address[]) {
    //console.log(addresses)
    const addressFGs = addresses.map((addresses) => this.fb.group(addresses));
    const addressFormArray = this.fb.array(addressFGs);
    this.pageForm.setControl('secretLairs', addressFormArray);
  }

  setPhotoPerson(photopersons: Treeid[]) {
    if (photopersons.length > 0) {
      const photopFGs = photopersons.map((photopersons) =>
        this.fb.group(photopersons)
      );
      const photopFormArray = this.fb.array(photopFGs);
      this.pageForm.setControl('secretPhotoPerson', photopFormArray);
    } else {
      //if(this._cmsService.pageSelected.schemaextend[0].photopersons)
      this.pageForm.setControl('secretPhotoPerson', this.fb.array([]));
    }
  }

  setMovieGenre(moviegenre: VideoGenre[]) {
    const moviegenreFGs = moviegenre.map((moviegenre) =>
      this.fb.group(moviegenre)
    );
    const moviegenreFormArray = this.fb.array(moviegenreFGs);
    this.pageForm.setControl('secretMovieGenre', moviegenreFormArray);
  }

  createImage(page) {
    this._cmsService.createImage(page);
  }

  lengtFromMovie() {
    var video: any = document.getElementById('mainmov');
    this._cmsService.pageSelected.schemaextend[0].length = parseInt(
      video.duration
    );
    this._cmsService
      .lengthFromMovie(this._cmsService.pageSelected)
      .subscribe((res) => this.durationReady(res));
  }

  durationReady(res) {
    this._cmsService.setPageSelected(res);
  }

  convertMovie(page) {
    this.sysreporter();
    this._messageService.SetAlertSuccess(
      'Start converting ' + this._cmsService.pageSelected.title
    );

    document.getElementById('convert_to_H265_button').style.display = 'none';
    this._cmsService
      .convertMovie(page)
      .subscribe((res) => this.convertMovieReady(page));
  }

  convertMovieReady(page) {
    this._cmsService
      .getMovieInfo(page)
      .subscribe((res) => this.getMovieInfoReady(res));
  }

  getMovieInfoReady(res) {
    this._cmsService
      .getcms(this._cmsService.pageSelected._id)
      .subscribe((res) => this.setPageSelect(res));
  }

  setPageSelect(res) {
    this._cmsService.setPageSelected(res);
    this._messageService.SetAlertSuccess(
      'Movie ' + this._cmsService.pageSelected.title + ' converted and updated'
    );
  }

  sysreporter() {
    var length =
      Math.ceil(this._cmsService.pageSelected.schemaextend[0].length) + 100;
    if (length > 0) {
      var i = 1;
      var fflog = this;
      var progress = this.progress;
      while (i < length && progress <= 100) {
        setTimeout(fflog.getFFmpegLog, i * 1000);
        i++;
      }
    }
  }

  captureTrfValue(name, evt) {
    console.log(evt);
    document.getElementById(name).innerHTML = evt.event.level.content;
  }

  getFFmpegLog() {
    var dhis = this;
    const xhr = new XMLHttpRequest();
    var mainc = this;
    xhr.open('GET', 'http://77.171.83.149:3001/assets/ffmpeg/log.txt', true);
    xhr.onload = function () {
      if (this.status == 200) {
        var ready = this.responseText.split('encoded ');
        if (ready.length > 1) {
          document.getElementById('ffmpeg_log_res').innerHTML = '100%';
        } else {
          var lines;
          var last_line1;
          var last_line;
          var pdur;
          var duration;
          var totalSeconds;
          var secondspast;
          var restseconds;
          var resttime;
          var preduration = this.responseText.split('Duration: ');
          if (preduration.length > 0) {
            pdur = preduration[1].split(', ');
            duration = pdur[0];
            var a = duration.split(':');
            if (a.length > 1) {
              var u = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
              totalSeconds = u | 0;
            }
          }

          lines = this.responseText.split('frame');
          last_line1 = lines[lines.length - 1];
          lines = last_line1.split('time=');
          last_line = lines[lines.length - 1];
          lines = last_line.split(' bitrate');

          if (duration != '') {
            var c = lines[0].split(':');
            var x = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
            secondspast = x | 0;
            restseconds = totalSeconds - secondspast;
            var d = Number(restseconds);
            var h = Math.floor(d / 3600);
            var m = Math.floor((d % 3600) / 60);
            var s = Math.floor((d % 3600) % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '0';
            var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '0';
            var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '0';

            if (
              hDisplay == '0' ||
              hDisplay == '1' ||
              hDisplay == '2' ||
              hDisplay == '3' ||
              hDisplay == '4' ||
              hDisplay == '5' ||
              hDisplay == '6' ||
              hDisplay == '7' ||
              hDisplay == '8' ||
              hDisplay == '9'
            ) {
              hDisplay = '0' + hDisplay;
            }

            if (
              mDisplay == '0' ||
              mDisplay == '1' ||
              mDisplay == '2' ||
              mDisplay == '3' ||
              mDisplay == '4' ||
              mDisplay == '5' ||
              mDisplay == '6' ||
              mDisplay == '7' ||
              mDisplay == '8' ||
              mDisplay == '9'
            ) {
              mDisplay = '0' + mDisplay;
            }
            if (s < 10 || sDisplay == '0') {
              sDisplay = '0' + sDisplay;
            }
            resttime = hDisplay + ':' + mDisplay + ':' + sDisplay;
          }

          var t1 = parseInt(
            (<HTMLInputElement>document.getElementById('length')).value
          );
          var t2 = lines[0];

          var b = t2.split(':');
          if (b.length > 1) t2 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

          var percentage = Math.round((parseInt(t2) / t1) * 100);
          mainc.progress = percentage;
          document.getElementById('ffmpeg_log_res').innerHTML =
            percentage + '%';
          document.getElementById('ajaxres').innerHTML =
            'Converting movie at <b>' +
            percentage +
            '%</b>' +
            (resttime != '' ? ' | <b>' + resttime + '</b>' : '');
        }
      }
    };
    xhr.send();
  }

  setSubtitle(country: Country[]) {
    const subtitleFGs = country.map((country) => this.fb.group(country));
    const subtitleFormArray = this.fb.array(subtitleFGs);
    this.pageForm.setControl('secretSubtitle', subtitleFormArray);
  }

  get filesToUploadInfo(): FormArray {
    return this.pageForm.get('filesToUploadInfo') as FormArray;
  }

  media_menu(media: Media) {
    var infoDisplay = document.getElementById('mediaMenu_' + media._id).style
      .display;
    var infokids = document.getElementsByClassName('mediaMenu_kid');

    for (var i = 0, len = infokids.length; i < len; i++) {
      document.getElementById(infokids[i].id).style.display = 'none';
    }

    if (infoDisplay == 'block') {
      document.getElementById('mediaInfo_' + media._id).style.display = 'none';
    } else {
      document.getElementById('mediaMenu_' + media._id).style.display = 'block';
    }
  }

  setActive(media: Media) {
    var vall = document.getElementById('blokdiv_' + media._id);
    if (vall.getAttribute('class') == 'cmsrow blok') {
      vall.classList.add('active');
    } else {
      vall.classList.remove('active');
    }
    if (this._router.url == '/cms') {
      var a = this._cmsService.pageSelected.media.indexOf(media._id);
      console.log('indexOf' + a);
      if (a == -1) {
        var tmedia = new mediaId();
        tmedia._id = media._id;
        this._cmsService.PageSelectedAddMediaId = media._id;
        this._cmsService.pageSelected.media.push(tmedia);
        this._cmsService.GetPageSelectedAddMedia();
      }
    }
  }

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }

  addMovieGenre() {
    this.secretMovieGenre.push(this.fb.group(new VideoGenre()));
  }

  addMPhotoPerson() {
    if (this._cmsService.pageSelected.schemaextend[0]['addresses'] == undefined)
      this._cmsService.pageSelected.schemaextend[0]['addresses'] = [];
    this.secretPhotoPerson.push(this.fb.group(new StringID()));
  }

  addSubtitle() {
    this.secretSubtitle.push(this.fb.group(new Country()));
  }

  addEventDateTime(
    type: string,
    event: MatDatepickerInputEvent<Date>,
    elid: string
  ) {
    var nfield = 'bid_' + elid;
    var nvalue = event.target.value;
    var tval = new Date(nvalue).toISOString();
    var sval = moment(event.target.value).format('DD MMM YYYY HH:mm:ss');

    var tdate = new Date(nvalue);
    (<HTMLInputElement>document.getElementById(nfield)).value = sval + '';
    (<HTMLInputElement>document.getElementById(elid)).value = tval;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>, elid: string) {
    var nfield = 'bid_' + elid;
    var nvalue = event.target.value;
    var tval = new Date(nvalue).toISOString();
    var sval = moment(event.target.value).format('DD MMM YYYY');
    var tdate = new Date(nvalue);
    (<HTMLInputElement>document.getElementById(nfield)).value = sval + '';
    (<HTMLInputElement>document.getElementById(elid)).value = tval;
  }

  changeDatepicker(date) {
    var nfield = 'b' + date.target.id;
    var nvalue = date.target.value;
    var tval = moment(date.target.value);
    console.log(nfield + ':' + nvalue + ':' + tval);
  }

  onKey(event: any) {
    // without type info
    console.log(event.target.value + ' | ');
    console.log(event.target.id + ' | ');
  }

  cmsSubListRest(page) {
    var tazbfield = document.getElementsByClassName('trowlink');
    for (var i = 0; i < tazbfield.length; i++) {
      if (tazbfield[i].getAttribute('id') == 'tabrowl_' + page._id) {
        document.getElementById('tabrowl_' + page._id).classList.add('active');
      } else {
        tazbfield[i].classList.remove('active');
      }
    }
  }

  propertyUpsert(prop) {
    var e = this.propertyselect;
    for (var i = 0; i < this._cmsService.pageSelected.cmsSubPages.length; i++) {
      this._cmsService.upsertPage(
        this._cmsService.pageSelected.cmsSubPages[i]._id
      );
    }
  }

  scan_new_folder() {
    this._cmsService.incrementKid(this._cmsService.pageSelected._id);
    var newpage = this._cmsService.pageSelected;
    newpage.parent = this._cmsService.pageSelected._id;
    this._cmsService
      .scan_new_folder(newpage)
      .subscribe((result) => console.log(result));
    this._messageService.SetAlertInfo('Folder scanned.');
  }

  scan_music_folder() {
    let varz = (document.getElementById('music_folder') as HTMLInputElement)
      .value;
    this._cmsService.incrementKid(this._cmsService.pageSelected._id);
    var newpage = this._cmsService.pageSelected;
    newpage.schemaextend = [];

    var schema = { url: varz };
    newpage.schemaextend.push(schema);

    newpage.parent = this._cmsService.pageSelected._id;
    this._cmsService
      .scan_music_folder(newpage, varz)
      .subscribe((result) => console.log(result));
    this._messageService.SetAlertInfo('Folder scanned.');
  }

  scan_url_folder() {
    this._cmsService.incrementKid(this._cmsService.pageSelected._id);
    var newpage: Page = this._cmsService.pageSelected;
    newpage.parent = this._cmsService.pageSelected._id;
    this._cmsService
      .scan_url_folder(newpage)
      .subscribe((result) => console.log(result));
    this._messageService.SetAlertInfo('Folder scanned.');
  }

  objectChanged() {
    var newNews;
    var selectedObject = (
      document.getElementById('objectType') as HTMLInputElement
    ).value;
    if (selectedObject != '') {
      this._cmsService.pageSelected.objectType = selectedObject;
      this._cmsService.resetParentPropFull();

      var a = this._cmsService.sysObjects
        .map(function (e) {
          return e._id;
        })
        .indexOf(selectedObject);
      const newObject = {};
      if (this._cmsService.sysObjects[a]) {
        for (let prop of this._cmsService.sysObjects[a].properties) {
          var bb = this._cmsService.pagetpropertiesFull
            .map(function (e) {
              return e._id;
            })
            .indexOf(prop);
          newObject[this._cmsService.pagetpropertiesFull[bb].pname] = '';
        }
        newNews = newObject;
      }

      var objectMerged = Object.assign(this._cmsService.pageSelected, newNews);
      this.dataObject = this._cmsService.pageSelected;
      const formGroup = {};
      for (let prop of Object.keys(objectMerged)) {
        if (prop == 'title') {
          formGroup['title'] = new FormControl(
            this._cmsService.pageSelected.title
          );
        } else if (prop == 'media') {
          formGroup[prop] = this.fb.array([]);
        } else if (prop == 'schemaextend') {
          formGroup['schemaextend'] = new FormGroup({});
          if (
            this._cmsService.pagetpropertiesFull &&
            this._cmsService.pagetpropertiesFull.length > 0
          ) {
            for (
              var i = 0;
              i < this._cmsService.pagetpropertiesFull.length;
              i++
            ) {
              var labelf = this._cmsService.pagetpropertiesFull[i].pname;
              var propdata = this._cmsService.pagetpropertiesFull[i].type;
              var propval;
              if (
                this._cmsService.pagetpropertiesFull[i] != null &&
                this._cmsService.pageSelected.schemaextend.length > 0
              ) {
                if (
                  this._cmsService.pageSelected.schemaextend[0] != null &&
                  this._cmsService.pageSelected.schemaextend[0][labelf] != null
                ) {
                  propval =
                    this._cmsService.pageSelected.schemaextend[0][labelf];
                } else {
                  propval = '';
                }
              } else if (propdata == 'boolean') {
                propval = false;
              } else {
                propval = '';
              }
              var required: any;
              if (this._cmsService.pagetpropertiesFull[i].required == true) {
                required = Validators.required;
              } else {
                required = '';
              }
              if (propdata == 'Date') {
                //let date = propval.substring(0, 10);
                //console.log(date);
                //var ndate = moment(propval).toISOString();
                var bname = 'bid_' + labelf;
                if (propval != '') {
                  var ttml = moment(propval).format('DD MMM YYYY');
                } else {
                  var ttml = '';
                }
                console.log(ttml);
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                );
                formGroup['schemaextend'].addControl(
                  bname,
                  new FormControl(ttml, required)
                );
              } else if (propdata == 'DateTime') {
                let date = propval.substring(0, 10);
                console.log(date);
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                );
                var bname = 'bid_' + labelf;
                formGroup['schemaextend'].addControl(
                  bname,
                  new FormControl(ttml, required)
                );
              } else if (propdata == 'boolean') {
                if (propval == undefined) propval = false;
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                ); // , Validators.required
              } else if (propdata == 'time') {
                if (propval != '') {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl(propval, required)
                  ); // , Validators.required
                } else {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl('00:00', required)
                  ); // , Validators.required
                }
              } else if (propdata == 'file') {
                var b = this.getById(
                  this._cmsService.properties,
                  this._cmsService.parentPage.properties[i]
                );
                if (
                  this._cmsService.pageSelected.schemaextend[0] != undefined
                ) {
                  var filenamez =
                    this._cmsService.pagetpropertiesFull[i].values +
                    '_' +
                    this._cmsService.pageSelected._id +
                    '.' +
                    this._cmsService.pageSelected.schemaextend[0].user_image;
                } else {
                  var filenamez = '';
                }
                var contdiv = 'content_' + labelf;
                if (propval != '' && filenamez != '') {
                  var file = '/api/assets/content/' + filenamez;
                  var url =
                    '<a class="margin_r_10 icmn-info icomoon float_r" href="/api/assets/content/' +
                    filenamez +
                    '" target="_blank" title="{{filenamez}}"></a><div class="thumbnail"><img src="' +
                    file +
                    '" class="" alt="" /></div>';
                  var filein = labelf;
                  // this._cmsService.pagefiles.push({
                  //   div: contdiv,
                  //   url: url,
                  //   filein: filein,
                  // });
                } else {
                  // this._cmsService.pagefiles.push({
                  //   div: contdiv,
                  //   url: '',
                  //   filein: '',
                  // });
                }
                formGroup['schemaextend'].addControl(
                  labelf + '_extension',
                  new FormControl(propval ? propval : '')
                ); // , Validators.required
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl('', required)
                ); // , Validators.required
              } else if (propdata == 'Object') {
                if (labelf == 'addresses') {
                  formGroup['schemaextend'].addControl(
                    'secretLiars',
                    this.fb.array([])
                  );
                  if (
                    this._cmsService.pageSelected.schemaextend[0][
                      'addresses'
                    ] == undefined
                  )
                    this._cmsService.pageSelected.schemaextend[0]['addresses'] =
                      [];
                } else if (labelf == 'moviegenre') {
                  formGroup['schemaextend'].addControl(
                    'secretMovieGenre',
                    this.fb.array([])
                  );
                  if (
                    this._cmsService.pageSelected.schemaextend[0][
                      'moviegenre'
                    ] == undefined
                  )
                    this._cmsService.pageSelected.schemaextend[0][
                      'moviegenre'
                    ] = [];
                } else if (labelf == 'subtitles') {
                  formGroup['schemaextend'].addControl(
                    'secretSubtitle',
                    this.fb.array([])
                  );
                } else if (labelf == 'photopersons') {
                  formGroup['schemaextend'].addControl(
                    'secretPhotoPerson',
                    this.fb.array([])
                  );
                  if (
                    this._cmsService.pageSelected.schemaextend[0][
                      'photopersons'
                    ] == undefined
                  )
                    this._cmsService.pageSelected.schemaextend[0][
                      'photopersons'
                    ] = [];
                } else {
                  if (
                    this._cmsService.pageSelected.schemaextend[0][labelf] ==
                    undefined
                  )
                    this._cmsService.pageSelected.schemaextend[0][labelf] = [];
                }
              } else if (propdata == 'array') {
                if (propval.length > 0) {
                  var index;
                  this.selected2 = [];
                  for (index = 0; index < propval.length; ++index) {
                    let tosave = this.filterIndexFromArray(propval[index])
                      .replaceAll(' ', '')
                      .replaceAll("'", '');
                    this.selected2.push(tosave);
                  }
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl(this.selected2, required)
                  );
                } else {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl('')
                  );
                }
              } else if (labelf == 'content') {
                if (propval != '') {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl(propval, required)
                  );
                } else {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl('')
                  );
                }
              } else {
                if (propval != '') {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl(propval, required)
                  );
                } else {
                  formGroup['schemaextend'].addControl(
                    labelf,
                    new FormControl('')
                  );
                }
              }
            }
          }
        } else {
          formGroup[prop] = new FormControl(this.dataObject[prop]);
        }
      }

      this.pageForm = new FormGroup(formGroup);
      var asdf = this._cmsService;
      setTimeout(function () {
        asdf.update_edit_image_fields(asdf.pageSelected);
      }, 500);

      if (
        this._cmsService.pageSelected.schemaextend[0] != undefined &&
        this._cmsService.pageSelected.schemaextend[0].addresses != undefined
      ) {
        this.addressez =
          this._cmsService.pageSelected.schemaextend[0].addresses;
        this.setAddresses(this.addressez);
        this.schemaextend.setControl('secretLairs', this.secretLairs);
      }

      if (
        this._cmsService.pageSelected.schemaextend[0] != undefined &&
        this._cmsService.pageSelected.schemaextend[0].photopersons != undefined
      ) {
        if (this._cmsService.pageSelected.schemaextend[0].photopersons != '') {
          this.photopersonz =
            this._cmsService.pageSelected.schemaextend[0].photopersons;
          this.setPhotoPerson(this.photopersonz);
          this.schemaextend.setControl(
            'secretPhotoPerson',
            this.secretPhotoPerson
          );
        }
      }

      if (
        this._cmsService.pageSelected.schemaextend[0] != undefined &&
        this._cmsService.pageSelected.schemaextend[0].subtitles != undefined
      ) {
        this.subtitlez =
          this._cmsService.pageSelected.schemaextend[0].subtitles;
        this.setSubtitle(this.subtitlez);
        this.schemaextend.setControl('secretSubtitle', this.secretSubtitle);
      }

      if (
        this._cmsService.pageSelected.schemaextend[0] != undefined &&
        this._cmsService.pageSelected.schemaextend[0].moviegenre != undefined
      ) {
        this.moviegenrez =
          this._cmsService.pageSelected.schemaextend[0].moviegenre;
        this.setMovieGenre(this.moviegenrez);
        this.schemaextend.setControl('secretMovieGenre', this.secretMovieGenre);
      }
    }
  }

  checkDeleteButtons() {
    let secure = (<HTMLInputElement>document.getElementById('secure')).checked;
    if (secure == true) {
      this._cmsService.pageSecure = true;
    } else {
      this._cmsService.pageSecure = false;
    }
    this._cmsService.pageSelected.secure = this._cmsService.pageSecure;
    //console.log(this._cmsService.pageSecure);
  }

  dynamicForm() {
    const formModel = this.propForm.value;
    //var newNews;
    this._cmsService.pagefiles = [];
    // if (this._cmsService.pageSelected.objectType != '') {
    //   var a = this._cmsService.sysObjects
    //     .map(function (e) {
    //       return e._id;
    //     })
    //     .indexOf(this._cmsService.pageSelected.objectType);
    //   const newObject = {};
    //   if (this._cmsService.sysObjects[a]) {
    //     for (let prop of this._cmsService.sysObjects[a].properties) {
    //       var bb = this._cmsService.pagetpropertiesFull
    //         .map(function (e) {
    //           return e._id;
    //         })
    //         .indexOf(prop);
    //       newObject[this._cmsService.pagetpropertiesFull[bb].pname] = '';
    //     }
    //     newNews = newObject;
    //   }
    // }

    //var objectMerged = Object.assign(this._cmsService.pageSelected, newNews);
    this.dataObject = this._cmsService.pageSelected;
    const formGroup = {};
    let merged = Object.keys(this.dataObject);
    let newdate;
    for (let prop of merged) {
      if (prop == 'title') {
        formGroup['title'] = new FormControl(
          this._cmsService.pageSelected.title
        );
      } else if (prop == 'dateLast') {
        if (
          this._cmsService.pageSelected.dateLast &&
          this._cmsService.pageSelected.dateLast.length > 16
        ) {
          let d = new Date(this._cmsService.pageSelected.dateLast);

          newdate =
            [
              d.getFullYear(),
              ('0' + (d.getMonth() + 1)).slice(-2),
              ('0' + d.getDate()).slice(-2),
            ].join('-') +
            'T' +
            [
              ('0' + d.getHours()).slice(-2),
              ('0' + d.getMinutes()).slice(-2),
            ].join(':'); // 2024-04-27T16:55
          //console.log(newdate);
        } else {
          newdate = this._cmsService.pageSelected.dateLast;
        }
        formGroup['dateLast'] = new FormControl(newdate);
      } else if (prop == 'dateCreated') {
        if (
          this._cmsService.pageSelected.dateCreated &&
          this._cmsService.pageSelected.dateCreated.length > 16
        ) {
          let d = new Date(this._cmsService.pageSelected.dateCreated);
          newdate =
            [
              d.getFullYear(),
              ('0' + (d.getMonth() + 1)).slice(-2),
              ('0' + d.getDate()).slice(-2),
            ].join('-') +
            'T' +
            [
              ('0' + d.getHours()).slice(-2),
              ('0' + d.getMinutes()).slice(-2),
            ].join(':'); // 2024-04-27T16:55
        } else {
          newdate = this._cmsService.pageSelected.dateCreated;
        }
        formGroup['dateCreated'] = new FormControl(newdate);
      } else if (prop == 'media') {
        formGroup[prop] = this.fb.array([]);
      } else if (prop == 'schemaextend') {
        formGroup['schemaextend'] = new FormGroup({});
        if (
          this._cmsService.pagetpropertiesFull &&
          this._cmsService.pagetpropertiesFull.length > 0
        ) {
          for (
            var i = 0;
            i < this._cmsService.pagetpropertiesFull.length;
            i++
          ) {
            var labelf = this._cmsService.pagetpropertiesFull[i].pname;
            var propdata = this._cmsService.pagetpropertiesFull[i].type;
            var propval;
            if (
              this._cmsService.pagetpropertiesFull[i] != null &&
              this._cmsService.pageSelected.schemaextend.length > 0
            ) {
              if (
                this._cmsService.pageSelected.schemaextend[0] != null &&
                this._cmsService.pageSelected.schemaextend[0][labelf] != null
              ) {
                propval = this._cmsService.pageSelected.schemaextend[0][labelf];
              } else {
                propval = '';
              }
            } else if (propdata == 'boolean') {
              propval = false;
            } else {
              propval = '';
            }
            var required: any;
            if (this._cmsService.pagetpropertiesFull[i].required == true) {
              required = Validators.required;
            } else {
              required = '';
            }
            if (propdata == 'Date') {
              var ndate = moment(propval).toISOString();
              var bname = 'bid_' + labelf;
              if (propval != '') {
                var ttml = moment(propval).format('DD MMM YYYY');
              } else {
                var ttml = '';
              }
              formGroup['schemaextend'].addControl(
                labelf,
                new FormControl(propval, required)
              );
              formGroup['schemaextend'].addControl(
                bname,
                new FormControl(ttml, required)
              );
            } else if (propdata == 'DateTime') {
              if (propval.match('000Z')) {
                const pad = (n) =>
                  `${Math.floor(Math.abs(n))}`.padStart(2, '0');
                const toISOStringWithTimezone = (date) => {
                  return (
                    date.getFullYear() +
                    '-' +
                    pad(date.getMonth() + 1) +
                    '-' +
                    pad(date.getDate()) +
                    'T' +
                    pad(date.getHours()) +
                    ':' +
                    pad(date.getMinutes())
                  );
                };
                propval = toISOStringWithTimezone(new Date(propval)); // '2024-01-06T19:20:34+02:00'
              }
              formGroup['schemaextend'].addControl(
                labelf,
                new FormControl(propval, required)
              );
              var bname = 'bid_' + labelf;
              formGroup['schemaextend'].addControl(
                bname,
                new FormControl(ttml, required)
              );
            } else if (propdata == 'boolean') {
              if (propval == undefined) propval = false;
              formGroup['schemaextend'].addControl(
                labelf,
                new FormControl(propval, required)
              );
            } else if (propdata == 'time') {
              if (propval != '') {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                );
              } else {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl('00:00', required)
                );
              }
            } else if (propdata == 'file') {
              var b = this.getById(
                this._cmsService.properties,
                this._cmsService.parentPage.properties[i]
              );
              if (this._cmsService.pageSelected.schemaextend[0] != undefined) {
                var filenamez =
                  this._cmsService.pagetpropertiesFull[i].values +
                  '_' +
                  this._cmsService.pageSelected._id +
                  '.' +
                  this._cmsService.pageSelected.schemaextend[0].user_image;
              } else {
                var filenamez = '';
              }
              var contdiv = 'content_' + labelf;
              if (propval != '' && filenamez != '') {
                var file = '/api/assets/content/' + filenamez;
                var url =
                  '<a class="margin_r_10 icmn-info icomoon float_r" href="/api/assets/content/' +
                  filenamez +
                  '" target="_blank"></a><div class="thumbnail"><img src="' +
                  file +
                  '" class="" alt="" /></div>';
                var filein = labelf;
                // this._cmsService.pagefiles.push({
                //   div: contdiv,
                //   url: url,
                //   filein: filein,
                // });
              } else {
                // this._cmsService.pagefiles.push({
                //   div: contdiv,
                //   url: '',
                //   filein: '',
                // });
              }
              //formGroup['schemaextend'].addControl(labelf + '_extension', new FormControl((propval ? propval : ""))); // , Validators.required
              formGroup['schemaextend'].addControl(
                labelf,
                new FormControl('', required)
              ); // , Validators.required
            } else if (propdata == 'Object') {
              if (labelf == 'addresses') {
                formGroup['schemaextend'].addControl(
                  'secretLiars',
                  this.fb.array([])
                );
                // if (
                //   this._cmsService.pageSelected.schemaextend[0]['addresses'] ==
                //   undefined
                // )
                //   this._cmsService.pageSelected.schemaextend[0]['addresses'] =
                //     [];
              } else if (labelf == 'moviegenre') {
                formGroup['schemaextend'].addControl(
                  'secretMovieGenre',
                  this.fb.array([])
                );
                if (
                  this._cmsService.pageSelected.schemaextend[0]['moviegenre'] ==
                  undefined
                )
                  this._cmsService.pageSelected.schemaextend[0]['moviegenre'] =
                    [];
              } else if (labelf == 'subtitles') {
                formGroup['schemaextend'].addControl(
                  'secretSubtitle',
                  this.fb.array([])
                );
              } else if (labelf == 'photopersons') {
                formGroup['schemaextend'].addControl(
                  'secretPhotoPerson',
                  this.fb.array([])
                );
                if (
                  this._cmsService.pageSelected.schemaextend[0][
                    'photopersons'
                  ] == undefined
                )
                  this._cmsService.pageSelected.schemaextend[0][
                    'photopersons'
                  ] = [];
              } else {
                formGroup['schemaextend'].addControl(labelf, this.fb.array([]));
                if (
                  this._cmsService.pageSelected.schemaextend[0][labelf] ==
                  undefined
                )
                  this._cmsService.pageSelected.schemaextend[0][labelf] = [];
              }
            } else if (propdata == 'array') {
              if (propval.length > 0) {
                var index;
                this.selected2 = [];
                for (index = 0; index < propval.length; ++index) {
                  let tosave = this.filterIndexFromArray(propval[index])
                    .replaceAll(' ', '')
                    .replaceAll("'", '');
                  this.selected2.push(tosave);
                }
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(this.selected2, required)
                );
              } else {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl('')
                );
              }
            } else if (labelf == 'content') {
              if (propval != '') {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                );
              } else {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl('')
                );
              }
            } else {
              if (propval != '') {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl(propval, required)
                );
              } else {
                formGroup['schemaextend'].addControl(
                  labelf,
                  new FormControl('')
                );
              }
            }
          }
        }
      } else {
        formGroup[prop] = new FormControl(this.dataObject[prop]);
      }
    }

    this.pageForm = new FormGroup(formGroup);
    var asdf = this._cmsService;
    setTimeout(function () {
      asdf.update_edit_image_fields(asdf.pageSelected);
    }, 500);

    //console.log(this._cmsService.pageSelected);
    //if(merged['addresses'] != undefined) {
    if (
      this._cmsService.pageSelected &&
      this._cmsService.pageSelected.schemaextend &&
      this._cmsService.pageSelected.schemaextend[0]?.addresses
    ) {
      this.addressez = this._cmsService.pageSelected.schemaextend[0].addresses;
      this.setAddresses(this.addressez);
      this.schemaextend.setControl('secretLairs', this.secretLairs);
    } else {
      //this.setAddresses(this.addressez);
      //this.schemaextend.setControl('secretLairs', this.fb.array([]));
    }
    //}

    if (
      this._cmsService.pageSelected.schemaextend &&
      this._cmsService.pageSelected.schemaextend[0]?.photopersons
    ) {
      //if (this._cmsService.pageSelected.schemaextend[0].photopersons != '') {
      this.photopersonz =
        this._cmsService.pageSelected.schemaextend[0].photopersons;
      //}
      this.setPhotoPerson(this.photopersonz);
      this.schemaextend.setControl('secretPhotoPerson', this.secretPhotoPerson);
    } else {
      //this._cmsService.pageSelected.schemaextend[0].photopersons = [];
      //this.photopersonz =
      //  this._cmsService.pageSelected.schemaextend[0].photopersons;
    }

    if (
      this._cmsService.pageSelected.schemaextend &&
      this._cmsService.pageSelected.schemaextend[0]?.subtitles
    ) {
      this.subtitlez = this._cmsService.pageSelected.schemaextend[0].subtitles;
      this.setSubtitle(this.subtitlez);
      this.schemaextend.setControl('secretSubtitle', this.secretSubtitle);
    }

    if (
      this._cmsService.pageSelected.schemaextend &&
      this._cmsService.pageSelected.schemaextend[0]?.moviegenre
    ) {
      this.moviegenrez =
        this._cmsService.pageSelected.schemaextend[0].moviegenre;
      this.setMovieGenre(this.moviegenrez);
      this.schemaextend.setControl('secretMovieGenre', this.secretMovieGenre);
    }
  }

  filterIndexFromArray(val) {
    if (val.includes(':')) {
      let prop = val.split(':');
      return prop[1];
    } else {
      return val;
    }
  }

  passchk(docId, val) {
    (<HTMLInputElement>document.getElementById(docId)).value = val;
  }

  multiins(inputName) {
    let tetst = this.selected2;
  }

  createThumb() {
    this._cmsService.createThumb(this._cmsService.pageSelected._id).subscribe();
  }

  delete_address(index) {
    var confirmText = 'Are you sure you want to delete this address?';
    if (confirm(confirmText)) {
      this.addressez.splice(index, 1);
      this.secretLairs.controls.splice(index, 1);
      var tmppage = this.prepareSavePage();
      tmppage.schemaextend[0].addresses = this.addressez;
      this._cmsService
        .updatePage(tmppage)
        .subscribe((res) => this.updatePageReady(tmppage));
    }
  }

  delete_person(index) {
    var confirmText = 'Are you sure you want to delete this person?';
    if (confirm(confirmText)) {
      this.photopersonz.splice(index, 1);
      this.secretPhotoPerson.controls.splice(index, 1);
      var tmppage = this.prepareSavePage();
      tmppage.schemaextend[0].photopersons = this.photopersonz;
      this._cmsService
        .updatePage(tmppage)
        .subscribe((res) => this.updatePageReady(tmppage));
    }
  }

  deleteAllPhotoPerson() {
    var confirmText = 'Are you sure you want to delete all persona?';
    if (confirm(confirmText)) {
      this.photopersonz = [];
      var tmppage = this.prepareSavePage();
      tmppage.schemaextend[0].photopersons = this.photopersonz;
      this._cmsService
        .updatePage(tmppage)
        .subscribe((res) => this.updatePageReady(tmppage));
    }
  }

  delete_moviegenre(index) {
    this.moviegenrez.splice(index, 1);
    this.secretMovieGenre.controls.splice(index, 1);
    var tmppage = this.prepareSavePage();
    tmppage.schemaextend[0].moviegenre = this.moviegenrez;
    this._cmsService
      .updatePage(tmppage)
      .subscribe((res) => this.updatePageReady(tmppage));
  }

  delete_subtitle(index) {
    var confirmText = 'Are you sure you want to delete this subtitle?';
    if (confirm(confirmText)) {
      this.subtitlez.splice(index, 1);
      this.secretSubtitle.controls.splice(index, 1);
      var tmppage = this.prepareSavePage();
      tmppage.schemaextend[0].subtitles = this.subtitlez;
      this._cmsService
        .updatePage(tmppage)
        .subscribe((res) => this.updatePageReady(tmppage));
    }
  }

  showhideButton(event) {
    var rowid = document.getElementById('genrebutton');
    if (event.target.value != '') {
      rowid.classList.remove('hidden');
    } else {
      rowid.classList.add('hidden');
    }
  }

  showhideButtonC(event) {
    var rowid = document.getElementById('subtitlebutton');
    if (event.target.value != '') {
    } else {
      rowid.classList.add('hidden');
    }
  }

  createForm() {
    this.filterForm = this.fb.group({
      values: new FormControl(''),
    });

    this.propForm = this.fb.group({
      _id: new FormControl(''),
      title: new FormControl(''),
      pname: new FormControl(''),
      access: new FormControl('public'),
      type: new FormControl(''),
      inputtype: new FormControl(''),
      minlength: new FormControl(''),
      maxlength: new FormControl(''),
      required: new FormControl(''),
      object: new FormControl(''),
      list: new FormControl(''),
      values: new FormControl(''),
      labels: new FormControl(''),
      labelsarr: new FormControl(''),
      valuesarr: new FormControl(''),
    });
    this.dynamicForm();
  }

  deleteMediafromPage(index) {
    this._cmsService.pageSelected.media.splice(index, 1);
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((res) => this.updatePageReady(this._cmsService.pageSelected));
  }

  deleteMedia(evfile) {
    this._mediaService
      .destroyMedia(evfile)
      .subscribe((result) => this.destroyMediaReady(result));
  }

  destroyMediaReady(res) {
    this._mediaService.getImageDData();
  }

  deletefilter(index) {
    var bed = this.prepareSavePage();
    bed.filter.splice(index, 1);
    this._cmsService.currentCmsFilters.splice(index, 1);
    this._cmsService.updatePage(bed).subscribe();
  }

  deletefilterReady(index) {
    this._cmsService.setFilters();
  }

  setMedia(medias: [any]) {
    const mediaFGs = medias.map((media) => this.fb.group(media));
    const mediaFormArray = this.fb.array(mediaFGs);
    this.pageForm.setControl('media', mediaFormArray);
  }

  cancel_addAddress(counter) {
    this.secretLairs.controls.splice(counter, 1);
  }

  setSchemaExtensions(schemaextension: News[]) {
    const addressFGs = schemaextension.map((news) => this.fb.group(news));
    const addressFormArray = this.fb.array(addressFGs);
    this.pageForm.setControl('schemaextend', addressFormArray);
  }

  updateRadio(elid, val) {
    (<HTMLInputElement>document.getElementById(elid)).value = val;
  }

  GgetLists() {
    if (
      this._cmsService.pageSelected.objectType != '' &&
      this._cmsService.pageSelected.listItem == false
    ) {
      for (var i = 0; i < this._cmsService.sysObjects.length; i++) {
        if (
          this._cmsService.pageSelected.objectType ==
          this._cmsService.sysObjects[i]._id
        ) {
          console.log(this._cmsService.sysObjects[i].title);
        }
      }
    }
  }

  GgetListsR(pages) {
    this._cmsService.pages = pages;
    this._cmsService.pages.unshift(this._cmsService.pageRoot);
    for (var i = 0; i < this._cmsService.pages.length; i++) {
      if (this._cmsService.treelevels[1]._id == this._cmsService.pages[i]._id) {
        this._cmsService
          .getPages(this._cmsService.treelevels[1]._id)
          .subscribe((res) => this.getListsPush(res, i));
      }
    }
  }

  getListsPush(pages, index) {
    var subpages = pages;
    var subaspages = this._cmsService.pages;
    var i = index;
    subpages.forEach(function (s) {
      subaspages.splice(i, 0, s);
      i++;
    });
    this._cmsService.pages = subaspages;
  }

  checkbuttons() {
    var element = document.getElementsByClassName('btnsaveCms');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove('hidden');
    }
    var element = document.getElementsByClassName('btnsaveCmsNew');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.add('hidden');
    }

    var ccell = document.getElementById(
      'rowcell_' + this._cmsService.pageSelected._id
    );
    if (ccell.getAttribute('class') == 'icon icmn-arrow-right5') {
      ccell.setAttribute('class', 'icon icmn-arrow-down5');
    } else {
      ccell.setAttribute('class', 'icon icmn-arrow-right5');
    }
  }

  private saveToFileSystem(response) {
    document.getElementById('scannedFiles').innerHTML = response;
    const contentDispositionHeader: string = response.headers.get(
      'Content-Disposition'
    );
    const parts: string[] = contentDispositionHeader.split(';');
    const filename = parts[1].split('=')[1];
    const blob = new Blob([response._body], { type: 'text/plain' });
  }

  get secretImages(): FormArray {
    return this.pageForm.get('secretImages') as FormArray;
  }

  get schemaextend(): FormGroup {
    return this.pageForm.get('schemaextend') as FormGroup;
  }

  toggle_radio(elema, elemb) {
    var celema = document.getElementById(elema);
    var celemb = document.getElementById(elemb);
    celemb.click();
  }

  rangeShowValue(event) {
    event.title = event.target.value;
  }

  mediaLibHide() {
    document.getElementById('buttonAddMedia').classList.remove('hidden');
    document.getElementById('buttonHideMedia').classList.add('hidden');
    document.getElementById('mediaAdd').classList.add('hidden');
  }
  mediaLibShow() {
    document.getElementById('buttonAddMedia').classList.add('hidden');
    document.getElementById('buttonHideMedia').classList.remove('hidden');
    document.getElementById('mediaAdd').classList.remove('hidden');
  }

  bigtoggle(event) {
    this.toggleDiv('addMedia');
    this.toggleDiv('hideMedia');
    this.toggleDiv('mediaAdd');
  }

  toggleDivv(elema) {
    var test = document.getElementById(elema);
    if (test.classList.contains('hidden')) {
      document.getElementById(elema).classList.remove('hidden');
    } else {
      document.getElementById(elema).classList.add('hidden');
    }
  }

  checkboxupdate(id) {
    let oldvar = (<HTMLInputElement>document.getElementById(id)).checked;
    let newvar;
    if (oldvar == true) {
      newvar = 'false';
    } else {
      newvar = 'true';
    }
    //console.log(newvar);
    const formModel = this.pageForm.value;
    formModel.schemaextend[id] = newvar;
    //(<HTMLInputElement>document.getElementById(id)).checked = newvar;
  }

  toggleDiv(elema) {
    var test = document.getElementById(elema);
    if (test.classList.contains('hidden') === true) {
      test.classList.remove('hidden');
    } else {
      test.classList.add('hidden');
    }
  }

  toggleCheckbox(elema) {
    if (
      this._cmsService.mustLogIn == false ||
      this._userService.getUserLoggedIn() == true
    ) {
      if (
        this._cmsService.mustLogIn == false ||
        this._userService.user_current.userRole > 29
      ) {
        if (this._cmsService.pageSelected.title != 'Root') {
          var celema = document.getElementById(elema);
          celema.click();

          var celb = document.getElementsByClassName(elema);
          for (var i = 0; i < celb.length; i++) {
            if (
              celb[i].getAttribute('class') ==
              elema + ' icmn-checkbox-unchecked2'
            ) {
              celb[i].setAttribute('class', elema + ' icmn-checkbox-checked2');
              if (
                this._cmsService.pageSelected._id != '' &&
                document.getElementById('deletePageButton')
              )
                document
                  .getElementById('deletePageButton')
                  .classList.add('hidden');
              celema.setAttribute('value', 'false');
            } else {
              celb[i].setAttribute(
                'class',
                elema + ' icmn-checkbox-unchecked2'
              );
              if (
                this._cmsService.pageSelected._id != '' &&
                document.getElementById('deletePageButton')
              )
                document
                  .getElementById('deletePageButton')
                  .classList.remove('hidden');
              celema.setAttribute('value', 'true');
            }
          }
        }
      }
    }
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

  visible_click(event) {
    const formModel = this.pageForm.value;
    if (this._cmsService.pageSelected.visible == true) {
      this._cmsService.pageSelected.visible = false;
      formModel.visible = false;
    } else {
      this._cmsService.pageSelected.visible = true;
      formModel.visible = true;
    }
  }

  secure_click(event) {
    const formModel = this.pageForm.value;
    if (this._cmsService.pageSelected.secure == true) {
      this._cmsService.pageSelected.secure = false;
      formModel.secure = false;
    } else {
      this._cmsService.pageSelected.secure = true;
      formModel.secure = true;
    }
  }

  readSingleFile(page) {
    return JSON
      ? JSON.stringify(page, null, '  ')
      : 'your browser doesnt support JSON so cant pretty print';
  }

  readSingleFileResult() {
    var page = this.readSingleFile(this._cmsService.pageSelected).replace(
      '{|}',
      ''
    );
    var linezs = page.split('{');
    var linez = linezs[1].split('}');
    var lines = linez[0].split(',');

    document.getElementById('tab_6_res').innerHTML = '<h4>Page model</h4>';
    for (var i = 0; i < lines.length; i++) {
      var linebreak = lines[i].trim().split(': ');
      document.getElementById('tab_6_res').innerHTML +=
        '<input type="checkbox" class="model " value="" /> ' +
        linebreak[0] +
        ': ' +
        linebreak[1] +
        '<br />';
    }
  }

  objmerge() {
    if (this._cmsService.pagetpropertiesFull.length > 0) {
      console.log('he?');
      var objectMerged = Object.assign(
        this._cmsService.pageSelected,
        new News()
      );
      this.dataObject = objectMerged;
      this.objectProps = Object.keys(this.dataObject).map((prop) => {
        return Object.assign({}, { key: prop }, this.dataObject[prop]);
      });
      const formGroup = {};
      for (let prop of Object.keys(this.dataObject)) {
        formGroup[prop] = new FormControl(this.dataObject[prop]);
        console.log(formGroup[prop]);
      }
      this._cmsService.pageSelected.properties.push(formGroup);
      this.pageForm = new FormGroup(formGroup);
    }
  }

  toggle_checkbox_class(propid) {
    var inpu = document.getElementById(propid);
    var inclass = inpu.getAttribute('class');
    console.log(inclass);
  }

  validateinsertListvalue(ptext) {
    this.multifieldsupload = 0;
    var text = ptext.target.value;
    var items = text.split('\n');
    if (items.length > 1) {
      var multifieldsupload = this.multifieldsupload;
      for (var i = 0; i < items.length; i++) {
        if (items[i] != '') {
          var tfields = items[i].split(',');
          if (tfields.length > 0) {
            multifieldsupload++;
          }
        }
        if (i == items.length - 1) {
          this.multifieldsupload = multifieldsupload;
        }
      }
    }
  }

  findIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
      if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
    }
    return null;
  }

  getById(arr, id) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d] != '' && arr[d]._id === id) {
        return arr[d];
      }
    }
  }

  insert_field() {
    var yeso = 0;
    var checkboxes = document.getElementsByClassName('insertField');
    const cb = (<HTMLInputElement>document.getElementById('mySelect')).value;
    var nval = (<HTMLInputElement>document.getElementById('insertFieldvalue'))
      .value;
    if (cb != '') {
      this._cmsService.insertField(this._cmsService.pageSelected, cb, nval);
    }
    yeso = 1;
  }

  insert_field2() {
    var yeso = 0;
    var checkboxes = document.getElementsByClassName('insertField');
    const cb = (<HTMLInputElement>document.getElementById('mySelect')).value;
    var nval = (<HTMLInputElement>document.getElementById('insertFieldvalue'))
      .value;
    if (cb != '') {
      this._cmsService.insertField2(this._cmsService.pageSelected, cb, nval);
    }
    yeso = 1;
  }
  insert_newfield() {
    var nval = (<HTMLInputElement>document.getElementById('insertFieldvalue'))
      .value;
    var newval = (<HTMLInputElement>(
      document.getElementById('insertFieldNewvalue')
    )).value;
    if (nval == '') {
    } else if (newval != '' && nval != '') {
      this._cmsService.insertField(this._cmsService.pageSelected, newval, nval);
    }
  }

  insert_newlist_test() {
    var nval = (<HTMLInputElement>document.getElementById('insertListvalue'))
      .value;
    if (nval != '') {
      if (this.linesseperateby == 'n') {
        var rows = nval.split('\n');
      } else {
        var rows = nval.split(';');
      }
      if (rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i] != '') {
            var parent = this._cmsService.pageSelected._id;
            var tvisible = this.insertListVisible;
            var tsecure = this.insertListSecure;
            var res = rows[i].match(/;/g);
            var tpage = new Page();
            tpage.parent = parent;
            tpage.visible = tvisible;
            tpage.secure = tsecure;
            tpage.objectType = '5c5226408830db21fcc401ab'; // songs
            tpage.treelevel = this._cmsService.pageSelected.treelevel + 1;
            if (res.length > 0) {
              var columns = rows[i].split(';');
              tpage.title = columns[0];
              var tmp = {};
              tmp['url'] = columns[1];
              tpage.schemaextend[0] = tmp;
              this._cmsService
                .insertPage(tpage)
                .subscribe((page) => this.newPageReady(page));
            } else {
              console.log('Single column');
            }
          }
        }
      }
    }
  }

  firstLoop(tpage, callback) {
    this._cmsService.incrementKid(this._cmsService.pageSelected._id);
    this._cmsService.insertPage(tpage).subscribe((resz) => callback(resz));
  }

  createFolderAndcopy(tpage) {
    var vmser = this._cmsService;
    var arrz = this.tmparray;
    this.firstLoop(tpage, function (mediaId) {
      vmser.createAssetFolderItem('content', mediaId._id);
      var arrs = arrz.split(',');
      setTimeout(function () {
        vmser.copyfile(mediaId._id, arrs[0], arrs[1]).subscribe();
      }, 1000);

      setTimeout(function () {
        document
          .getElementById('rowli_' + mediaId.parent)
          .setAttribute('data-kids', 'off');
        document.getElementById('tabrowl_' + mediaId.parent).click();
      }, 2000);
    });
  }

  insert_newlist() {
    var nval = (<HTMLInputElement>document.getElementById('insertListvalue'))
      .value;
    if (!nval) {
      if (nval != '') {
        if (this.linesseperateby == 'n') {
          var items = nval.split('\n');
        } else {
          var items = nval.split(';');
        }

        if (items.length > 1) {
          var parent = this._cmsService.pageSelected._id;
          var tvisible = this.insertListVisible;
          var tsecure = this.insertListSecure;
          var tobject = this.insertListObject;
          for (var i = 0; i < items.length; i++) {
            if (items[i] != '') {
              var tpage = new Page();
              tpage.title = items[i];
              tpage.parent = parent;
              tpage.visible = tvisible;
              tpage.secure = tsecure;
              tpage.objectType = tobject;
              tpage.treelevel = this._cmsService.pageSelected.treelevel + 1;

              this._cmsService
                .insertPage(tpage)
                .subscribe((page) => this.newPageReady(page));
              var tval = parseInt(
                document.getElementById('rowcell_' + tpage.parent).innerHTML
              );
              document.getElementById('rowcell_' + tpage.parent).innerHTML =
                '' + (tval + 1);
            }
          }
        }
      }
    }
  }

  delete_upload_file(file) {
    this._mediaService
      .destroyMedia(file)
      .subscribe((status) => this.getImageData());
  }

  getImageData() {
    this._mediaService.getImages().subscribe((data) => (this.newMedia = data));
  }

  closeMessageAlert() {
    document
      .getElementById('messagesAlert')
      .setAttribute('class', 'hidden messages');
  }

  checkImageTab() {
    if (this._cmsService.pageSelected.media.length > 0) {
      document.getElementById('itab_2').setAttribute('class', 'tab');
    } else {
      document.getElementById('itab_2').setAttribute('class', 'tab');
    }
  }

  upsertProperty(prop) {
    this._cmsService.upsertPage(prop);
  }

  datatypeChange(event) {
    if (event == 'Object') {
      document.getElementById('objectdiv').style.display = 'block';
    } else {
      document.getElementById('objectdiv').style.display = 'none';
    }
  }

  inputtypeChange(event) {
    if (event == 'Object') {
      document.getElementById('objectdiv').style.display = 'block';
    } else {
      document.getElementById('objectdiv').style.display = 'none';
    }
    let divs = document.getElementsByClassName('inputPreview');
    for (let i = 0; i < divs.length; i++) {
      divs[i].classList.add('hidden');
    }
    document.getElementById('inputLabelPreview').innerHTML = event;
    let ndivs = document.getElementById(event + 'Preview');
    ndivs.classList.remove('hidden');
  }

  onSubmit() {
    if (this._userService.getUserLoggedIn() == true) {
      if (
        this._cmsService.mustLogIn == false ||
        this._userService.user_current.userRole > 29
      ) {
        var tmppage = this.prepareSavePage();
        //console.log(tmppage);
        if (tmppage._id != '') {
          this._cmsService
            .updatePage(tmppage)
            .subscribe((res) => this.updatePageReady(res));
        } else {
          this._cmsService
            .insertPage(tmppage)
            .subscribe((page) => this.newPageReady(page));
          var tval = parseInt(
            document.getElementById('rowcell_' + tmppage.parent).innerHTML
          );
          document.getElementById('rowcell_' + tmppage.parent).innerHTML =
            '' + (tval + 1);
          this._messageService.SetAlertInfo('Page inserted succesfully');
        }
      } else {
        this._messageService.SetAlertDanger('Insufficient rights.');
      }
    } else {
      this._messageService.SetAlertDanger('Insufficient rights. Please login');
    }
  }

  updatePageReady(page: Page) {
    this._cmsService.setPageSelected(page);
    this._cmsService.resetParentCmsSubPage(page);
    //let a = -1;
    // if (this._cmsService.subpages) {
    //   a = this._cmsService.subpages
    //     .map(function (e) {
    //       return e._id;
    //     })
    //     .indexOf(page._id);
    // }
    // if (a != -1) {
    //   var d = this._cmsService.pages
    //     .map(function (e) {
    //       return e._id;
    //     })
    //     .indexOf(page._id);
    //   if (d != -1) {
    //     this._cmsService.pages[d] = page;
    //   } else {
    //     document
    //       .getElementById('rowli_' + page.parent)
    //       .setAttribute('data-kids', 'off');
    //   }
    // } else {
    //   var b = this._cmsService.pageRoot.cmsSubPages
    //     .map(function (e) {
    //       return e._id;
    //     })
    //     .indexOf(page._id);
    //   if (b != -1) {
    //     this._cmsService.pageRoot.cmsSubPages[b] = page;
    //   } else {
    //     if (this._cmsService.parentPage.cmsSubPages) {
    //       var c = this._cmsService.parentPage.cmsSubPages
    //         .map(function (e) {
    //           return e._id;
    //         })
    //         .indexOf(page._id);
    //       this._cmsService.parentPage.cmsSubPages[c] = page;
    //     }
    //   }
    // }
    this._messageService.SetAlertSuccess(page.title + ' saved succesfully');
  }

  newPageReady(page: Page) {
    this._cmsService
      .getcms(page._id)
      .subscribe((res) => this.newPageReadySet(res));
  }

  newPageReadySet(page) {
    this._cmsService.incrementKid(page.parent);
    this._cmsService.createAssetFolderItem('content', page._id);

    this._cmsService.setPageSelected(page);
    this._cmsService.subpages.unshift(page);
  }

  paready(parent) {
    this._cmsService
      .getPages(parent._id)
      .subscribe((result) => this._cmsService.addItem(parent, result));
  }

  pageredd(page, parent) {
    document
      .getElementById('rowli_' + parent._id)
      .setAttribute('data-kids', 'off');
    this._cmsService
      .getPages(parent._id)
      .subscribe((result) => this._cmsService.addItem(parent, result));
  }

  cmsInsertReturn(prop) {
    var testje = document.getElementById('propertyselect') as HTMLSelectElement;
    this._cmsService.properties.push(prop);
    testje.selectedIndex = this._cmsService.properties.length + 1;

    this._cmsService
      .getPropertiesList()
      .subscribe((pagde) => this.savePropertyReady(pagde));
  }

  cmsUpdateReturn(prop) {
    this._cmsService
      .getPropertiesList()
      .subscribe((pagde) => this.savePropertyReady(pagde));
  }

  saveProperty() {
    var newi = this.prepareSaveProperty();
    var lab = newi.labels;
    var val = newi.values;
    if (lab.length > 0) {
      var reza = lab.split(',');
      var rela = val.split(',');
      newi.valuesarr = [];
      newi.labelsarr = [];
      for (var j = 0; j < reza.length; j++) {
        newi.valuesarr.push(reza[j]);
        newi.labelsarr.push(rela[j]);
      }
    }
    //console.log(newi);
    if (newi._id == '') {
      newi.required = true;
      this._cmsService
        .insertCmsObject(newi)
        .subscribe((result) => this.cmsInsertReturn(result));
    } else {
      //console.log(newi);
      this._cmsService
        .updateCmsObject(newi)
        .subscribe((page) => this.cmsUpdateReturn(page));
    }
    this._messageService.SetAlertInfo('Property saved succesfully');
  }

  savePropertyReady(props) {
    //this._cmsService.properties = props;
    this._cmsService.resetPropFull();
  }

  removeProperty() {
    document.getElementById('newproperty').style.display = 'none';
    this._cmsService
      .removeProperty(this._cmsService.selectedProperty)
      .subscribe((prop) => this.listAndSelect());
  }

  listAndSelect() {
    this._cmsService
      .getPropertiesList()
      .subscribe((props) => this.setproplist(props));
  }

  setproptest(vare) {
    this._cmsService
      .getProperty(vare)
      .subscribe((prop) => this.setproptestReady(prop));
  }

  setproptestReady(vare) {
    this._cmsService.SetselectedProperty(vare);
    this.propertyselect = vare._id;
  }

  setproplist(props) {
    //this._cmsService.properties = props;
    this.Setpropertyselect();
  }

  Setpropertyselect() {
    if (this._cmsService.selectedProperty)
      this.propertyselect = this._cmsService.selectedProperty._id;
  }

  getPropertiesList() {
    this._cmsService
      .getPropertiesList()
      .subscribe((props) => console.log(props));
  }

  ShowMessageAlert() {
    document.getElementById('messagesAlert').setAttribute('class', 'messages');
  }

  HideMessageAlert() {
    document
      .getElementById('messagesAlert')
      .setAttribute('class', 'hidden messages');
  }

  getPagesReady(pages) {
    this._cmsService.setPages(pages);
    this._cmsService.pages.unshift(this._cmsService.pageRoot);
  }

  checkDeleteButton(page) {
    var element = document.getElementsByClassName('btndeletePage');
    if (element.length > 0) {
      if (page.secure == true) {
        for (var i = 0; i < element.length; i++) {
          element[i].setAttribute('class', 'hidden btndeletePage');
        }
      } else if (this._userService.isUserLoggedIn == false) {
        for (var i = 0; i < element.length; i++) {
          element[i].setAttribute('class', 'btn btndeletePage');
        }
      } else {
        for (var i = 0; i < element.length; i++) {
          element[i].setAttribute('class', 'btn btn-danger btndeletePage');
        }
      }
    }
  }

  updateParentKids(data, kids) {
    data.kids = kids;
    this.updatePageEvent.emit({ edited: data });
  }

  saveNewReady(data: any) {
    this._cmsService.setPageSelected(data);
    this._cmsService.incrementKid(data.parent);
    this._cmsService.getPages(this.rootId);
  }

  addImage() {
    var test = new Media();
    this.secretImages.push(this.fb.group(test));
    document.getElementById('addImageButton').className = 'no_display';
    document.getElementById('cancelImageButton').className = 'btn btn-primary';
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.properties, event.previousIndex, event.currentIndex);
    this._cmsService.pageSelected.properties = [];
    this.properties.forEach(async (prop) => {
      this._cmsService.pageSelected.properties.push(prop._id);
    });
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((page) => this.updatePageReadyb(page));
  }

  onFilter() {
    var element = document.getElementsByClassName('pagefilter');
    this._cmsService.pageSelected.filter = [];
    for (var i = 0; i < element.length; i++) {
      var nvar = element[i].getAttribute('id').replace('pfilter_', '');
      this._cmsService.pageSelected.filter.push(nvar);
    }
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((page) => console.log(page));
  }

  updateFilterButton(event) {
    if (event != '') {
      document.getElementById('filterDataSelect').classList.remove('hidden');
      this._cmsService.cmsFields = [];
      var temo = {};
      if (event.target.value == 'Address') {
        temo = new Address();
      } else if (event.target.value == 'Audio') {
        temo = new Audio();
      } else if (event.target.value == 'Cmspipe') {
        temo = new CmsPipe();
      } else if (event.target.value == 'Media') {
        temo = new Media();
      } else if (event.target.value == 'MediaImage') {
        temo = new MediaImage();
      } else if (event.target.value == 'mediaId') {
        temo = new mediaId();
      } else if (event.target.value == 'Object') {
        temo = new Object();
      } else if (event.target.value == 'User') {
        temo = new User();
      } else if (event.target.value == 'Video') {
        temo = new Video();
      }
      var objectMerged = {};
      if (event.target.value == 'Cms') {
        objectMerged = Object.assign(new Page());
      } else {
        objectMerged = Object.assign(new Page(), temo);
      }
      this.dataObject = objectMerged;
      this.objectProps = Object.keys(this.dataObject).map((prop) => {
        return Object.assign({}, { key: prop }, this.dataObject[prop]);
      });
      for (let prop of Object.keys(this.dataObject)) {
        this._cmsService.cmsFields.push(prop);
      }
    } else {
      document.getElementById('filterDataSelect').classList.add('hidden');
    }
  }

  ListToLabelsAndValues(event) {
    var selVal = event.target.value;
    if (selVal != '') {
      this._cmsService
        .getPages(selVal)
        .subscribe((res) => this.ListToLabelsAndValuesReady(res, selVal));
    }
  }

  ListToLabelsAndValuesReady(pages, selVal) {
    var ttt = '';
    //console.log(pages);
    for (var j = 0; j < pages.length; j++) {
      if (selVal == '5c0c15dac3982b0da0ecbc26') {
        // countries
        ttt += pages[j].schemaextend[0].ISO;
        if (j < pages.length - 1) {
          ttt += ',';
        }
      } else {
        ttt += pages[j]._id;
        if (j < pages.length - 1) {
          ttt += ',';
        }
      }
    }
    (<HTMLInputElement>document.getElementById('values')).value = ttt;
    //(<HTMLInputElement>document.getElementById('valuesarr')).value = ttt;
    var ttt = '';
    for (var j = 0; j < pages.length; j++) {
      ttt += pages[j].title;
      if (j < pages.length - 1) {
        ttt += ',';
      }
    }
    (<HTMLInputElement>document.getElementById('labels')).value = ttt;
    //(<HTMLInputElement>document.getElementById('labelsarr')).value = ttt;
    //console.log(this._cmsService.selectedProperty.title);
    var res = this._cmsService.selectedProperty.values;
    if (res != '') {
      var rez = this._cmsService.selectedProperty.values.split(',');
      //console.log(rez);
      //if (this._cmsService.selectedProperty.labels != '')
      var rel = this._cmsService.selectedProperty.labels.split(',');
      this._cmsService.selectedProperty.valuesarr = [];
      this._cmsService.selectedProperty.labelsarr = [];
      //if (this._cmsService.selectedProperty.labels != '')
      //  this._cmsService.selectedProperty.labelsarr = [];
      if (rez.length > 0) {
        for (var j = 0; j < rez.length; j++) {
          this._cmsService.selectedProperty.valuesarr.push(rez[j]);
          //if (this._cmsService.selectedProperty.labels != '')
          this._cmsService.selectedProperty.labelsarr.push(rel[j]);
        }
        //(<HTMLInputElement>document.getElementById('valuesarr')).value = this._cmsService.selectedProperty.labelsarr;
      }
    }
  }

  updatePreviewInput(event) {
    var inputv = event;
    if (
      event == 'Select' ||
      event == 'SelectWithEmpty' ||
      event == 'SelectMulti'
    ) {
      //document.getElementById('listdiv').classList.remove('hidden');
    } else {
      //document.getElementById('listdiv').classList.add('hidden');
    }
    document.getElementById('valuesLabels').classList.remove('hidden');
    if (event == 'File') {
      document.getElementById('labels').classList.add('hidden');
      document.getElementById('values').classList.remove('form-control50');
      document.getElementById('values').classList.remove('float_r');
      document.getElementById('values').classList.add('form-control');
      document.getElementById('labelvalues').innerHTML = 'Filename';
    } else if (
      event == 'DateTime' ||
      event == 'Datepicker' ||
      event == 'Checkbox' ||
      event == 'Radio' ||
      event == 'SliderToggle' ||
      event == 'Range'
    ) {
      // || event == "Slider"
      document.getElementById('labels').classList.remove('hidden');
      document.getElementById('values').classList.remove('form-control');
      document.getElementById('values').classList.add('form-control50');
      document.getElementById('values').classList.add('float_r');
      document.getElementById('labelvalues').innerHTML = 'Labels / Values';
    } else {
      document.getElementById('labels').classList.remove('hidden');
    }
    var tabfield = document.getElementsByClassName('inputPreview');
    for (var i = 0; i < tabfield.length; i++) {
      tabfield[i].classList.add('hidden');
    }
    document.getElementById('inputLabelPreview').innerHTML = inputv;
    if (inputv == 'Textarea') {
      document.getElementById('TextareaPreview').classList.remove('hidden');
    } else if (inputv == 'Text') {
      document.getElementById('TextPreview').classList.remove('hidden');
    } else if (inputv == 'Checkbox') {
      document.getElementById('CheckboxPreview').classList.remove('hidden');
    } else if (inputv == 'Radio') {
      document.getElementById('RadioPreview').classList.remove('hidden');
    } else if (inputv == 'Select') {
      document.getElementById('SelectPreview').classList.remove('hidden');
    } else if (inputv == 'Datepicker') {
      document.getElementById('DatepickerPreview').classList.remove('hidden');
    } else if (inputv == 'Slider') {
      document.getElementById('SliderPreview').classList.remove('hidden');
    } else if (inputv == 'SliderToggle') {
      document.getElementById('SliderTogglePreview').classList.remove('hidden');
    } else if (inputv == 'SelectMulti') {
      document.getElementById('SelectMultiPreview').classList.remove('hidden');
    } else if (inputv == 'SelectWithEmpty') {
      document
        .getElementById('SelectWithEmptyPreview')
        .classList.remove('hidden');
    } else if (inputv == 'SelectAdd') {
      document.getElementById('SelectAddPreview').classList.remove('hidden');
    } else if (inputv == 'Password') {
      document.getElementById('PasswordPreview').classList.remove('hidden');
    } else if (inputv == 'Color') {
      document.getElementById('ColorPreview').classList.remove('hidden');
    } else if (inputv == 'Email') {
      document.getElementById('EmailPreview').classList.remove('hidden');
    } else if (inputv == 'Number') {
      document.getElementById('NumberPreview').classList.remove('hidden');
    } else if (inputv == 'Range') {
      document.getElementById('RangePreview').classList.remove('hidden');
    } else if (inputv == 'Search') {
      document.getElementById('SearchPreview').classList.remove('hidden');
    } else if (inputv == 'Telephone') {
      document.getElementById('TelephonePreview').classList.remove('hidden');
    } else if (inputv == 'Time') {
      document.getElementById('TimePreview').classList.remove('hidden');
    } else if (inputv == 'URL') {
      document.getElementById('URLPreview').classList.remove('hidden');
    } else if (inputv == 'DateTime') {
      document.getElementById('DateTimePreview').classList.remove('hidden');
    } else if (inputv == 'File') {
      document.getElementById('FilePreview').classList.remove('hidden');
    } else if (inputv == 'Object') {
      document.getElementById('ObjectPreview').classList.remove('hidden');
    }

    if (
      inputv != '' &&
      this._cmsService.propset == true &&
      this._cmsService.selectedProperty.values != undefined
    ) {
      this._cmsService.selectedPropertyValues = [];
      this._cmsService.selectedPropertyLabels = [];
      var res = this._cmsService.selectedProperty.values.split(',');
      if (res.length > 0) {
        var rel = this._cmsService.selectedProperty.labels.split(',');
        for (var i = 0; i < res.length; i++) {
          this._cmsService.selectedPropertyValues.push(res[i]);
          this._cmsService.selectedPropertyLabels.push(rel[i]);
        }
      }
    } else {
      this._cmsService.selectedPropertyValues = [];
      this._cmsService.selectedPropertyLabels = [];
      if (
        this._cmsService.selectedProperty != undefined &&
        this._cmsService.selectedProperty.values.split(',')
      ) {
        var res = this._cmsService.selectedProperty.values.split(',');
        if (res.length > 0) {
          var rel = this._cmsService.selectedProperty.labels.split(',');
          for (var i = 0; i < res.length; i++) {
            this._cmsService.selectedPropertyValues.push(res[i]);
            this._cmsService.selectedPropertyLabels.push(rel[i]);
          }
        }
      } else {
        this._cmsService.selectedPropertyLabels.push(
          this._cmsService.selectedProperty.values
        );
      }
    }
  }
  prepareSaveProperty() {
    const formModel = this.propForm.value;
    const savePage: CmsProperty = {
      _id: formModel._id,
      title: formModel.title as string,
      pname: formModel.pname as string,
      access: formModel.access as string,
      type: formModel.type as string,
      inputtype: formModel.inputtype as string,
      minlength: formModel.minlength as number,
      maxlength: formModel.maxlength as number,
      required: formModel.required as boolean,
      object: formModel.object as string,
      list: formModel.list as string,
      values: formModel.values as string,
      labels: formModel.labels as string,
      labelsarr: formModel.valuesarr,
      valuesarr: formModel.labelsarr,
    };
    return savePage;
  }

  formatAddressToOneLine(addressIndex: number): string {
    let address = this.pageForm.value.secretLairs[addressIndex];
    return address.street + ', ' + address.city + ', ' + address.state;
  }

  save_addAddress() {
    var tmppage = this.prepareSavePage();
    this._cmsService
      .updatePage(tmppage)
      .subscribe((res) => this.updatePageReady(tmppage));
  }

  save_moviegenre() {
    var tmppage = this.prepareSavePage();
    this._cmsService
      .updatePage(tmppage)
      .subscribe((res) => this.updatePageReady(tmppage));
  }

  save_subtitle() {
    var tmppage = this.prepareSavePage();
    this._cmsService
      .updatePage(tmppage)
      .subscribe((res) => this.updatePageReady(tmppage));
  }

  save_photoperson() {
    var tmppage = this.prepareSavePage();
    this._cmsService
      .updatePage(tmppage)
      .subscribe((res) => this.updatePageReady(tmppage));
  }

  prepareSavePage(): Page {
    const formModel = this.pageForm.value;
    var vedss = this._cmsService.pageSelected._id;

    if (formModel.media != undefined) {
      const mediaDeepCopy: [any] = formModel.media.map((media: MediaImage) =>
        Object.assign({}, media)
      );
    }

    const savePage: Page = {
      _id: formModel._id as string,
      parent: (formModel.parent == '0' ? '' : formModel.parent) as string,
      title: formModel.title as string,
      objectType: formModel.objectType as string,
      visible: formModel.visible as boolean,
      secure: formModel.secure as boolean,
      editable: formModel.secure as boolean,
      dateCreated: formModel.dateCreated as Date,
      dateLast: new Date() as Date,
      treelevel: formModel.treelevel as number,
      createdBy: formModel.createdBy as string,
      media: this._cmsService.pageSelected.media,
      kids: formModel.kids,
      listItem: formModel.listItem as boolean,
      pickorder: formModel.pickorder as number,
      properties: formModel.properties,
      schemaextend: [],
      cmsSubPages: [],
      filter: this._cmsService.pageSelected.filter,
      hits: formModel.hits as number,
    };

    if (this._cmsService.pagetpropertiesFull.length > 0) {
      var newNews;

      if (this._cmsService.pageSelected.objectType != '') {
        var a = this._cmsService.sysObjects
          .map(function (e) {
            return e._id;
          })
          .indexOf(this._cmsService.pageSelected.objectType);
        const newObject = {};
        for (let prop of this._cmsService.sysObjects[a].properties) {
          var bb = this._cmsService.pagetpropertiesFull
            .map(function (e) {
              return e._id;
            })
            .indexOf(prop);
          newObject[this._cmsService.pagetpropertiesFull[bb].pname] = '';
        }
        newNews = newObject;
      } else {
        newNews = new Webpage();
      }
      var objectMerged = Object.assign(newNews);
      //console.log(objectMerged);
      this.dataObject = objectMerged;
      const formGroup = {};

      for (let prop of Object.keys(this.dataObject)) {
        let currentProperty;
        let currentType;
        let currentValue;
        for (let i = 0; i < this._cmsService.pagetpropertiesFull.length; i++) {
          if (
            this._cmsService.pagetpropertiesFull[i].pname == prop &&
            this._cmsService.pagetpropertiesFull[i].type != 'Object'
          ) {
            currentProperty = this._cmsService.pagetpropertiesFull[i];
            currentType = this._cmsService.pagetpropertiesFull[i].type;
            if (this._cmsService.pagetpropertiesFull[i].type == 'boolean') {
              if (<HTMLInputElement>document.getElementById(prop))
                currentValue = (<HTMLInputElement>document.getElementById(prop))
                  .value;
              //console.log(currentValue);
            } else {
              if (<HTMLInputElement>document.getElementById(prop))
                currentValue = (<HTMLInputElement>document.getElementById(prop))
                  .value;
            }
          }
        }
        // var propval;
        // if (this.dataObject[prop] != '') {
        //   propval = this.dataObject[prop];
        // } else {
        //   propval = '';
        // }

        if (prop == 'addresses') {
          if (formModel.secretLairs != undefined) {
            const addressesDeepCopy: Address[] = formModel.secretLairs.map(
              (address: Address) => Object.assign({}, address)
            );
            formGroup[prop] = addressesDeepCopy;
          } else {
            formGroup[prop] = [];
          }
        } else if (prop == 'moviegenre') {
          const moviegenreDeepCopy: VideoGenre[] =
            formModel.secretMovieGenre.map((genreId: VideoGenre) =>
              Object.assign({}, genreId)
            );
          if (formModel.secretMovieGenre != undefined) {
            formGroup[prop] = moviegenreDeepCopy;
          } else {
            formGroup[prop] = [];
          }
        } else if (prop == 'subtitles') {
          if (formModel.secretSubtitle) {
            const subtitleDeepCopy: Country[] = formModel.secretSubtitle.map(
              (genreId: Country) => Object.assign({}, genreId)
            );
            if (formModel.secretSubtitle != undefined) {
              formGroup[prop] = subtitleDeepCopy;
            } else {
              formGroup[prop] = [];
            }
          } else {
            formGroup[prop] = [];
          }
        } else if (prop == 'photopersons') {
          if (formModel.secretPhotoPerson.length > 0) {
            const photopersonsDeepCopy: StringID[] =
              formModel.secretPhotoPerson.map((photopersons: StringID) =>
                Object.assign({}, photopersons)
              );
            if (formModel.secretPhotoPerson != undefined) {
              formGroup[prop] = photopersonsDeepCopy;
            } else {
              formGroup[prop] = [];
            }
          } else {
            formGroup[prop] = [];
          }
        } else if (prop == 'filecategory') {
          var options = (<HTMLSelectElement>document.getElementById(prop))
            .selectedOptions;
          var values = Array.from(options).map(({ value }) => value);

          this.selectedOption = (<HTMLSelectElement>(
            document.getElementById(prop)
          )).value;
          formGroup['filecategory'] = values;
        } else if (prop == 'Date') {
          formGroup[prop] = (<HTMLInputElement>(
            document.getElementById(prop)
          )).value;
        } else if (prop == 'DateTime') {
          var ds = '';
          if ((<HTMLInputElement>document.getElementById(prop)).value != null) {
            ds = (<HTMLInputElement>document.getElementById(prop)).value;
          }
          formGroup[prop] = ds;
        } else if (prop == 'file') {
          var file_extend = document.getElementById(prop).getAttribute('title');
          const formData: any = new FormData();
          const files: Array<File> = this.filesToUpload;
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              formData.append('uploads[]', files[i], files[i]['name']);
            }
            var extension = files[0]['name'].split('.').pop();
            var fnamez =
              file_extend +
              '_' +
              this._cmsService.pageSelected._id +
              '.' +
              extension;
            this._cmsService
              .pageupload(formData, fnamez)
              .subscribe((media) => this.upload_ready(media));
          }
          formGroup[prop] = extension;
        } else if (currentType == 'boolean') {
          formGroup[prop] = currentValue;
        } else if (prop == 'string') {
          formGroup[prop] = (<HTMLInputElement>(
            document.getElementById(prop)
          )).value;
        } else {
          var valt = <HTMLInputElement>document.getElementById(prop);
          if (valt != undefined) {
            formGroup[prop] = valt.value;
          } else {
            formGroup[prop] = '';
          }
        }
      }
      //console.log(formGroup);
      savePage.schemaextend[0] = formGroup;
    }
    //console.log(savePage);
    return savePage;
  }

  getImdb() {
    this._cmsService
      .getImdb(this._cmsService.pageSelected)
      .subscribe((res) => this.getImdbReady(res));
  }

  getImdbReady(res) {
    console.log(res);
  }

  toggleSelect(event) {
    var e = event.target.value;
    console.log(e);
  }

  saveFiles() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      formData.append('uploads[]', files[i], files[i]['name']);
    }
    this._mediaService
      .upload(formData)
      .subscribe((media) => this.upload_ready(media));
  }

  upload_ready(media) {}

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  removeAllMediaFromPage() {
    var result = confirm('Remove all files from page');
    if (result) {
      this._cmsService.pageSelected.media = [];
      this._cmsService
        .updatePage(this._cmsService.pageSelected)
        .subscribe((status) => this.removeMediaFromPageReady());
    }
  }

  removeMediaFromPage(index) {
    this._cmsService.pageSelected.media.splice(index - 1, 1);
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((status) => this.removeMediaFromPageReady());
    this._messageService.SetAlertSuccess('All media removed from page');
  }

  removeMediaFromPageReady() {
    this._cmsService.getPages(this.rootId);
  }

  setImages(media: MediaImage[]) {
    const imagesFGs = media.map((image) => this.fb.group(image));
    const imagesFormArray = this.fb.array(imagesFGs);
    this.pageForm.setControl('secretImages', imagesFormArray);
  }

  close_all_menus(blok) {
    document.getElementById('mediaInfo_' + blok._id).style.display = 'none';
    document.getElementById('mediaFav_' + blok._id).style.display = 'none';
    document.getElementById('mediaMenu_' + blok._id).style.display = 'none';
  }

  save(model: Page, isValid: boolean) {
    this.submitted = true;
    this._cmsService.pageSelected = Object.assign({}, model);
  }

  delfolder() {
    this._cmsService
      .deletAssetFolderItem('content', '65e22a398b26f4fcacfe87c1')
      .subscribe();
  }

  destroy() {
    var confirmText =
      'Are you sure you want to delete the object ' +
      this._cmsService.pageSelected.title;
    if (confirm(confirmText)) {
      this._cmsService
        .deletAssetFolderItem('content', this._cmsService.pageSelected._id)
        .subscribe((res) => this.destroyPage(res));
    }
  }

  destroyPage(res) {
    this._cmsService.decrementKid(this._cmsService.pageSelected.parent);
    this._cmsService
      .destroyPage(this._cmsService.pageSelected)
      .subscribe((res) =>
        this.destroyupdatekids(this._cmsService.pageSelected)
      );
  }

  destroyupdatekids(page) {
    document
      .getElementById('rowli_' + page.parent)
      .setAttribute('data-kids', 'off');
    var elem = document.getElementById('rowli_' + page._id);
    elem.parentNode.removeChild(elem);
    window.scrollTo(0, 0);
    document.getElementById('rowli_' + page.parent).click();
    this._cmsService
      .getcms(page.parent)
      .subscribe((res) => this._cmsService.setPageSelected(res));
    this._messageService.SetAlertSuccess(page.title + ' deleted succesfully');
  }

  updatekids(page) {
    document
      .getElementById('rowli_' + page.parent)
      .setAttribute('data-kids', 'off');
    document.getElementById('tabrowl_' + page.parent).click();
    setTimeout(function () {
      document.getElementById('tabrowl_' + page._id).click();
    }, 500);
  }

  settab(tabt, tid) {
    this.clicked = tid;
    var tabfield = document.getElementsByClassName('tabfield ');
    for (var i = 0; i < tabfield.length; i++) {
      tabfield[i].classList.add('hidden');
    }
    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('active');
    myButtonClasses.remove('hidden');
    document.getElementById(tid).classList.remove('hidden');
    if (
      this._cmsService.tabEditCurrent == 'tab_3' &&
      document.getElementById('tab_3').classList.contains('hidden') == false
    ) {
      this._cmsService.tabEditCurrent = 'tab_1';
      document.getElementById('tab_1').classList.remove('hidden');
      document.getElementById('tab_3').classList.add('hidden');
    }
  }

  showSelectFilter(event) {
    var propvar = event.target.value;
    if (event.target.value == 0) {
      this.filterForm = this.fb.group({
        _id: new FormControl(''),
        values: new FormControl(''),
      });
      document.getElementById('addFilterToPageButton').classList.add('hidden');
    } else if (event.target.value != '') {
      document
        .getElementById('addFilterToPageButton')
        .classList.remove('hidden');
      this._cmsService.SetselectedFilter(event.target.value);
      var selfik = (<HTMLInputElement>document.getElementById('valuesId'))
        .value;
      this.filterForm = this.fb.group({
        values: new FormControl(selfik),
      });
    } else {
      document.getElementById('addFilterToPageButton').classList.add('hidden');
    }
  }

  showSelectValue(event) {
    if (!event.target.value) {
      document.getElementById('newproperty').style.display = 'none';
    } else {
      document.getElementById('newproperty').style.display = 'block';
    }
    var propvar = event.target.value;
    if (propvar == 0) {
      this.propForm = this.fb.group({
        _id: new FormControl(''),
        title: new FormControl(''),
        pname: new FormControl(''),
        access: new FormControl(''),
        type: new FormControl(''),
        object: new FormControl(''),
        inputtype: new FormControl(''),
        minlength: new FormControl(''),
        maxlength: new FormControl(''),
        required: new FormControl(''),
        list: new FormControl(''),
        values: new FormControl(''),
        valuesarr: new FormControl(''),
        labels: new FormControl(''),
        labelsarr: new FormControl(''),
      });
      this.checkpropdeletebutton('hide');
    } else if (propvar != '') {
      this.getProperty(propvar);
    }
    this.updatePreviewInput('');
  }

  checkPropInUseReady(answer, event) {
    if (answer.length > 0) {
      document.getElementById('btndeleteProp').classList.add('hidden');
      var tabfield = document.getElementsByClassName('checkreadonly');
      var propinusebytext = 'In use by (' + answer.length + '):<br />';
      for (var i = 0; i < tabfield.length; i++) {
        (<HTMLInputElement>tabfield[i]).readOnly = true;
        tabfield[i].classList.add('readonly');
      }
      for (var i = 0; i < answer.length; i++) {
        propinusebytext += answer[i].title + '<br />';
      }
      (<HTMLInputElement>document.getElementById('propinuseby')).innerHTML =
        propinusebytext;
    } else {
      if (event.target.value == 0) {
        document.getElementById('btndeleteProp').classList.add('hidden');
      } else {
        document.getElementById('btndeleteProp').classList.remove('hidden');
      }
      var tabfield = document.getElementsByClassName('checkreadonly');
      for (var i = 0; i < tabfield.length; i++) {
        (<HTMLInputElement>tabfield[i]).readOnly = false;
        tabfield[i].classList.remove('readonly');
      }
      (<HTMLInputElement>document.getElementById('propinuseby')).innerHTML =
        'Property not in use';
    }
  }

  getFilter(propvar) {
    this._cmsService
      .getFilter(propvar)
      .subscribe((result) => this.selfilready(result));
  }
  selfilready(prop) {
    this._cmsService.SetselectedFilter(prop);
  }

  getProperty(propvar) {
    this._cmsService
      .getProperty(propvar)
      .subscribe((result) => this.selpropready(result));
  }

  // updateCmsObject(id) {
  //   var vard = this._cmsService.newsave;
  //   this._http.put('/api/cmsobject/' + id, vard);
  // }

  propertyUsedBy(propid) {
    this._cmsService
      .listPropertyUsedBy(propid)
      .subscribe((result) => this.propertyUsedByReady(result));
  }

  propertyUsedByReady(res) {
    this._cmsService.propertyInUseBy = res;
  }

  selpropready(prop) {
    this._cmsService.SetselectedProperty(prop);
    this.setpropselectionform();
    this.updatePreviewInput(prop.inputtype);
    this.propertyUsedBy(prop._id);

    if (prop.type == 'Object') {
      document.getElementById('objectdiv').classList.remove('hidden');
    } else {
      document.getElementById('objectdiv').classList.add('hidden');
    }
  }

  checkPropInUse(propid) {
    this._cmsService
      .checkPropInUse(propid)
      .subscribe((page) => this.propInUseBy(page));
  }

  propInUseBy(page) {
    console.log(page);
    this._cmsService.propInUseBy = page;
    this.checkpropdeletebutton(page);
  }

  checkpropdeletebutton(page) {
    if (page == '') {
      document.getElementById('btndeleteProp').classList.remove('hidden');
    }
  }

  addPropertyToPage() {
    if (this._cmsService.selectedProperty._id != '') {
      var propid = this._cmsService.selectedProperty._id;
      if (this._cmsService.pageSelected.properties.length > 0) {
        var a = this._cmsService.pageSelected.properties.indexOf(propid);
        if (a == -1) {
          this.addProperty(propid);
          this._cmsService.propertiesFull.push(
            this._cmsService.selectedProperty
          );
          if (this._cmsService.selectedProperty.type == 'Object') {
            this._cmsService.parentpropObjectFull.push(
              this._cmsService.selectedProperty
            );
          }
        }
      } else {
        this.addProperty(propid);
      }
      this._cmsService.getObjects();
      this._cmsService.resetParentPropFull();
      this._messageService.SetAlertSuccess(
        'Property ' +
          this._cmsService.selectedProperty.title +
          ' added to object'
      );
    } else {
      console.log('Something went wronselectedPropertyg');
    }
  }

  addFilterToPage() {
    var datacolumn = (<HTMLInputElement>document.getElementById('valuesId'))
      .value;
    if (datacolumn != '') {
      if (this._cmsService.pageSelected.filter.length > 0) {
        var a = this._cmsService.pageSelected.filter.indexOf(datacolumn);
        if (a == -1) {
          this.addPropFilter(datacolumn);
        }
      } else {
        this.addPropFilter(datacolumn);
      }
    } else {
      console.log('Something went wrong');
    }
  }

  addPropFilter(column) {
    this._cmsService.SetselectedProperty(column);
    var tmppage = this.prepareSavePage();
    tmppage.filter.push(column);
    this._cmsService
      .updatePage(tmppage)
      .subscribe((page) => this.updatePageReadyb(page));
  }

  updatePageReadyb(page: Page) {
    this._cmsService.setFilters();
  }

  addItem(page) {
    this._cmsService.resetParentPropFull();
  }

  addItemB(res) {
    if (res.length > 0) {
      this._cmsService.parentPage.cmsSubPages = res;
      var newhtl = '';
      var idit = 'tabrowd_' + this._cmsService.parentPage._id;
      if (document.getElementById(idit).classList.contains('hidden') == true) {
        document.getElementById(idit).classList.add('hidden');
      } else {
        document.getElementById(idit).classList.remove('hidden');
        console.log('add hidden');
      }
    }
  }

  setpropselectionform() {
    this.propForm = this.fb.group({
      _id: this._cmsService.selectedProperty._id,
      title: this._cmsService.selectedProperty.title,
      pname: this._cmsService.selectedProperty.pname,
      access: this._cmsService.selectedProperty.access,
      type: this._cmsService.selectedProperty.type,
      object: this._cmsService.selectedProperty.object,
      inputtype: this._cmsService.selectedProperty.inputtype,
      minlength: this._cmsService.selectedProperty.minlength,
      maxlength: this._cmsService.selectedProperty.maxlength,
      required: this._cmsService.selectedProperty.required,
      list: this._cmsService.selectedProperty.list,
      values: this._cmsService.selectedProperty.values,
      valuesarr: this._cmsService.selectedProperty.values,
      labels: this._cmsService.selectedProperty.labels,
      labelsarr: this._cmsService.selectedProperty.labels,
    });
  }

  addProperty(propertyid) {
    this._cmsService.pageSelected.properties.push(propertyid);
    var iuy = this._cmsService.selectedProperty;
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((page) => this.updatePageReadyc(page));
  }

  updatePageReadyc(page: Page) {
    var iuy = this._cmsService.selectedProperty;
  }

  addFilter(column) {
    this._cmsService.SetselectedProperty(column);
    var tmppage = this.prepareSavePage();
    tmppage.filter.push(column);
    this._cmsService
      .updatePage(tmppage)
      .subscribe((page) => this.updatePageReady(page));
  }

  setprop(iuy) {
    this.setpropselectionform();
  }

  clearProperties() {
    this._cmsService.pageSelected.properties = [];
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((page) => this.updatePageReady(page));
  }

  removeFilterFromPage() {
    this._cmsService.pageSelected.filter = [];
    this._cmsService
      .updatePage(this._cmsService.pageSelected)
      .subscribe((page) => this.updatePageReadyb(page));
  }

  clearFilters() {
    this._cmsService.pageSelected.filter = [];
    this._cmsService.currentCmsFilters = [];
    this._cmsService.updatePage(this._cmsService.pageSelected).subscribe();
  }

  CreateClassFile() {
    this._cmsService.createSchemaExtensionFile();
  }

  mouseEnter(div: string) {
    console.log('mouse enter : ' + div);
  }

  mouseLeave(div: string) {
    console.log('mouse leave :' + div);
  }

  removePropertyFromPage(propid) {
    var propdel = this._cmsService.propertiesFull[propid].title;
    this._cmsService.pageSelected.properties.splice(propid, 1);
    this.properties.splice(propid, 1);
    this._cmsService.updatePage(this._cmsService.pageSelected).subscribe();
    this._cmsService.getObjects();
    this._cmsService.resetParentPropFull();
    this._messageService.SetAlertSuccess(
      'Property ' + propdel + ' removed from object'
    );
  }

  pagerevert() {
    console.log(' pagerevert');
    this.createForm();
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

  openFile(filename) {
    window.open(filename);
  }

  spacetrip(val) {
    val.replaceAll(' ', '_');
    return val;
  }

  deleteFile(filename, fileid) {
    var confirmText = 'Are you sure you want to delete the file ' + filename;
    if (confirm(confirmText)) {
      let fid = this._cmsService.pageSelected._id;
      this._cmsService.filedelete(fid, filename).subscribe();
      (<HTMLInputElement>document.getElementById(fileid)).disabled = false;
      document.getElementById('content_' + fileid).innerHTML = '';
      document.getElementById('filetypei' + fileid).classList.add('hidden');
      document.getElementById('button_' + fileid).classList.add('hidden');
      document.getElementById(fileid).classList.remove('hidden');
      (<HTMLInputElement>document.getElementById(fileid)).value = '';
      this._messageService.SetAlertSuccess('File deleted succesfully');
      return true;
    } else {
      return false;
    }
  }

  fileUpload(nameExtension, fileId) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      if (files[i] != undefined)
        formData.append('uploads[]', files[i], files[i]['name']);
    }

    this._cmsService
      .upload(formData, nameExtension)
      .subscribe((result) => this.uploadResult(result, fileId));

    document.getElementById(fileId).setAttribute('value', '');
  }

  uploadResult(result, fileId) {
    if (result == true) {
      this._messageService.SetAlertSuccess('File Upload succesful');
      this._cmsService.setPageSelected(this._cmsService.pageSelected);
      (<HTMLInputElement>document.getElementById(fileId)).value = '';
      (<HTMLInputElement>(
        document.getElementById('button_' + fileId)
      )).classList.add('hidden');
    }
  }

  fileCheck(fileInput: any) {
    console.log('fileCheck');
    var userImageContents = '';
    var extenid = fileInput.target.id + '_extension';
    var inputId = fileInput.target.id;
    var inputValues = fileInput.target.title;
    document.getElementById('filetypei' + inputId).classList.add('hidden');
    document.getElementById('content_' + inputId).innerHTML = '';

    if (fileInput.target.files) {
      document.getElementById('button_' + inputId).classList.remove('hidden');
      this.filesToUpload = <Array<File>>fileInput.target.files;
      if (this.filesToUpload.length > 0) {
        for (let i = 0; i < fileInput.target.files.length; i++) {
          var file = fileInput.target.files[i];
          var url = window.URL.createObjectURL(file);
          var extension = file.name.replace(/^.*\./, '');
          var size = this.humanfilesize(file.size, '', 0);
          var fname = file.name.replace(/\.[^/.]+$/, '');
          userImageContents = document.getElementById(
            'filetypei' + inputId
          ).innerHTML;
          document
            .getElementById('filetypei' + inputId)
            .classList.remove('hidden');
          if (extension == 'mp4') {
            var video: any = document.createElement('video');
            video.src = url;
            video.id = 'mainmov';
            video.controls = true;
            video.setAttribute('width', '100%');
            video.setAttribute('class', 'video');

            var track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = 'English';
            track.srclang = 'en';
            track.id = 'enTrack';
            track.default = true;
            track.src =
              '/api/assets/content/' +
              this._cmsService.pageSelected._id +
              '/GB.vtt';
            //video.appendChild(track);

            document
              .getElementById('filetypei' + inputId)
              .classList.remove('hidden');
          } else if (
            extension == 'jpg' ||
            extension == 'gif' ||
            extension == 'png'
          ) {
            var img = new Image();
            img.src = url;
            document.getElementById('content_' + inputId).innerHTML +=
              '<div><a class="thumbnail"><img src="' +
              url +
              '" alt="" /></a><br /><div class="padding_6">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '<br />Resolution:<span class="res"></span></div>';
            (<HTMLInputElement>(
              document.getElementById(inputId + '_extension')
            )).value = extension;
            var cdiw = document.getElementsByClassName(inputId);
            for (var c = 0; c < cdiw.length; c++) {
              cdiw[c].classList.remove('hidden');
            }
            document
              .getElementById('filetypei' + inputId)
              .classList.remove('hidden');
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
            document
              .getElementById('filetypei' + inputId)
              .classList.remove('hidden');
            document.getElementById('content_' + inputId).innerHTML = cont;
          } else if (extension == 'srt') {
            document
              .getElementById('filetypei' + inputId)
              .classList.remove('hidden');
            document.getElementById('content_' + inputId).innerHTML =
              '<div class="paddinger9"><a class="thumbnail" title="' +
              url +
              '">Srt file</a></div>';
          } else {
            document
              .getElementById('filetypei' + inputId)
              .classList.remove('hidden');
            document.getElementById('content_' + inputId).innerHTML =
              '<a class="thumbnail" title="' +
              url +
              '"><img src="/api/images/filetypeicons/' +
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
  }

  getVideoDimensionsOf(url, callback) {
    let video = document.createElement('video');
    video.src = url;
    video.addEventListener('loadedmetadata', function () {
      let height = this.videoHeight;
      let width = this.videoWidth;
      var res = width + 'x' + height;
      callback(res);
    });
  }
}
