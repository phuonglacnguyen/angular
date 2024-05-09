import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Page } from './../../models/page';
import { CmsObject } from './../../models/object';
import { CmsProperty } from './../../models/property';
import { News } from './../../models/bots/News';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CmsPipe } from './../../models/cmspipe';
import { Media } from './../../models/media';
import { Files } from './../../models/bots/Files';
import { Address } from './../../models/address';
import { UserService } from './../services/user.service';
import { FileUpload } from './../../models/file-upload';
import { environment } from './../../environments/environment';

@Injectable()
export class CmsService {
  allpages: Array<Page> = [];
  pages: Array<Page> = [];
  properties: Array<CmsProperty> = [];
  pipes: Array<CmsPipe> = [];
  propertiesFull: Array<CmsProperty> = [];
  filterFull: Array<CmsProperty> = [];
  filterObjectFullPage: Array<any> = [];
  parentPage: Page = new Page();
  parents: Array<Page> = [];
  childPage: Page = new Page();
  parentfilterFull: Array<CmsProperty> = [];
  parentfilterObjectFull: Array<CmsProperty> = [];
  parentfilterDataType = [];
  pagetpropertiesFull: Array<CmsProperty> = [];
  parentpropObjectFull: Array<CmsProperty> = [];
  parentpropertiesDataType = [];
  subpages: Array<Page> = [];
  sysObjects: Array<Page> = [];
  propertyInUseBy: Array<Page> = [];
  lists: Array<Page> = [];
  pageSelected: Page = new Page();
  pageSelectedIndex: number = 0;
  pageSelectedEditable: boolean = false;
  pageIsset = false;
  PageSelectedAddMediaId: string;
  pageRoot: Page = new Page();
  treelevels: Array<Page> = [];
  treelevel_ids = ['5a111233aaa94d061a93e719'];
  current_row: number = 1;
  current_rowID: string = '';
  pageProperties = {};
  pageKroperties = {};
  models: Array<string> = [];
  cmsFields = [];
  pagetext = '';
  model: Array<string> = [];
  listAutoImage: boolean = false;
  pageForm: FormGroup;
  propset: boolean = false;
  filterset: boolean = false;
  selectedFilter: string;
  selectedProperty: CmsProperty = new CmsProperty();
  selectedPropertyValues: Array<string> = [];
  selectedPropertyLabels: Array<string> = [];
  propInUseBy: Array<Page> = [];
  countries: Array<Page> = [];
  setbots: Array<string> = [];
  objectProps: Array<string> = [];
  dataObject: Page = new Page();
  prevslices: string;
  prevslicee: string;
  prevslicep: string;
  prevslice_rowID: string;
  datakids: string;
  emitTreeLevels: boolean = true;
  pageSecure: boolean = false;
  // addressObjecArr: Array<string> = [
  //   'street',
  //   'city',
  //   'state',
  //   'zip',
  //   'country',
  // ]; // ['street', 'city', 'state', 'zip', 'country'];
  mustLogIn: boolean = false;
  filesToUploadInfo: Array<FileUpload> = [];
  filesToUpload: Array<File> = [];
  errors: Array<string> = [];
  fileExt: string = 'SRT, MP4, mp3, MOV, AVI, JPG, GIF, PNG, VTT';
  maxFiles: number = 5;
  maxSize: number = 5; // 5MB
  pagefiles: Array<File> = [];
  tabEditCurrent: string = 'tab_1';
  propForm: FormGroup;
  filterForm: FormGroup;
  addressez: Array<Address> = [];
  photopersons: Array<Page> = [];
  currentFilters: Array<CmsObject> = [];
  currentCmsFilters: Array<CmsProperty> = [];
  filter_firstletter: string = '';
  currentPage: Page = new Page();
  dropzone: string = '';
  fileAlbums: Array<Page> = [];
  photoAlbums: Array<Page> = [];
  fileCategorys: Array<Page> = [];
  movieGenres: Array<Page> = [];
  filesSchemaExtendFields = [];
  SystemLists: Array<Page> = [];
  menuList: Array<Page> = [];
  chkAssetFolder: boolean = false;
  _baseURL: string = '/api/';
  treeid: string;
  musicGenres: Array<Page> = [];
  artists: Array<Page> = [];
  allItems2: Array<Page> = [];
  allItems3: Array<Page> = [];
  allItems4: Array<Page> = [];
  pagedItems2: Array<Page> = [];
  pagedItems3: Array<Page> = [];
  pagedItems4: Array<Page> = [];
  allItems: Array<Page> = [];
  pagedItems: Array<Page> = [];
  treelevelfile: Array<Page> = [];
  pager;
  pager2;
  pager3;
  pager4;
  browseindex: string = 'false';
  videoPlaying: boolean = false;
  contextloop: boolean = false;
  timer = [];
  id: string;
  totalscan: number = 0;
  convertedMovies: Array<Page> = [];
  convertcount: number = 0;
  totalConversionTime: number = 0;
  conversionParents: Array<string> = [];
  conversionCommands = '';
  conversionIds = [];
  listCheckboxCounter: number = 0;
  listCheckboxInfo: string = '';
  videoLength: number = 0;
  loadChildComponent: boolean = false;
  songArray = [];
  albumArray = [];
  moviesFavArray = [];
  favArray = [];
  urlHistoryArray = [];

  pageSelectedUpdated = new EventEmitter<Page>();
  treeLevelsUpdated = new EventEmitter<Array<Page>>();
  pagesUpdated = new EventEmitter<Array<Page>>();
  GetpagesUpdated = new EventEmitter<Array<Page>>();
  updateLoginEvent = new EventEmitter<'true'>();

  constructor(
    public fb: FormBuilder,
    private _http: HttpClient,
    private http: HttpClient,
    public router: Router,
    public _userService: UserService
  ) {
    let dhis = this;
    this.getMenuLists();

    // setTimeout(function () {
    //   if (
    //     dhis.router.url.includes('cms/') &&
    //     (dhis.pages.length == 0 || dhis.photopersons.length == 0)
    //   ) {
    //     console.log(dhis.router.url.includes('cms/'));
    //     dhis.systemLists();
    //   }
    // }, 1000);

    this.getcms('5a111233aaa94d061a93e719').subscribe((result) =>
      this.getRootReady(result)
    );

    //this.updateLoginEvent.subscribe((pageSelected: Page) => ());
  }

  systemLists() {
    console.log('systemLists');
    this.getSystemLists();
    this.getMusicGenres();
    this.getObjects();
    this.getFileCategorys();
    this.getMovieGenres();
    this.getCountries();
    //this.getFileAlbums();
    this.getPhotoAlbums();
    this.getFileSchemaExtends();

    this.getPersons();
    this.getArtist();
    this.getListParents();
    this.getPropertys();
  }

  getListParents() {
    this.ListParents2().subscribe((res) => (this.parents = res));
  }

  ListParents2() {
    return this._http.get<Array<Page>>(
      environment.API_URL + '/api/getListParents'
    );
  }

  getArtist() {
    this.getPages('5c35264fecfbd41448ff71ad').subscribe(
      (result) => (this.artists = result)
    );
  }

  getListNeeded() {
    this.getSystemLists();
  }

  getMusicGenres() {
    this.getPages('5c352927ecfbd41448ff71b6').subscribe((result) =>
      this.getMusicGenresReady(result)
    );
  }

  getMusicGenresReady(id) {
    this.musicGenres = id;
  }

  getSystemLists() {
    this.getPages('5a3cfe3e8e89191f15ed3491').subscribe((result) =>
      this.getSystemListsReady(result)
    );
  }

  getSystemListsReady(result: Array<Page>) {
    this.SystemLists = result;
  }

  getPersons() {
    this.getPages('5bf3d96b005d272d4415722b').subscribe((result) =>
      this.getPersonsReady(result)
    );
  }

  getPersonsReady(res: Array<Page>) {
    this.photopersons = res;
  }

  getFileCategorys() {
    this.getPages('5a8d774e5d45d733c8e02d55').subscribe(
      (result) => (this.fileCategorys = result)
    );
  }

  getMovieGenres() {
    this.getPagesByTitle('5c0150ee962a560534e3e577').subscribe(
      (result) => (this.movieGenres = result)
    );
  }

  getFileAlbums() {
    this.getPages('5bd98ed90737ae272c7aa6bd').subscribe(
      (result) => (this.fileAlbums = result)
    );
  }

  getCountries() {
    this.getPages('5c0c15dac3982b0da0ecbc26').subscribe((result) =>
      this.setCountries(result)
    );
  }

  setCountries(res) {
    this.countries = res;
  }

  getPhotoAlbums() {
    this.getPages('5bf9cd3ce2776742d808319c').subscribe(
      (result) => (this.photoAlbums = result)
    );
  }

  getFileSchemaExtends() {
    var objectMerged = Object.assign(new Files());
    this.dataObject = objectMerged;
    this.objectProps = Object.keys(this.dataObject).map((prop) => {
      return Object.assign({}, { key: prop }, this.dataObject[prop]);
    });
    var dato = this.dataObject;
    for (let prop of Object.keys(dato)) {
      var valu = this.dataObject[prop] + '';
      var rele = valu.split(',');
      var valu = this.dataObject[prop].labelsarr + '';
      var lstlabel = [];
      var lstid = [];
      for (var i = 0; i < rele.length; i++) {
        var valw = rele[i].split('=>');
        lstlabel.push(valw[0]);
        lstid.push(valw[1]);
      }
      this.filesSchemaExtendFields.push({
        value: prop,
        labels: lstlabel,
        labelsid: lstid,
      });
    }
  }

  getListByName(name: string) {
    return this._http
      .get(environment.API_URL + '/api/getListByName/' + name)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getObjects() {
    this.getPages('5a3cf9378e89191f15ed348f').subscribe((result) =>
      this.getObjectsReady(result)
    );
  }

  getObjectsReady(res) {
    this.sysObjects = res;
  }

  resetDynamicTabs() {
    if (
      document.getElementById('moreTab3').classList.length > 0 &&
      document.getElementById('moreTab3').classList.contains('active') ==
        true &&
      this.parentPage.properties.length == 0
    ) {
      document.getElementById('moreTab3').classList.remove('active');
      document.getElementById('tabtext').classList.add('active');
      document.getElementById('tab_1').classList.remove('hidden');
      document.getElementById('tab_3').classList.add('hidden');
    }
  }

  checkAssetFolder(assetfolder: string) {
    return this._http
      .get<boolean>(
        environment.API_URL +
          '/api/checkAssetFolder/' +
          assetfolder +
          '/' +
          this.pageSelected._id
      )
      .pipe(map((response) => response));
  }

  createAssetFolder(assetfolder: string) {
    return this._http
      .get(
        environment.API_URL +
          '/api/createAssetFolder/' +
          assetfolder +
          '/' +
          this.pageSelected._id
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createAssetFolderItem(assetfolder: string, id: string) {
    return this._http
      .get(
        environment.API_URL + '/api/createAssetFolder/' + assetfolder + '/' + id
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  deletAssetFolderItem(assetfolder: string, id: string) {
    return this._http
      .get(
        environment.API_URL + '/api/deleteAssetFolder/' + assetfolder + '/' + id
      )
      .pipe();
  }

  copyfile(id, oldfile: string, newfile: string) {
    return this._http
      .get(
        environment.API_URL +
          '/api/filecopy/' +
          id +
          '/' +
          oldfile +
          '/' +
          newfile
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  copyOldImages(oldid: string, filenam: string) {
    return this._http
      .get(environment.API_URL + '/api/copyoldimages/' + oldid + '/' + filenam)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  copyOldMovieGenres(oldid: string, moviegenres: string) {
    return this._http
      .get(
        environment.API_URL +
          '/api/copyoldmoviegenres/' +
          oldid +
          '/' +
          moviegenres
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  copyOldMovieImdb(oldid: string, imdblink: string) {
    console.log(oldid + ' ' + imdblink);
    return this._http
      .get(
        environment.API_URL + '/api/copyoldmovieimdb/' + oldid + '/' + imdblink
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  deleteAssetFolder(assetfolder: string) {
    return this._http
      .get(
        environment.API_URL +
          '/api/deleteAssetFolder/' +
          assetfolder +
          '/' +
          this.pageSelected._id
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  upload(files: Array<File>, nameExtension: string) {
    return this._http.put(
      environment.API_URL +
        '/api/uploadContent/' +
        nameExtension +
        '/' +
        this.pageSelected._id,
      files
    );
  }

  filedelete(fileId: string, filename: string) {
    return this._http
      .get(
        environment.API_URL + '/api/contentdelete/' + fileId + '/' + filename
      )
      .pipe();
  }

  checkAssetFile(fileN: string, fileId: string, id: string) {
    return this._http
      .get<string>(environment.API_URL + '/api/assetfile/' + id + '/' + fileN)
      .pipe();
  }

  checkAssetFile2(fileN: string, fileId: string, id: string) {
    return this._http
      .get(environment.API_URL + '/api/assetfile2/' + id + '/' + fileN)
      .pipe();
  }

  saveListDeleteImage(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/saveListDeleteImage/' + pageId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createImage(id: string) {
    return this._http
      .get(environment.API_URL + '/api/createImage/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  lengthFromMovie(page: Page) {
    return this._http
      .post(environment.API_URL + '/api/lengthFromMovie', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  convertMovie(page: Page) {
    return this._http
      .put(environment.API_URL + '/api/convertMovie', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  convertAudio(page: Page) {
    return this._http
      .put(environment.API_URL + '/api/convertAudio', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  autoCrop(page: Page, id: string) {
    return this._http.get(environment.API_URL + '/api/cropdetect/' + id).pipe();
  }

  faststartById(id: string) {
    return this._http
      .get(environment.API_URL + '/api/faststart/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  faststart(page: Page) {
    return this._http
      .put(environment.API_URL + '/api/faststart', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createImageById(id: string) {
    return this._http
      .get(environment.API_URL + '/api/createImage/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createImageByIdSeconds(id: string, seconds: number) {
    return this._http
      .get(environment.API_URL + '/api/createImage/' + id + '/' + seconds)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  testMet(fileN: string, inputId: string, id: string) {
    //console.log(fileN + ' ' + inputId + ' ' + id);
    if (fileN != null && id != '') {
      this.checkAssetFile(fileN, '', id).subscribe((res) =>
        this.testMeReady(res, fileN, inputId, id)
      );
    }
  }

  testMeReady(res: string, fileN: string, inputId: string, id: string) {
    //console.log(res + ' fileN ');
    if (res == 'no') {
    } else {
      if (document.getElementById('content_' + inputId))
        document.getElementById('content_' + inputId).innerHTML = '';
      if (document.getElementById('delete_' + inputId))
        document.getElementById('delete_' + inputId).classList.add('hidden');
      if (res == 'no') {
        if (document.getElementById(inputId))
          document.getElementById(inputId).classList.remove('hidden');
        if (document.getElementById('filetypei' + inputId))
          document
            .getElementById('filetypei' + inputId)
            .classList.add('hidden');
        var tabrowl = document.getElementsByClassName('contentthumbbutton');
        for (var i = 0; i < tabrowl.length; i++) {
          tabrowl[i].classList.remove('hidden');
        }
        if (document.getElementById(inputId))
          (<HTMLInputElement>document.getElementById(inputId)).disabled = false;
      } else {
        //console.log(res);
        if (document.getElementById(inputId)) {
          document.getElementById(inputId).classList.add('hidden');
          document.getElementById('button_' + inputId).classList.add('hidden');
          document
            .getElementById('filetypei' + inputId)
            .classList.remove('hidden');
          (<HTMLInputElement>document.getElementById(inputId)).disabled = true;
          //var file = '/api/assets/content/' + id + '/' + fileN + '.' + res;
          if (res == 'mp4') {
            document.getElementById('content_' + inputId).innerHTML =
              `<video style="border-radius: 6px;" width="100%" id="mainmov_` +
              inputId +
              `" controls><source id="mainsource" src="` +
              environment.API_URL +
              `/api/assets/content/` +
              id +
              `/` +
              fileN +
              `.` +
              res +
              `" type = "video/mp4" >
                  <track id="enTrack" src="" label="English" kind="subtitles" srclang="en" default>
                  <track id="nlTrack" src="" label="Dutch" kind="subtitles" srclang="nl"></video>`;
            //console.log(this.pageSelected.schemaextend[0]?.subtitles);
            if (
              this.pageSelected.schemaextend &&
              this.pageSelected.schemaextend[0]?.subtitles.length > 0
            ) {
              let indexGB = this.pageSelected.schemaextend[0].subtitles.find(
                (e) => e.ISO == 'GB'
              );
              if (indexGB != -1) {
                this.checkAssetFile('GB', '', id).subscribe((res) =>
                  this.setsubs(res, 'GB', id)
                );
              }
              let indexNL = this.pageSelected.schemaextend[0].subtitles.find(
                (e) => e.ISO == 'NL'
              );
              if (indexNL != -1) {
                this.checkAssetFile('NL', '', id).subscribe((res) =>
                  this.setsubs(res, 'NL', id)
                );
              }
            }
          } else if (res == 'mp3') {
            document.getElementById('content_' + inputId).innerHTML =
              `<audio #videoPlayer id="player" style="background-color: #F1F3F4;width:100%;border-radius: 0px;margin:0px 0px 0px 0px;" preload="auto" controls>
                  <source #videoSource id="playersource" src=" ` +
              environment.API_URL +
              `/assets/music/Album/` +
              this.pageSelected.schemaextend[0].url.replace('Albums/', '') +
              `" type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>`;
          } else if (res == 'jpg' || res == 'gif' || res == 'png') {
            document.getElementById('content_' + inputId).innerHTML =
              '<img  id="' +
              fileN +
              '_image" src="' +
              environment.API_URL +
              '/api/assets/content/' +
              id +
              '/' +
              fileN +
              '.' +
              res +
              '" alt="" class="contentthumb" /><br /><div id="' +
              fileN +
              '_image_info"></div>';
            let cmss = this;
            setTimeout(function () {
              let image = document.getElementById(fileN + '_image');
              if (image)
                document.getElementById(fileN + '_image_info').innerHTML =
                  '<div class="padding_6">Filename: ' +
                  fileN +
                  '.' +
                  res +
                  '<br />Resolution:' +
                  image.clientWidth +
                  'x' +
                  image.clientHeight +
                  '</div>';
            }, 2000);
          } else {
            document.getElementById('content_' + inputId).innerHTML =
              '<div class="paddinger9"><a href="' +
              environment.API_URL +
              '/api/assets/content/' +
              id +
              '/' +
              fileN +
              '.' +
              res +
              '" target="_blank">Open ' +
              fileN +
              '.' +
              res +
              '</a></div>';
          }
          var tabrowl = document.getElementsByClassName('contentthumbbutton');
          for (var i = 0; i < tabrowl.length; i++) {
            tabrowl[i].classList.remove('hidden');
          }
        }
      }
    }
  }

  setsubs(res: string, name: string, id: string) {
    let filesplit = name.split('.');
    let fileName = filesplit[0];
    let nameconvert = fileName.replace('GB', 'en').toLowerCase();
    if (res != 'no')
      document
        .getElementById(nameconvert + 'Track')
        .setAttribute(
          'src',
          '/api/assets/content/' + id + '/' + filesplit[0] + '.' + res
        );
  }

  toggle_Div(page: string) {
    if (document.getElementById(page).classList.contains('hidden')) {
      document.getElementById(page).classList.remove('hidden');
    } else {
      document.getElementById(page).classList.add('hidden');
    }
  }

  setVideo(res: string, page: Page) {
    if (res != 'no')
      (<HTMLVideoElement>document.getElementById('player')).src =
        'api/assets/content/' + page._id + '/main.' + res;
  }

  freshPage(page: Page) {
    this.resetParentPropFullPage(page);
    if (page.schemaextend && page.schemaextend[0]?.url)
      page.schemaextend[0].url = page.schemaextend[0].url.replace(
        'Albums/',
        ''
      );
    this.setPageSelected(page);
    this.router.navigate(['/cms/' + page._id]);
  }

  listlink(page: Page) {
    if (page.objectType === '661dd36d8be488c2525f500f') {
      setTimeout(function () {
        if (document.getElementById('player'))
          (<HTMLAudioElement>document.getElementById('player')).src =
            'api/assets/music/Albums/' + page.schemaextend[0].url;
        //console.log(page.schemaextend[0].url.replace('Album/', ''));
      }, 1000);
    }
    if (this.browseindex == 'false' || this.browseindex == undefined) {
      this.pagetpropertiesFull = [];
      //this.getcms(page._id).subscribe((res) => this.freshPage(res));
      //this.resetParentPropFullPage(page);
      if (page.schemaextend && page.schemaextend[0]?.url)
        page.schemaextend[0].url = page.schemaextend[0].url.replace(
          'Albums/',
          ''
        );
      this.setPageSelected(page);
      this.router.navigate(['/cms/' + page._id]);
    }
    this.dropzone = 'dropzone_' + page._id;
    var datakids = document
      .getElementById('rowli_' + page._id)
      .getAttribute('data-kids');
    if (page._id == this.pageRoot._id) {
      var tabrowl = document.getElementsByClassName('tabrowl');
      for (var i = 0; i < tabrowl.length; i++) {
        tabrowl[i].classList.remove('active');
      }
      if (datakids == 'out') {
        document
          .getElementById('rowli_' + page._id)
          .setAttribute('data-kids', 'on');
        var tazbfield = document.getElementsByClassName('rowul_' + page._id);
        for (var i = 0; i < tazbfield.length; i++) {
          tazbfield[i].classList.remove('hidden');
        }
      } else if (datakids == 'on') {
        document
          .getElementById('rowli_' + page._id)
          .setAttribute('data-kids', 'off');
        var tazbfield = document.getElementsByClassName('rowul_' + page._id);
        for (var i = 0; i < tazbfield.length; i++) {
          tazbfield[i].classList.add('hidden');
        }
      } else if (datakids == 'off') {
        document
          .getElementById('rowli_' + page._id)
          .setAttribute('data-kids', 'on');
        var tazbfield = document.getElementsByClassName('rowul_' + page._id);
        for (var i = 0; i < tazbfield.length; i++) {
          tazbfield[i].classList.remove('hidden');
        }
      }
      if (
        document
          .getElementById('rowchild_' + page._id)
          .classList.contains('icmn-arrow-down5') == true
      ) {
        document
          .getElementById('rowchild_' + page._id)
          .classList.add('icmn-arrow-right5');
        document
          .getElementById('rowchild_' + page._id)
          .classList.remove('icmn-arrow-down5');
      } else if (
        document
          .getElementById('rowchild_' + page._id)
          .classList.contains('icmn-arrow-right5') == true
      ) {
        document
          .getElementById('rowchild_' + page._id)
          .classList.add('icmn-arrow-down5');
        document
          .getElementById('rowchild_' + page._id)
          .classList.remove('icmn-arrow-right5');
      }
    } else {
      if (page.kids == 0) {
        this.getkidsz(page);
      } else {
        this.getkidz(page);
      }
    }
  }

  onInitChildReady(result: Page) {
    this.childPage = result;
  }

  arrowline(page: Page) {
    if (
      document
        .getElementById('rowchild_' + page._id)
        .classList.contains('icmn-arrow-down5') == true
    ) {
      document
        .getElementById('rowchild_' + page._id)
        .classList.add('icmn-arrow-right5');
      document
        .getElementById('rowchild_' + page._id)
        .classList.remove('icmn-arrow-down5');
    } else if (
      document
        .getElementById('rowchild_' + page._id)
        .classList.contains('icmn-arrow-right5') == true
    ) {
      document
        .getElementById('rowchild_' + page._id)
        .classList.add('icmn-arrow-down5');
      document
        .getElementById('rowchild_' + page._id)
        .classList.remove('icmn-arrow-right5');
    }
  }

  getkidz(page: Page) {
    var datakids = document
      .getElementById('rowli_' + page._id)
      .getAttribute('data-kids');
    if (datakids == 'off' && page.kids > 1) {
      document
        .getElementById('rowli_' + page._id)
        .setAttribute('data-kids', 'on');
      this.getPages(page._id).subscribe((result) => this.addItem(page, result));
      var tazbfield = document.getElementsByClassName('rowul_' + page._id);
      for (var i = 0; i < tazbfield.length; i++) {
        tazbfield[i].classList.remove('hidden');
      }
      this.arrowline(page);
    } else if (datakids == 'out') {
      document
        .getElementById('rowli_' + page._id)
        .setAttribute('data-kids', 'on');
      this.arrowline(page);
      var tazbfield = document.getElementsByClassName('rowul_' + page._id);
      for (var i = 0; i < tazbfield.length; i++) {
        tazbfield[i].classList.remove('hidden');
      }
      this.subpages = page.cmsSubPages;
    } else if (datakids == 'on') {
      document
        .getElementById('rowli_' + page._id)
        .setAttribute('data-kids', 'out');
      this.arrowline(page);
      var tazbfield = document.getElementsByClassName('rowul_' + page._id);
      for (var i = 0; i < tazbfield.length; i++) {
        tazbfield[i].classList.add('hidden');
      }
      //   for (var i = 0; i < page.cmsSubPages.length; i++) {
      //     var id = page.cmsSubPages[i]._id;
      //     if (document.getElementById('chk_' + id)) {
      //       (<HTMLInputElement>document.getElementById('chk_' + id)).checked =
      //         false;
      //       this.listCheckboxCounter--;
      //     }
      //   }
      //   var tabpar = document.getElementsByClassName('Checkboxes');
      //   for (var i = 0; i < tabpar.length; i++) {
      //     var nid = tabpar[i].getAttribute('id').replace('chkpar', '');
      //     if (
      //       document.getElementById('chkpar' + nid).classList.contains('hidden')
      //     ) {
      //       document.getElementById('chk_' + nid).removeAttribute('checked');
      //       this.listCheckboxCounter--;
      //     }
      //   }
    }
  }

  getkidsz(page: Page) {
    this.arrowline(page);
  }

  update_edit_image_fields(page: Page) {
    //console.log('update_edit_image_fields');
    var tabrowl = document.getElementsByClassName('contentFileUpload');
    for (var i = 0; i < tabrowl.length; i++) {
      var tit = tabrowl[i].getAttribute('title');
      var pname = tabrowl[i].getAttribute('id');
      var id = tabrowl[i].getAttribute('data-dir');
      this.testMet(tit, pname, page._id);
    }
  }

  resprope(resprop: CmsProperty) {
    var res = resprop.values;
    if (res != '') {
      if (resprop.labels != '' && resprop.labels != undefined) {
        var rel = resprop.labels.split(',');
        var rez = resprop.values.split(',');
        resprop.labelsarr = [];
        resprop.valuesarr = [];
        if (rez.length > 0) {
          for (var z = 0; z < rez.length; z++) {
            if (rez[z] != '') {
              resprop.labelsarr.push(rel[z].replace(/"/g, ''));
              resprop.valuesarr.push(rez[z].replace(/"/g, ''));
            }
          }
        }
      }
    }
    this.currentCmsFilters.push(resprop);
  }

  respagef(res: Array<Page>) {
    res.unshift(this.pageRoot);
    this.pages = res;
  }

  respage(a: number, i: number, page: Page) {
    this.getPages(page._id).subscribe((result) =>
      this.respagff(i, page, result)
    );
  }

  respagff(i: number, page: Page, result: Array<Page>) {
    page.cmsSubPages = result;
    this.pages[i - 1] = page;
  }

  testparent() {
    if (this.treelevels.length > 0) {
      for (var a = 0; a < this.treelevels.length; a++) {
        for (var i = 0; i < this.pages.length; i++) {
          if (a == 0) {
            this.getPages(this.treelevels[a]._id).subscribe((result) =>
              this.respagef(result)
            );
          } else if (a > 0) {
            if (this.treelevels[a].kids > 0) {
              this.getcms(this.treelevels[a]._id).subscribe((result) =>
                this.respage(a, i, result)
              );
            }
          }
        }
      }
    }
  }

  pageredd(page: Page) {
    this.setPageSelected(page);
    this.resetDynamicTabs();
    this.setFilters();
    this.childPage = new Page();
    if (page.kids > 0) {
      this.getchildcms(page._id).subscribe((result) =>
        this.onInitChildReady(result)
      );
    }
    //this.resetPropFull();
  }

  setFilters() {
    this.currentCmsFilters = [];
    if (this.pageSelected.filter && this.pageSelected.filter.length > 0) {
      var newprop;
      for (var i = 0; i < this.pageSelected.filter.length; i++) {
        newprop = this.pageSelected.filter[i];
        this.getProperty(newprop).subscribe((resprop) =>
          this.resprope(resprop)
        );
      }
    }
  }

  addItemb(page: Page, res: Array<Page>) {
    if (res.length > 0) {
      page.cmsSubPages = res;
    }
    this.getParentSelected(page.parent).subscribe((parent) =>
      this.pageredd(page)
    );
  }

  addItem(page: Page, res: Array<Page>) {
    if (res.length > 0) {
      page.cmsSubPages = res;
      this.subpages = res;
      //this.resetPropFull();
    }
  }

  cmsListRest(page: Page) {
    var tazbfield = document.getElementsByClassName('turwlink');
    if (page._id == '5a111233aaa94d061a93e719') {
      for (var i = 0; i < tazbfield.length; i++) {
        tazbfield[i].classList.remove('active');
      }
      document
        .getElementById('rowli_5a111233aaa94d061a93e719')
        .classList.add('active');
    }
  }

  writeFile(text: object) {
    return this._http
      .post(environment.API_URL + '/api/writefile/writefile', text)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updatePickorder(pageId: string, pickorder: number) {
    return this._http
      .get(
        environment.API_URL + '/api/updatepickorder/' + pageId + '/' + pickorder
      )
      .pipe(); // map(response => JSON.parse(JSON.stringify(response)).data)
  }

  setStringReplace(pageId: string, string: string) {
    return this._http
      .get(
        environment.API_URL + '/api/setStringReplace/' + pageId + '/' + string
      )
      .pipe(); // map(response => JSON.parse(JSON.stringify(response)).data)
  }

  upsertPage(page: Page) {
    return this._http
      .get(
        environment.API_URL +
          '/api/upsertpage/' +
          this.selectedProperty.type +
          '/' +
          this.selectedProperty.pname +
          '/' +
          page
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getById(arr: Array<any>, id: string) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d]._id === id) {
        return arr[d];
      }
    }
  }

  hidePreviewFields() {
    var tabfield = document.getElementsByClassName('inputPreview');
    for (var i = 0; i < tabfield.length; i++) {
      tabfield[i].classList.add('hidden');
    }
  }

  resetParentPropFull() {
    if (this.pageSelected.objectType && this.pageSelected.objectType != '') {
      var currentObject;
      for (var i = 0; i < this.sysObjects.length; i++) {
        if (this.sysObjects[i]._id == this.pageSelected.objectType)
          currentObject = this.sysObjects[i];
      }
      this.pagetpropertiesFull = [];
      this.parentpropertiesDataType = [];
      this.parentpropObjectFull = [];
      for (var i = 0; i < currentObject.properties.length; i++) {
        var b = this.getById(this.properties, currentObject.properties[i]);
        this.pagetpropertiesFull.push(b);
        this.parentpropertiesDataType.push(b);
        if (b.type == 'Object') {
          this.pagetpropertiesFull[i].valuesarr = [];
          // this.objectProps = Object.keys(this.addressObject).map((prop) => {
          //   var rez = Object.assign(
          //     {},
          //     { key: prop },
          //     this.addressObject[prop]
          //   );
          //   b.valuesarr.push(rez);
          //   this.pagetpropertiesFull[i].valuesarr.push(rez);
          //   return rez;
          // });
          var res = b.values;
          b.valuesarr = [];
          b.labelsarr = [];
          if (res != '') {
            if (b.labels != '') {
              var rel = b.labels.split(',');
              var rez = b.values.split(',');
              if (rez.length > 0) {
                for (var z = 0; z < rez.length; z++) {
                  b.labelsarr.push(rel[z].replace(/"/g, ''));
                  b.valuesarr.push(rez[z].replace(/"/g, ''));
                }
              }
            }
          }

          this.parentpropObjectFull.push(b);
        } else if (b.values != '' && b.values != null) {
          var res = b.values;
          b.valuesarr = [];
          b.labelsarr = [];
          if (res != '') {
            if (b.labels != '') {
              var rel = b.labels.split(',');
              var rez = b.values.split(',');
              if (rez.length > 0) {
                for (var z = 0; z < rez.length; z++) {
                  b.labelsarr.push(rel[z].replace(/"/g, ''));
                  b.valuesarr.push(rez[z].replace(/"/g, ''));
                }
              }
            }
          }
        } else if (b.list != '' && b.list != null) {
          let pname = b;
          this.getObjectKids(pname.list).subscribe(function (result) {
            if (result != undefined && result.length > 0) {
              pname.valuesarr = [];
              pname.labelsarr = [];
              for (var j = 0; j < result.length; j++) {
                pname.valuesarr.push(result[j]._id);
                pname.labelsarr.push(result[j].title);
              }
              b = pname;
            }
          });
        }
      }
    }
  }

  resetParentPropFullPage(page: Page) {
    if (page.properties && page.properties.length > 0) {
      this.pagetpropertiesFull = [];
      this.parentpropertiesDataType = [];
      for (var i = 0; i < page.properties.length; i++) {
        var b = this.getById(this.properties, page.properties[i]);
        this.pagetpropertiesFull.push(b);
        this.parentpropertiesDataType.push(b);
        //this.pageSelected.schemaextend += b;
        if (b.list != '' && b.list != null) {
          let pname = b;
          this.getObjectKids(pname.list).subscribe(function (result) {
            if (result && result.length > 0) {
              pname.valuesarr = [];
              pname.labelsarr = [];
              for (var j = 0; j < result.length; j++) {
                pname.valuesarr.push(result[j]._id);
                pname.labelsarr.push(result[j].title);
              }
              b = pname;
            }
          });
        } else if (b.values != '' && b.values != null) {
          var res = b.values;
          if (res != '') {
            var rez = b.values.split(',');
            if (b.labels != '') var rel = b.labels.split(',');
            b.valuesarr = [];
            if (b.labels != '') b.labelsarr = [];
            if (rez.length > 0) {
              for (var j = 0; j < rez.length; j++) {
                b.valuesarr.push(rez[j]);
                if (b.labels != '') b.labelsarr.push(rel[j]);
              }
            }
          }
        }
      }
    } else {
      this.pagetpropertiesFull = [];
      this.parentpropertiesDataType = [];
    }
  }

  listValueToField(id: string, name: string, value: string, type: string) {
    return this._http.get<Page>(
      environment.API_URL +
        '/api/listValueToField/' +
        id +
        '/' +
        name +
        '/' +
        value +
        '/' +
        type
    );
  }

  getObjectKids(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/object/pages/' + parentId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  update_getPages(blist: CmsProperty, subpages: Array<Page>) {
    if (subpages.length > 0) {
      for (var j = 0; j < subpages.length; j++) {
        blist.valuesarr.push(subpages[j]._id);
        blist.labelsarr.push(subpages[j].title);
      }
    }
  }

  objectfllterpages(pages) {
    this.sysObjects.forEach((page) => {
      let npage = page._id;
      if (page.filter && page.filter.length > 0) {
        //this.filterObjectFullPage = [];
        //this.filterObjectFull = page.objectType;
        for (let i = 0; i < page.filter.length; i++) {
          let b = this.getById(this.properties, page.filter[i]);
          //let index = this.properties.findIndex((e) => e._id == page.filter[i]);
          //console.log(this.properties);
          let props = { ...b, objectType: npage };
          //b['object'] = npage;
          this.filterObjectFullPage.push(props);
          //console.log(page._id);
        }
      }
    });
    //console.log(this.filterObjectFullPage);
  }

  getfiltersObject() {
    //this.getPages('5a3cf9378e89191f15ed348f').subscribe((pages) =>
    this.objectfllterpages(this.sysObjects);
    //);
  }

  resetPropFullPage(page) {
    // if (page.objectType)
    //   this.getcms(page.objectType).subscribe((res) =>
    //     this.getfiltersObject(res)
    //   );
  }

  resetPropFull() {
    if (this.pageSelected.filter && this.pageSelected.filter.length > 0) {
      this.filterFull = [];
      for (var i = 0; i < this.pageSelected.filter.length; i++) {
        var b = this.getById(this.properties, this.pageSelected.filter[i]);

        this.filterFull.push(b);
      }
    }
    //console.log(this.filterFull);
    this.propertiesFull = [];
    if (
      this.pageSelected.properties &&
      this.pageSelected.properties.length > 0
    ) {
      for (var i = 0; i < this.pageSelected.properties.length; i++) {
        var b = this.getById(this.properties, this.pageSelected.properties[i]);
        this.propertiesFull.push(b);
      }
    }
  }

  mediadelete(media: string) {
    return this._http
      .get(environment.API_URL + '/api/contentdelete/' + media)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  filterdelete(index: number, page: Page) {
    return this._http
      .put(environment.API_URL + '/api/contfildelete/' + index, page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  objmerge() {
    if (this.pagetpropertiesFull.length > 0) {
      var objectMerged = Object.assign(new News());
      this.dataObject = objectMerged;
      this.objectProps = Object.keys(this.dataObject).map((prop) => {
        return Object.assign({}, { key: prop }, this.dataObject[prop]);
      });
      const formGroup = {};
      for (let prop of Object.keys(this.dataObject)) {
        if (formGroup[prop] == 'schemaextend') {
          formGroup[prop] = this.fb.array([]);
          console.log('??');
        } else {
          console.log(prop);
          formGroup[prop] = new FormControl(this.dataObject[prop]);
        }
      }
      this.pageForm = new FormGroup(formGroup);
    }
  }

  pageupload(files: Array<File>, fileExten: string) {
    return this._http
      .put(environment.API_URL + '/api/pageupload/' + fileExten, files)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  fileCheck(file: string) {
    return this._http
      .get(environment.API_URL + '/api/assets/content/' + file)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  scan_new_folder(objekt: Page) {
    return this._http
      .post(environment.API_URL + '/api/assets/scan_new_folder', objekt)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  scan_music_folder(objekt, path: string) {
    objekt.path = path;
    return this._http
      .post(environment.API_URL + '/api/assets/scan_music_folder', objekt)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  scan_url_folder(objekt) {
    return this._http
      .get(environment.API_URL + '/api/assets/scan_url_folder', objekt)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createSchemaExtensionFile() {
    this.resetParentPropFullPage(this.pageSelected);
    var ttt = "import { Address } from './../address';\r\n";
    ttt += "import { VideoGenre } from './../videogenre';\r\n";
    if (this.pageSelected.title.replace(' ', '') != 'Country')
      ttt += "import { Country } from './../country';\r\n";
    ttt += "import { Treeid } from './../treeid';\r\n";
    ttt += "import { MediaImage } from './../mediaImage';\r\n\r\n";
    ttt +=
      `export class ` +
      this.pageSelected.title.replace(' ', '') +
      ` {
        constructor(\r\n`;
    for (var i = 0; i < this.pagetpropertiesFull.length; i++) {
      if (
        this.pagetpropertiesFull[i].type == 'Date' ||
        this.pagetpropertiesFull[i].type == 'DateTime'
      ) {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': Date = ';
        ttt += 'new Date()';
      } else if (this.pagetpropertiesFull[i].type == 'number') {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': number = ';
        ttt += '0';
      } else if (this.pagetpropertiesFull[i].type == 'file') {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': string = ';
        ttt += '"' + this.pagetpropertiesFull[i].values + '"';
      } else if (this.pagetpropertiesFull[i].type == 'boolean') {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': boolean = false '; // ' + this.pagetpropertiesFull[i].object + '
      } else if (this.pagetpropertiesFull[i].type == 'array') {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': string[] = '; // ' + this.pagetpropertiesFull[i].object + '
        if (
          this.pagetpropertiesFull[i].values != '' &&
          this.pagetpropertiesFull[i].values != null
        ) {
          var res = this.pagetpropertiesFull[i].values.split(',');
          var lab = this.pagetpropertiesFull[i].labels.split(',');
          if (res.length > 0) {
            ttt += '[';
            for (var j = 0; j < res.length; j++) {
              this.pagetpropertiesFull[i].valuesarr.push(res[j]);
              this.pagetpropertiesFull[i].labelsarr.push(lab[j]);
              var aval = lab[j].replace(/"/g, '');
              var bval = res[j].replace(/"/g, '');
              var nval = '"' + aval + '=>' + bval + '"';
              ttt += nval;
              if (j < res.length - 1) {
                ttt += ',';
              }
            }
            ttt += ']';
          }
        } else {
          ttt += '[]';
        }
      } else if (this.pagetpropertiesFull[i].type == 'Object') {
        //if(this.pagetpropertiesFull[i].object == 'Treeid')
        //    this.pagetpropertiesFull[i].object = 'TreeId';
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': Array<' +
          this.pagetpropertiesFull[i].object +
          '> = new Array<' +
          this.pagetpropertiesFull[i].object +
          '>() ';
      } else if (this.pagetpropertiesFull[i].type == 'string') {
        ttt +=
          '           ' +
          this.pagetpropertiesFull[i].access +
          ' ' +
          this.pagetpropertiesFull[i].pname +
          ': string = ';
        ttt += '""';
      } else {
        const self = this;
        if (
          this.pagetpropertiesFull[i].values != '' &&
          this.pagetpropertiesFull[i].values != null
        ) {
          ttt +=
            '           ' +
            this.pagetpropertiesFull[i].access +
            ' ' +
            this.pagetpropertiesFull[i].pname +
            ': ' +
            this.pagetpropertiesFull[i].type +
            ' = ';
          var res = this.pagetpropertiesFull[i].values.split(',');

          if (res.length > 0) {
            ttt += '[';
            for (var j = 0; j < res.length; j++) {
              ttt += '"' + res[j] + '"';
              if (j < res.length - 1) {
                ttt += ',';
              }
            }
            ttt += ']';
          } else {
            ttt +=
              '           ' +
              this.pagetpropertiesFull[i].access +
              ' ' +
              this.pagetpropertiesFull[i].pname +
              ': ' +
              this.pagetpropertiesFull[i].type +
              ` = `;
            ttt += '""';
          }
        } else {
          if (this.pagetpropertiesFull[i].list != '') {
            this.getPages(this.pagetpropertiesFull[i].list).subscribe(
              (result) =>
                function (result: Array<Page>) {
                  var nttt = '[';
                  for (var j = 0; j < result.length; j++) {
                    nttt += '"' + result[j] + '"';
                    if (j < result.length - 1) {
                      nttt += ',';
                    }
                  }
                  nttt += ']';
                  ttt +=
                    '           ' +
                    self.pagetpropertiesFull[i].access +
                    ' ' +
                    self.pagetpropertiesFull[i].pname +
                    ': ' +
                    self.pagetpropertiesFull[i].type +
                    ' = ';
                  ttt += nttt;
                }
            );
          } else {
            ttt +=
              '           ' +
              this.pagetpropertiesFull[i].access +
              ' ' +
              this.pagetpropertiesFull[i].pname +
              ': ' +
              this.pagetpropertiesFull[i].type +
              ' = ';
            ttt += '""';
          }
        }
      }
      if (i < this.pagetpropertiesFull.length - 1) ttt += `,`;
      ttt += `\r\n`;
    }
    ttt += `    ) { }}`;
    var testt = { fname: this.pageSelected.title.replace(' ', ''), text: ttt };
    this.writeFile(testt).subscribe();
  }

  scontext(page: Page) {
    //console.log(page);
    if (page._id != '')
      this.getcontext(page).subscribe((result) => this.setTreeLevels(result));
  }

  tcontext(page: Page) {
    if (page._id != '')
      this.getcontext(page).subscribe((result) => console.log(result));
  }

  settreelevelfile(res) {
    this.treelevelfile = res;
  }

  setTreeLevels(result: Array<Page>) {
    this.treelevels = result;
    if (this.emitTreeLevels == true) {
      this.treeLevelsUpdated.emit(result);
      this.emitTreeLevels = false;
    }
  }

  getcontext(page: Page) {
    return this._http.get<Array<Page>>(
      environment.API_URL + '/api/getcontext/' + page._id
    );
  }

  // context(page: Page) {
  //   if (page != null && page._id != this.pageRoot._id) {
  //     var ns = this.treelevels.indexOf(page);
  //     if (ns == -1) {
  //       this.treelevels.unshift(page);
  //       this.getPage(page);
  //     }
  //   } else {
  //     var rs = this.treelevels.indexOf(this.pageRoot);
  //     if (rs == -1) this.treelevels.unshift(this.pageRoot);
  //   }
  // }

  resetParentCmsSubPage(page: Page) {
    console.log('resetParentCmsSubPage ' + this.treelevels.length);
    //console.log(page);
    let indexB;
    let indexC;
    let indexD;
    let indexE;
    let indexF;

    indexB = this.pages[0].cmsSubPages.findIndex(
      (res) => res._id == this.treelevels[1]._id
    );
    if (this.treelevels.length > 2) {
      indexC = this.pages[0].cmsSubPages[indexB].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[2]._id
      );
    }
    if (this.treelevels.length > 3) {
      indexD = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages.findIndex((res) => res._id == this.treelevels[3]._id);
    }
    if (this.treelevels.length > 4) {
      indexE = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[4]._id
      );
    }
    if (this.treelevels.length > 5) {
      indexF = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[5]._id
      );
    }

    if (this.treelevels.length == 4) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        pageIndex
      ] = page;
    } else if (this.treelevels.length == 5) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[pageIndex] = page;
    } else if (this.treelevels.length == 6) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (e) => e._id == page._id
      );
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[indexE].cmsSubPages[pageIndex] = page;
    } else if (this.treelevels.length == 7) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages[
        indexF
      ].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[pageIndex] = page;

      //console.log(page[field]);
      //console.log(field);
    }
    //if (page._id == this.pageSelected._id) this.setPageSelected(page);
  }

  resetParentCmsSubPages(page: Page, field: string) {
    console.log('resetParentCmsSubPages ' + this.treelevels.length);
    //console.log(page);
    let indexB;
    let indexC;
    let indexD;
    let indexE;
    let indexF;

    indexB = this.pages[0].cmsSubPages.findIndex(
      (res) => res._id == this.treelevels[1]._id
    );
    if (this.treelevels.length > 2) {
      indexC = this.pages[0].cmsSubPages[indexB].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[2]._id
      );
    }
    if (this.treelevels.length > 3) {
      indexD = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages.findIndex((res) => res._id == this.treelevels[3]._id);
    }
    if (this.treelevels.length > 4) {
      indexE = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[4]._id
      );
    }
    if (this.treelevels.length > 5) {
      indexF = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[5]._id
      );
    }

    if (this.treelevels.length == 4) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        pageIndex
      ][field] = page[field];
    } else if (this.treelevels.length == 5) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[pageIndex][field] = page[field];
    } else if (this.treelevels.length == 6) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (e) => e._id == page._id
      );
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[indexE].cmsSubPages[pageIndex][field] = page[field];
    } else if (this.treelevels.length == 7) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages[
        indexF
      ].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[pageIndex][field] =
        page[field];
      //console.log(page[field]);
      //console.log(field);
    }
    //if (page._id == this.pageSelected._id) this.setPageSelected(page);
  }

  resetParentCmsSubPagesExtension(page: Page) {
    console.log('resetParentCmsSubPages ' + this.treelevels.length);
    //console.log(page);
    let indexB;
    let indexC;
    let indexD;
    let indexE;
    let indexF;

    indexB = this.pages[0].cmsSubPages.findIndex(
      (res) => res._id == this.treelevels[1]._id
    );
    if (this.treelevels.length > 2) {
      if (this.pages[0].cmsSubPages[indexB].cmsSubPages) {
        indexC = this.pages[0].cmsSubPages[indexB].cmsSubPages.findIndex(
          (res) => res._id == this.treelevels[2]._id
        );
      }
    }
    if (this.treelevels.length > 3) {
      if (this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages) {
        indexD = this.pages[0].cmsSubPages[indexB].cmsSubPages[
          indexC
        ].cmsSubPages.findIndex((res) => res._id == this.treelevels[3]._id);
      }
    }
    if (this.treelevels.length > 4) {
      indexE = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[4]._id
      );
    }
    if (this.treelevels.length > 5) {
      indexF = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (res) => res._id == this.treelevels[5]._id
      );
    }

    if (this.treelevels.length == 3) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages.findIndex(
        (e) => e._id == page._id
      );
      this.pages[0].cmsSubPages[indexB].cmsSubPages[pageIndex].schemaextend[0] =
        page.schemaextend[0];
    } else if (this.treelevels.length == 4) {
      if (this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages) {
        let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
          indexC
        ].cmsSubPages.findIndex((e) => e._id == page._id);
        this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
          pageIndex
        ].schemaextend[0] = page.schemaextend[0];
      }
    } else if (this.treelevels.length == 5) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages.findIndex((e) => e._id == page._id);
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[pageIndex].schemaextend[0] = page.schemaextend[0];
    } else if (this.treelevels.length == 6) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages.findIndex(
        (e) => e._id == page._id
      );
      this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
        indexD
      ].cmsSubPages[indexE].cmsSubPages[pageIndex].schemaextend[0] =
        page.schemaextend[0];
    } else if (this.treelevels.length == 7) {
      let pageIndex = this.pages[0].cmsSubPages[indexB].cmsSubPages[
        indexC
      ].cmsSubPages[indexD].cmsSubPages[indexE].cmsSubPages[
        indexF
      ].cmsSubPages.findIndex((e) => e._id == page._id);
      //console.log(pageIndex);
      // console.log(
      //   this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
      //     indexD
      //   ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[pageIndex].title
      // );

      if (
        this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
          indexD
        ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[pageIndex]
      ) {
        this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
          indexD
        ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[
          pageIndex
        ].schemaextend[0] = page.schemaextend[0];
      }
      // console.log(
      //   this.pages[0].cmsSubPages[indexB].cmsSubPages[indexC].cmsSubPages[
      //     indexD
      //   ].cmsSubPages[indexE].cmsSubPages[indexF].cmsSubPages[pageIndex]
      //     .schemaextend[0]
      // );
    }
    //if (page._id == this.pageSelected._id) this.setPageSelected(page);
  }

  nl2br(str: File, is_xhtml: string) {
    var breakTag =
      is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>';
    return (str + '').replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
      '$1' + breakTag + '$2'
    );
  }

  getModel(fname: string) {
    this._http
      .get<File>(environment.API_URL + '/api/model/read/' + fname)
      .subscribe((data) => {
        document.getElementById('modelRead').innerHTML = this.nl2br(data, '');
      });
  }

  getModels() {
    this.scanmodels().subscribe((models) => (this.models = models));
  }

  clear_table_current() {
    var element = document.getElementsByClassName('trow');
    for (var i = 0; i < element.length; i++) {
      if (this.current_row == i) {
        element[i].classList.add('current');
      } else {
        element[i].classList.remove('current');
      }
    }
  }

  toHoursAndMinutes(totalMinutes) {
    totalMinutes = parseInt(totalMinutes);
    var hours: number = Math.floor(totalMinutes / 60);
    var minutes: number = totalMinutes % 60;
    if (hours < 10) {
      hours = 0 + hours;
    }
    if (minutes < 10) {
      minutes = 0 + minutes;
    }
    return hours + ':' + minutes;
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  getImdb(page: Page) {
    return this._http
      .post(environment.API_URL + '/api/getImdb/', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getImdbById(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/getImdb/' + pageId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  srtToVtt(page: Page, lang) {
    return this._http
      .get(
        environment.API_URL + '/api/convertSrtToVtt/' + lang + '/' + page._id
      )
      .pipe();
  }

  fileToImageConverter(id: string) {
    return this._http
      .get(environment.API_URL + '/api/fileToImageConverter/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getMovieInfo(page: Page) {
    return this._http
      .post<Page>(environment.API_URL + '/api/getMovieInfo/', page)
      .pipe();
  }

  getMovieInfoById(pageId: string) {
    return this._http
      .get<Page>(environment.API_URL + '/api/getMovieInfoById/' + pageId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  geturl(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/geturl/' + pageId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getImageInfo(page: Page) {
    return this._http
      .post(environment.API_URL + '/api/getImageInfo/', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  imageThumbFromImage(id: string) {
    return this._http
      .get(environment.API_URL + '/api/imageThumbFromImage/' + id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  incrementKid(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/pages/inckid/' + parentId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  decrementKid(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/pages/deckid/' + parentId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  getSubPages(page: Page) {
    this.getPages(page._id).subscribe((subpages) =>
      this.getSubPagesReady(page, subpages)
    ); //
  }

  getSubPagesReady(page: Page, pages: Array<Page>) {
    page.cmsSubPages = pages;
  }

  getkids(page: Page) {
    var datakids = document
      .getElementById('rowli_' + page._id)
      .getAttribute('data-kids');
    if (datakids == 'off') {
      document
        .getElementById('rowli_' + page._id)
        .setAttribute('data-kids', 'on');
      this.getPages(page._id).subscribe((result) =>
        this.addRowsKids(page, result)
      );
    }
  }

  toggleDiv(page: Page) {
    var tazbfield = document.getElementsByClassName('rowul_' + page._id);
    for (var i = 0; i < tazbfield.length; i++) {
      if (tazbfield[i].classList.contains('hidden')) {
        tazbfield[i].classList.remove('hidden');
      } else {
        tazbfield[i].classList.add('hidden');
      }
    }
  }

  addRowsKids(page: Page, res: Array<Page>) {
    var rows = <HTMLInputElement>document.getElementById('rowli_' + page._id);
    var oldhtl = rows.innerHTML;
    var newhtl =
      '<ul id="rowul_' + page._id + '" class="levelA dropdown-content">';
    if (res.length > 0) {
      for (var s = 0; s < res.length; s++) {
        newhtl +=
          '<li><a><span class="col-sm-1"><span class="color_trans icon ' +
          (page.parent == this.pageSelected._id
            ? ' icmn-arrow-resize4 handle'
            : '') +
          '"></span></span><span class="col-sm-1"><span class="icon icmn-lamp8 ' +
          (res[s].visible == true ? 'color_trans' : '') +
          '"></span></span><span class="col-sm-1"><span class="icon icmn-lock3 ' +
          (res[s].secure == true ? 'color_trans' : '') +
          '"></span><span class="col-sm-7">' +
          res[s].title +
          '</span></span><span class="col-sm-1 float_r text-right">' +
          res[s].kids +
          '</span></a></li>';
      }
    }
    newhtl += '</ul>';
    rows.innerHTML = oldhtl + ' ' + newhtl;
    this.toggleDiv(page);
  }

  pagee_edit_setParent(page: Page, n: number) {
    if (page._id != this.pageRoot._id && page._id != this.pageSelected._id) {
      var rows = document.getElementsByClassName('turwlink');
      if (this.prevslices != undefined)
        if (
          this.prevslices != undefined &&
          this.prevslice_rowID != 'rowli_' + page._id &&
          this.prevslice_rowID != 'rowli_' + page.parent
        ) {
          if (this.prevslicep == 'on') {
            this.pages.splice(
              parseInt(this.prevslices),
              parseInt(this.prevslicee)
            );
            this.prevslices = '';
            this.prevslicee = '';
            this.prevslice_rowID = '';
          }
        }
    }
    this.setpageSelectedIndex(n);
    this.getParentSelected(page.parent).subscribe((ppage) =>
      this.setparentPage(ppage)
    );
  }

  pageEdit(page: Page, n: number) {
    console.log('pageEdit');
    this.setPageSelected(page);
    this.setpageSelectedIndex(n);
    this.setpageSelectedEditable(true);
    this.current_row = n;
    this.current_rowID = 'rowli_' + page._id;
    this.pageEditSubPages(page);
  }

  setPageSelected(page: Page) {
    if (page.title != 'Root') {
      this.setPageSelectedReady(page);
      this.getcms(page.parent).subscribe((parent) =>
        this.setparentPage(parent)
      );
    } else {
      this.setPageSelectedReady(page);
    }
  }

  setPageSelected2(page: Page) {
    this.pageSelected = page;
    this.checkDeleteButton(page);
    this.pageSelectedUpdated.emit(page);
  }

  setparentPage(parent: Page) {
    this.parentPage = parent;
  }

  pageReadyLink() {
    for (var i = 0; i < this.treelevels.length; i++) {
      if (this.contextloop == false) {
        var id = this.treelevels[i]._id;
        this.rowClickGenerator(i, id);
      }
      if (i + 1 == this.treelevels.length) {
        this.contextloop = true;
      }
    }
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  rowClickGenerator(sec: number, id: string) {
    this.browseindex = 'true';
    var dhis = this;
    this.timer.push(
      setTimeout(function () {
        const rowToSelect = 'tabrowl_' + id;
        if (document.getElementById(rowToSelect)) {
          if (
            document.getElementById('rowli_' + id).getAttribute('data-kids') ==
            'off'
          ) {
            document.getElementById(rowToSelect).click();
            var tazbfield = document.getElementsByClassName('rowul_' + id);
            for (var i = 0; i < tazbfield.length; i++) {
              tazbfield[i].classList.remove('hidden');
            }
          } // else {
          //var element = document.getElementById(rowToSelect);
          //element.scrollIntoView();
          //}
        }
        if (sec + 1 == dhis.treelevels.length) {
          var element = document.getElementById(rowToSelect);
          if (element) element.scrollIntoView();
          dhis.browseindex = 'false';
          dhis.contextloop = true;
          dhis.scrollToTop();
        }
      }, (sec - 2) * 1000)
    );
  }

  setPageSelectedReady(page: Page) {
    this.pageSelected = page;
    //console.log(page);
    this.pageIsset = true;
    this.scontext(page);
    if (page.title != 'Root') {
      if (this.browseindex == 'true') {
        var con = this.treelevels;
        var dhis = this;
        for (var i = 0; i < con.length; i++) {
          var id = con[i]._id;
          var title = con[i].title;
          const rowToSelect = 'tabrowl_' + id;
          if (document.getElementById(rowToSelect)) {
            if (
              document
                .getElementById('rowli_' + id)
                .getAttribute('data-kids') == 'off'
            ) {
              dhis.rowClickGenerator(i, id);
            } else {
              var element = document.getElementById(rowToSelect);
              element.scrollIntoView();
            }
          }
          if (i + 1 == con.length) {
            var element = document.getElementById(rowToSelect);
            if (document.getElementById(rowToSelect)) element.scrollIntoView();
          }
        }
      } else {
      }
    }
    this.checkDeleteButton(page);
    this.setFilters();
    //this.resetParentPropFullPage(page);
    this.resetParentPropFull();
    //if (this.pageSelected.filter && this.pageSelected.filter.length > 0)
    this.resetPropFull();
    //this.update_edit_image_fields(page);
    //console.log(page);
    this.pageSelectedUpdated.emit(page);

    this.checkAssetFolder('content').subscribe(
      (result) => (this.chkAssetFolder = result)
    );
  }

  pageEditSubPages(page: Page) {
    this.current_row = this.pageSelectedIndex;
    this.current_rowID = 'rowli_' + page._id;
    this.getSubPages(page);
    this.resetParentPropFull();
  }

  fileAlbumAdd(mediaId: string, albums: string) {
    return this._http
      .get(environment.API_URL + '/api/fileAlbumAdd/' + mediaId + '/' + albums)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  fileAlbumDelete(mediaId: string, albums: Array<Page>) {
    return this._http
      .put(environment.API_URL + '/api/fileAlbumDelete/' + mediaId, albums)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  listPropertyUsedBy(propid: string) {
    return this._http
      .get(environment.API_URL + '/api/listPropertyUsedBy/' + propid)
      .pipe();
  }

  getAllSongs() {
    return this._http.get(environment.API_URL + '/api/allsongs').pipe();
  }

  folderIdCheck() {
    return this._http.get(environment.API_URL + '/api/folderIdCheck').pipe();
  }

  filterParentList() {
    return this._http
      .get(environment.API_URL + '/api/filter/parentList')
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  filterUsersList() {
    return this._http
      .get(environment.API_URL + '/api/filter/usersList')
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  filterMediaList() {
    return this._http
      .get(environment.API_URL + '/api/filter/mediaList')
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  presetssubpages(page: Page, n, pages: Array<Page>) {
    var rows = document.getElementsByClassName('turwlink');
    for (var s = 0; s < rows.length; s++) {
      var datakids = rows[s].getAttribute('data-kids');
      var rowid = rows[s].getAttribute('id').replace('row_', '');
      if (rowid != '5a111233aaa94d061a93e719') {
        if (rows[s].id != page._id && datakids == 'on') {
          this.getPages(rowid).subscribe((npages) =>
            this.pages.splice(s, this.pages.length)
          );
          rows[s].setAttribute('data-kids', 'off');
        }
        if (s == rows.length - 1) {
          this.setssubpages(page, n, pages);
        }
      }
    }
  }

  setssubpages(page: Page, n, pages: Array<Page>) {
    this.subpages = pages;
    if (pages.length > 0) {
      var totaal = pages.length;
      var subpages = this.subpages;
      var subaspages = this.pages;
      var datakids = document
        .getElementById(this.current_rowID)
        .getAttribute('data-kids');
      var arbox = '';
      var i = this.current_row;
      if (datakids == 'on') {
        if (page._id != '5a111233aaa94d061a93e719') {
          this.prevslices = '';
          this.prevslicee = '';
          this.prevslicep = 'off';
          this.prevslice_rowID = '';
        }
        this.pages.splice(this.current_row, this.subpages.length);
      } else {
        if (page._id != '5a111233aaa94d061a93e719') {
          this.prevslices = '' + this.current_row;
          this.prevslicee = '' + subpages.length;
          this.prevslicep = 'on';
          this.prevslice_rowID = 'row_' + page._id;
        }
        subpages.forEach(function (s) {
          subaspages.splice(i, 0, s);
          i++;
        });
      }

      if (datakids == 'on') {
        this.clear_table_current();
        document
          .getElementById(this.current_rowID)
          .setAttribute('data-kids', 'off');
      } else {
        this.clear_table_current();
        document.getElementById(this.current_rowID).classList.add('current'); // trow active current
        document
          .getElementById(this.current_rowID)
          .setAttribute('data-kids', 'on');
        var trs = document.getElementsByClassName('trow_' + page.parent);
      }
    } else {
      this.clear_table_current();
      if (this.current_row > 0)
        document.getElementById(this.current_rowID).classList.add('current');
      this.prevslices = '';
      this.prevslicee = '';
      this.prevslice_rowID = '';
      this.prevslicep = 'off';
    }
  }

  private isValidFileExtension(files: Array<File>) {
    var extensions = this.fileExt.split(',').map(function (x) {
      return x.toLocaleUpperCase().trim();
    });
    for (var i = 0; i < files.length; i++) {
      var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      var exists = extensions.includes(ext);
      if (!exists) {
        this.errors.push('Error (Extension): ' + files[i].name);
      }
      this.isValidFileSize(files[i]);
    }
  }

  addMediaToTreeItem(media: Media) {
    var vall = document.getElementById('blokdiv_' + media._id);
    if (vall.getAttribute('class') == 'cmsrow blok') {
      vall.classList.add('active');
    } else {
      vall.classList.remove('active');
    }
    var a = this.pageSelected.media.indexOf(media._id);
    if (a == -1) {
      this.PageSelectedAddMediaId = media._id;
      this.pageSelected.media.push(media._id);
      this.pages[this.current_row - 1] = this.pageSelected;
      this.updatePage(this.pageSelected).subscribe((answer) =>
        this.updatePageReady()
      );
    }
  }

  updatePageReady() {
    this.checkDeleteButton(this.pageSelected);
  }

  private isValidFiles(files: Array<File>) {
    if (files.length > this.maxFiles) {
      this.errors.push(
        'Error: At a time you can upload only ' + this.maxFiles + ' files'
      );
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  checkDeleteButton(page: Page) {
    var element = document.getElementsByClassName('btndeletePage');
    if (element.length > 0) {
      if (page.secure == true || this._userService.isUserLoggedIn == false) {
        for (var i = 0; i < element.length; i++) {
          element[i].setAttribute('disabled', 'true');
        }
      } else {
        for (var i = 0; i < element.length; i++) {
          element[i].removeAttribute('disabled');
        }
      }
    }
  }

  private isValidFileSize(file: File) {
    var fileSizeinMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeinMB * 100) / 100;
    if (size > this.maxSize)
      this.errors.push(
        'Error (File Size): ' +
          file.name +
          ': exceed file size limit of ' +
          this.maxSize +
          'MB ( ' +
          size +
          'MB )'
      );
  }

  showUploadButton() {
    document
      .getElementById('startUploadButton')
      .setAttribute('class', 'btn btn-primary');
  }

  hideUploadButton() {
    document
      .getElementById('startUploadButton')
      .setAttribute('class', 'hidden');
  }

  humanfilesize(size: number, unit: string, decimals: number) {
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

  getProperty(propid: string) {
    return this._http
      .get<CmsProperty>(environment.API_URL + '/api/cmsproperty/' + propid)
      .pipe();
  }
  getFilter(propid: string) {
    return this._http
      .get(environment.API_URL + '/api/cmsproperty/' + propid)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  page_edit(page: Page, n: number) {
    //console.log(page);
    var ccell = document.getElementById('rowcell_' + page._id);
    this.setPageSelected(page);
    this.setpageSelectedIndex(n);
    this.pageEditSubPages(page);
    //this.resetParentPropFull();
    //this.resetPropFull();
    var element = document.getElementsByClassName('btnsaveCms');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove('hidden');
    }
    var element = document.getElementsByClassName('btnsaveCmsNew');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.add('hidden');
    }
  }

  clear_treelevels() {
    this.treelevels = [];
  }

  getRoot() {
    this.getcms('5a111233aaa94d061a93e719').subscribe((result) =>
      this.getRootReady(result)
    );
  }

  convertSeconds(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    let extraSeconds = seconds % 60;
    let nminutes = minutes < 10 ? '0' + minutes : minutes;
    let nextraSeconds = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds;
    return seconds > 0 ? nminutes + ':' + nextraSeconds : '';
  }

  secondsToHms(d: number) {
    d = Number(d);
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
    return hDisplay + ':' + mDisplay + ':' + sDisplay;
  }

  getRootReady(page: Page) {
    var tmppage = page;
    this.pageProperties = Object.values(tmppage);
    this.pageRoot = page;
    this.pages.unshift(page);

    this.pageEditSubPages(page);
    var element = document.getElementsByClassName('btnsaveCms');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove('hidden');
    }
    var element = document.getElementsByClassName('btnsaveCmsNew');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.add('hidden');
    }
  }

  getPropByName(prop: CmsProperty) {
    return this._http
      .get(environment.API_URL + '/api/getPropByName/' + prop)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  objectLoop() {
    this.cmsFields = [];
    var objectMerged = new Page();
    this.dataObject = objectMerged;
    this.objectProps = Object.keys(this.dataObject).map((prop) => {
      return Object.assign({}, { key: prop }, this.dataObject[prop]);
    });
    for (let prop of Object.keys(this.dataObject)) {
      this.cmsFields.push(prop);
    }
  }

  listCheckboxCount(id: string) {
    let input = <HTMLInputElement>document.getElementById(id);
    if (input && input.checked == true) {
      this.listCheckboxCounter++;
    } else {
      this.listCheckboxCounter--;
    }
  }

  objectLoopReady() {
    var obj = this.pageSelected;
    var checkboxes = document.getElementsByClassName('insertFieldLabels');
    for (var i = 0; i < checkboxes.length; i++) {
      if (
        obj.hasOwnProperty(
          (<HTMLInputElement>checkboxes[i]).getAttribute('title')
        )
      ) {
        // (<HTMLInputElement>document.getElementById(elementId)).value;
        (<HTMLInputElement>checkboxes[i]).classList.remove('color_green');
        (<HTMLInputElement>checkboxes[i]).classList.add('color_red');
      } else {
        (<HTMLInputElement>checkboxes[i]).classList.add('color_green');
        (<HTMLInputElement>checkboxes[i]).classList.remove('color_red');
      }
    }
  }

  getPage(page: Page) {
    //if(page.parent != '5a111233aaa94d061a93e719' && page._id != '5a111233aaa94d061a93e719')
    this.getcms(page.parent).subscribe((result) => this.check_context(result));
  }

  check_context(page: Page) {
    let add = true;
    var ns = this.treelevels.indexOf(page);
    let a = {};
    if (page && page._id) {
      a = this.treelevels.find((x) => x._id === page._id);
    } else {
      a = -1;
    }
    if (ns == -1) {
      //this.context(page);
    }
  }

  getMenuLists() {
    this.getPages('5a11ca02aaa94d061a93e71c').subscribe((result) =>
      this.getMenuListsReady(result)
    );
  }

  getMenuListsReady(res: Array<Page>) {
    this.menuList = res;
    this.menuList.forEach((staffDetail, index) => {
      this.getPagesVisible(staffDetail._id).subscribe((result) =>
        this.setlevelA(result, index)
      );
    });
  }

  setlevelA(result: Array<Page>, index: number) {
    this.menuList[index].cmsSubPages = result;
    this.menuList.forEach((leva, index) => {
      leva.cmsSubPages.forEach((levb, index2) => {
        this.getPagesVisible(levb._id).subscribe((result) =>
          this.setlevelB(result, index, index2)
        );
      });
    });
  }

  setlevelB(result, index, index2) {
    this.menuList[index].cmsSubPages[index2].cmsSubPages = result;
  }

  menuSubLink(page: Page) {
    // if (page.cmsSubPages && page.cmsSubPages.length == 0) {
    //   this.getPagesVisible(page._id).subscribe(
    //     (result) => (page.cmsSubPages = result)
    //   );
    // }
  }

  menuSubLinkDelete(page: Page) {
    page.cmsSubPages = [];
  }

  getPages(parentId: string) {
    return this._http
      .get<Array<Page>>(environment.API_URL + '/api/pages/' + parentId)
      .pipe();
  }

  getPagez(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/pagez/' + parentId)
      .pipe();
  }

  getcms(parentId: string) {
    return this.http.get<Page>(environment.API_URL + '/api/page/' + parentId);
  }

  getchildcms(parentId: string) {
    return this._http
      .get<Page>(environment.API_URL + '/api/childpage/' + parentId)
      .pipe(); //
  }

  updateParent(id: string, parent: string) {
    return this._http
      .get(environment.API_URL + '/api/updateparent/' + id + '/' + parent)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updateMusicGenre(id: string, genre: string) {
    return this._http
      .get(environment.API_URL + '/api/mgenre/' + id + '/' + genre)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }
  updateTreelevel(id: string, genre: string) {
    return this._http
      .get(environment.API_URL + '/api/treelevel/' + id + '/' + genre)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updateListKids(id: string, listitem: string) {
    return this._http
      .get(environment.API_URL + '/api/updateListKids/' + id + '/' + listitem)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updateListItem(id: string, listitem: string) {
    return this._http
      .get(environment.API_URL + '/api/updatelistitem/' + id + '/' + listitem)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updateListGenre(id: string, listitem: string) {
    return this._http
      .get(environment.API_URL + '/api/updatelistgenre/' + id + '/' + listitem)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updateObject(id: string, objekt: string) {
    return this._http
      .get(environment.API_URL + '/api/updateobject/' + id + '/' + objekt)
      .pipe();
  }

  setpageSelectedIndex(number: number) {
    this.pageSelectedIndex = number;
    this.setpageSelectedEditable(true);
  }

  elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.scrollY &&
      left >= window.scrollX &&
      top + height <= window.scrollY + window.innerHeight &&
      left + width <= window.scrollX + window.innerWidth
    );
  }

  setpageSelectedEditable(status: boolean) {
    this.pageSelectedEditable = status;
  }

  setSubPages(pages: Array<Page>) {
    this.subpages = pages;
  }

  getBackgrounds(picId: string) {
    return this._http
      .get(environment.API_URL + '/api/backgrounds/' + picId)
      .pipe();
  }

  getPagesDesc(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/pagesdesc/' + parentId)
      .pipe();
  }

  getPagesAsc(parentId: string) {
    return this._http
      .get(environment.API_URL + '/api/pagesasc/' + parentId)
      .pipe();
  }

  getPagesVisible(parentId: string) {
    return this._http
      .get<Array<Page>>(environment.API_URL + '/api/pagesvisible/' + parentId)
      .pipe();
  }

  getPhotoPersons(personId: string) {
    return this._http
      .get(environment.API_URL + '/api/persons/' + personId)
      .pipe();
  }

  getMusicAlbums() {
    return this._http.get(environment.API_URL + '/api/musicalbums/').pipe();
  }

  createBat(filename: string, commands: any, ids: any) {
    let tmp = {};
    tmp['contents'] = commands;
    tmp['ids'] = ids;
    return this._http.put(
      environment.API_URL + '/api/createBat/' + filename,
      tmp
    );
  }

  getRandomChild(parent: string) {
    return this._http.get(
      environment.API_URL + '/api/getRandomChild/' + parent
    );
  }

  insertImagesParentName(
    page: Page,
    artistName: string,
    albumName: string,
    songTitle: string
  ) {
    return this._http
      .get(
        environment.API_URL +
          '/api/insertImagesParentName/' +
          artistName +
          '/' +
          albumName +
          '/' +
          songTitle
      )
      .pipe();
  }

  insertByParentName(
    page: Page,
    parentName: string,
    title: string,
    url: string
  ) {
    return this._http
      .post(
        environment.API_URL +
          '/api/insertByParentName/' +
          parentName +
          '/' +
          title +
          '/' +
          url,
        page
      )
      .pipe();
  }

  getAlbumsByArray(searcharray: Array<string>) {
    return this._http
      .post(environment.API_URL + '/api/getAlbumsByArray', searcharray)
      .pipe();
  }

  insertPageWithUrl(page: Page) {
    return this._http.post(environment.API_URL + '/api/page', page).pipe();
  }

  getPagesByTitle(parentId: string) {
    return this._http
      .get<Array<Page>>(environment.API_URL + '/api/pagesbytitle/' + parentId)
      .pipe();
  }

  setPages(pages: Array<Page>) {
    this.pages = [];
    this.pages = pages;
    this.GetpagesUpdated.emit(pages);
  }

  insertList(
    pages: string,
    linesseperateby: string,
    visibility: boolean,
    secure: boolean
  ) {
    if (pages != '') {
      if (linesseperateby == 'n') {
        var items = pages.split('\n');
      } else {
        var items = pages.split(';');
      }
      if (items.length > 1) {
        var parent = this.pageSelected._id;
        items.forEach(function (s) {
          if (s != '') {
            var tpage = new Page();
            tpage.title = s;
            tpage.parent = parent;
            tpage.visible = visibility;
            tpage.secure = secure;
          }
        });
      }
    }
  }

  ggetPropertiesList() {
    this.getPropertiesList().subscribe((res) => console.log(res));
  }

  getPropertys() {
    this.getPropertiesList().subscribe((res) => this.propertyReady(res));
  }

  propertyReady(res) {
    this.properties = res;
    this.getfiltersObject();
  }

  getPropertiesList() {
    return this._http
      .get<Array<CmsProperty>>(environment.API_URL + '/api/getproperties')
      .pipe();
  }

  getCmsObject(cmsproperty: CmsProperty) {
    return this._http
      .get(environment.API_URL + '/api/cmsproperty/' + cmsproperty._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  upsertProperty(propname: string, datatype: string) {
    return this._http
      .get(
        environment.API_URL +
          '/api/upsertproperty/' +
          this.pageSelected._id +
          '/' +
          propname +
          '/' +
          datatype
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  upsertPageProperty(
    page: string,
    propname: string,
    datatype: string,
    value: boolean
  ) {
    return this._http
      .get(
        environment.API_URL +
          '/api/upsertprop/' +
          page +
          '/' +
          propname +
          '/' +
          datatype +
          '/' +
          value
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  updatePage(page: Page) {
    return this._http.put<Page>(
      environment.API_URL + '/api/page/' + page._id,
      page
    );
  }

  page_update(page: Page) {
    return this._http.post<Page>(
      environment.API_URL + '/api/page_update/' + page._id,
      page
    );
  }

  insertPerson(pageId: string, Person: string) {
    return this._http
      .get(environment.API_URL + '/api/insertPerson/' + pageId + '/' + Person)
      .pipe(); // map(response => JSON.parse(JSON.stringify(response)).data)
  }

  deletePerson(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/deletePerson/' + pageId + '/')
      .pipe();
  }

  insertPage(page: Page) {
    return this._http
      .post<Page>(environment.API_URL + '/api/page/', page)
      .pipe();
  }

  checkCmsObject(cmsproperty: CmsProperty) {
    return this._http
      .get(environment.API_URL + '/api/cmsproperty/' + cmsproperty._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  checkPropInUse(propid: string) {
    return this._http
      .get(environment.API_URL + '/api/checkpropinuse/' + propid)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createThumb(pageid: string) {
    return this._http
      .get(environment.API_URL + '/api/createthumb/' + pageid)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  id3tags(page: Page) {
    //let url = this.getSongUrl(page);
    // page.path = url
    //   .replace('Albums/Albums/', 'Albums/')
    //   .replace('Collections/Ballads/', 'Collections/')
    //   .replace('Collections/Dance/', 'Collections/')
    //   .replace('Collections/POP/', 'Collections/')
    //   .replace('Collections/Pop/', 'Collections/')
    //   .replace('Collections/Rnb/', 'Collections/')
    //   .replace('Collections/Rap/', 'Collections/')
    //   .replace('Collections/Other/', 'Collections/')
    //   .replace('POP/', '')
    //   .replace('Rock/', '')
    //   .replace('Reggea/', '')
    //   .replace('Dance/', '')
    //   .replace('Hip-Hop/', '')
    //   .replace('Rap/', '')
    //   .replace('Classics/', '')
    //   .replace('music/POP/', 'music/Albums/')
    //   .replace('music/RAP/', 'music/Albums/')
    //   .replace('music/Rnb/', 'music/Albums/')
    //   .replace('music/Dance/', 'music/Albums/')
    //   .replace('Collections/Classics/', 'Collections/')
    //   .replace('music/Singles/', 'music/Albums/Singles/');
    return this._http
      .post<Page>(environment.API_URL + '/api/id3tags/', page)
      .pipe();
  }

  getSongUrl(page: Page) {
    let ext = '';
    let front = './assets/music/';
    if (
      page.treelevel == 7 ||
      page.parent == '5c389c9feb88154d042130df' ||
      page.parent == '5c389cbfeb88154d04213476' ||
      page.parent == '5c389cb3eb88154d0421331d' ||
      page.parent == '5c389cb3eb88154d0421331d' ||
      page.parent == '5c389ccbeb88154d042135b1' ||
      page.parent == '5c389cd5eb88154d04213691' ||
      page.parent == '5c389ce2eb88154d0421372d' ||
      page.parent == '5c389d17eb88154d042137c3'
    ) {
      ext = 'Albums/' + page.schemaextend[0].url;
    } else if (page.treelevel == 8) {
      // collections
      ext = 'Albums/' + page.schemaextend[0].url;
    }
    return front + ext;
  }

  imagerotate(pageid: string) {
    return this._http
      .get(environment.API_URL + '/api/imagerotate/' + pageid)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  imagerotate2(pageid: string, degrees: string) {
    return this._http
      .get(environment.API_URL + '/api/imagerotate/' + pageid + '/' + degrees)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  checkPropInUseReady(answer: Array<CmsProperty>) {
    if (answer.length > 0) {
      document.getElementById('btndeleteProp').classList.add('hidden');
      (<HTMLInputElement>document.getElementById('pname')).readOnly = true;
    } else {
      document.getElementById('btndeleteProp').classList.remove('hidden');
      (<HTMLInputElement>document.getElementById('pname')).readOnly = false;
    }
  }

  SetselectedProperty(prop: CmsProperty) {
    this.selectedProperty = prop;
    this.propset = true;
  }

  SetselectedFilter(prop: string) {
    this.selectedFilter = prop;
    this.filterset = true;
  }

  insertCmsObject(cmsproperty: CmsProperty) {
    return this._http
      .post(environment.API_URL + '/api/cmsproperty', cmsproperty)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data)); // map(response => JSON.parse(JSON.stringify(response)).data)
  }

  updateCmsObject(cmsproperty: CmsProperty) {
    return this._http
      .put(
        environment.API_URL + '/api/cmsproperty/' + cmsproperty._id,
        cmsproperty
      )
      .pipe();
  }

  GetPageSelectedAddMedia() {
    return this._http
      .put(
        environment.API_URL + '/api/page/' + this.pageSelected._id,
        this.pageSelected
      )
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  createPage(page: Page) {
    return this._http
      .post(environment.API_URL + '/api/cms', page)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  destroyPage(page: Page) {
    return this._http
      .delete(environment.API_URL + '/api/cms/' + page._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  destroyPageById(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/cmsdelete/' + pageId)
      .pipe();
  }

  unsecurePageById(pageId: string) {
    return this._http
      .get(environment.API_URL + '/api/unsecurepagebyid/' + pageId)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  removeProperty(cmsprop: CmsProperty) {
    return this._http
      .delete(environment.API_URL + '/api/CmsProperty/' + cmsprop._id)
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }

  userimage(fileToUpload: File, page: Page) {
    let input = new FormData();
    input.append('file', fileToUpload);
    return this._http
      .post(environment.API_URL + '/api/userimage/' + page._id, input)
      .subscribe((response) => JSON.parse(JSON.stringify(response)).data);
  }

  getParentSelected(pageid: string) {
    return this._http
      .get<Page>(environment.API_URL + '/api/getpage/' + pageid)
      .pipe();
  }

  insertField(page: Page, fieldname: string, tval: string) {
    page.schemaextend[0][fieldname] = tval;
    console.log(page);
    return this._http
      .put(environment.API_URL + '/api/fieldupdate', page)
      .subscribe();
  }

  insertField2(page: Page, fieldname: string, tval: string) {
    page[fieldname] = tval;
    return this._http
      .put(environment.API_URL + '/api/fieldupdate', page)
      .subscribe();
  }

  scanmodels() {
    return this._http
      .get<Array<string>>(environment.API_URL + '/api/files/models/')
      .pipe();
  }

  scanbots() {
    return this._http
      .get(environment.API_URL + '/api/files/bots/')
      .pipe(map((response) => JSON.parse(JSON.stringify(response)).data));
  }
}
