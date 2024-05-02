import { MessageService } from './../services/message.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CmsService } from './../services/cms.service';
import 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from './../services/media.service';
import { UserService } from './../services/user.service';
import { Page } from './../../models/page';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from './../services/filter.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css'],
})
export class CmsComponent implements OnInit {
  @Output() createNewPageEvent = new EventEmitter();
  cmsForm: FormGroup;
  filterForm: FormGroup;
  filesToUpload: Array<File> = [];
  createNew = false;
  objectProps;
  dataObject;
  id = '5a111233aaa94d061a93e719';
  parent: any;

  constructor(
    public fb: FormBuilder,
    public _cmsService: CmsService,
    private _mediaService: MediaService,
    public _messageService: MessageService,
    public _userService: UserService,
    private _filterService: FilterService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this._cmsService.browseindex = params['browseindex'];
    });

    this._cmsService
      .scanbots()
      .subscribe((prop) => (this._cmsService.setbots = prop));

    if (this._cmsService.properties.length == 0) {
      this._cmsService.systemLists();
    }
    //this._mediaService.getImageDData();

    if (
      this._cmsService.pages.length == 0 ||
      this._cmsService.photopersons.length == 0
    ) {
      this._cmsService
        .getcms('5a111233aaa94d061a93e719')
        .subscribe((result) => this.onInitReady(result));
    }
    this._cmsService.objectLoop();
    this._cmsService.setFilters();
    document.querySelector('#search').classList.add('hidden');
    document.getElementById('search').setAttribute('display', 'none');

    this._cmsService.pageSelectedUpdated.subscribe((pageSelected: Page) =>
      this.ngPageSelected(pageSelected)
    );

    this._cmsService.treeLevelsUpdated.subscribe((treelevels: Array<Page>) =>
      this.treeLevelsUpdate()
    );
  }

  treeLevelsUpdate() {
    if (
      this._cmsService.pageSelected.title != 'Root' &&
      this._cmsService.pageSelected._id
    ) {
      this._cmsService
        .getcms(this.id)
        .subscribe((page) => this.preContext(page));
    }
  }

  ngPageSelected(page) {
    // if (page.title != 'Root' && page._id) {
    //   this._cmsService
    //     .getcms(this.id)
    //     .subscribe((page) => this.preContext(page));
    // }
  }

  ngOnInit() {
    if (this._filterService.cmsFilters.length > 0) {
      for (
        var d = 0, len = this._filterService.cmsFilters.length;
        d < len;
        d += 1
      ) {
        this._filterService.cmsFilters.push(this._filterService.cmsFilters[d]);
        this._filterService.cmsFilterstxt += this._filterService.cmsFilters[d];
      }
    }
    // let dhis = this;
    // setTimeout(function () {
    //   dhis._cmsService
    //     .getcms(dhis.id)
    //     .subscribe((page) => dhis.preContext(page));
    // }, 2000);
  }

  preContext(page) {
    let dhis = this;
    //console.log(dhis._cmsService.pageSelected.title);
    //setTimeout(function () {
    if (
      dhis._cmsService.pageSelected.title != 'Root' &&
      dhis._cmsService.treelevels.length > 0
    ) {
      dhis._cmsService.pageReadyLink();
    }
    //}, 500);
  }

  propsready(res) {
    this._cmsService.properties = res;
  }

  get filesToUploadInfo(): FormArray {
    return this.cmsForm.get('filesToUploadInfo') as FormArray;
  }

  destroyPage(page: Page) {
    this._cmsService.destroyPage(page);
  }

  updatePage(psage: any) {
    this._cmsService
      .updatePage(psage.edited)
      .subscribe((status) => this.updatePageReady());
  }

  updatePageReady() {
    this._cmsService
      .getPages(this._cmsService.pageSelected.parent)
      .subscribe((pages) => this.getPagesReady(pages));
  }

  toggleCreateNewz(page) {
    this.getImageDData();
    this.createNew = !this.createNew;
  }

  createNewPage(page: Page) {
    this._cmsService.pages.push(page);
  }

  showEditUs(page) {
    this.createNew = !this.createNew;
  }

  getImageDData() {
    this._mediaService.getImages().subscribe((data) => this.getImagelist(data));
  }

  getPropertiesList() {
    this._cmsService
      .getPropertiesList()
      .subscribe((props) => this.setPropertiesList(props));
  }

  setPropertiesList(props) {
    this._cmsService.properties = props;
  }

  getImagelist(data) {
    this._mediaService.images = data;
    this.listBackgroundColors();
  }

  onInitReady(result) {
    this._cmsService.getModels();
    this.getPropertiesList();
    this._cmsService.resetParentPropFull();
    this._cmsService.setFilters();
    //console.log(this._cmsService.pageSelected.title);
    if (
      this._cmsService.pageSelected.title != 'Root' &&
      this._cmsService.pageSelected.kids > 0
    ) {
      this._cmsService
        .getchildcms(this._cmsService.pageSelected._id)
        .subscribe((result) => this._cmsService.onInitChildReady(result));
    }
  }

  showFilters() {
    let text = '<table><tr>';
    for (var i = 0; i < this._cmsService.pageSelected.filter.length; i++) {
      text +=
        '<td>' +
        this.getFilters(this._cmsService.pageSelected.filter[i]) +
        '</td>';
    }
    text += '</tr></table>';
    return text;
  }

  getFilters(column) {
    let text = '';
    var objectMerged = new Page();
    this.dataObject = objectMerged;
    this.objectProps = Object.keys(this.dataObject).map((prop) => {
      return Object.assign({}, { key: prop }, this.dataObject[prop]);
    });
    for (let prop of Object.keys(this.dataObject)) {
      if (prop == column) {
        var x = this.dataObject[prop];
        if (typeof x === 'number') {
        } else if (typeof x === 'string') {
        } else if (typeof x === 'boolean') {
        } else if (typeof x === 'object') {
          if (x instanceof Date) {
          } else {
          }
        } else {
        }
        if (column == 'parent') {
          document.getElementById('filterParent').classList.remove('hidden');
        }
        if (column == 'title') {
          document.getElementById('cmsFilterTitle').classList.remove('hidden');
        }
        if (column == 'secure') {
          document.getElementById('cmsFilterSecure').classList.remove('hidden');
        }
        if (column == 'dateCreated') {
        }
      }
    }
    return text;
  }

  getPagesReady(pages) {
    this._cmsService.pages = pages;
    this._cmsService.pages.unshift(this._cmsService.pageRoot);
    var element = document.getElementsByClassName('trow');
    for (var i = 0; i < element.length; i++) {
      if (element[i].id == 'row_' + this._cmsService.pageSelected._id) {
        this._cmsService.pageEdit(this._cmsService.pageSelected, i);
        document
          .getElementById('rowcell_' + this._cmsService.pageSelected._id)
          .click();
      }
    }
  }

  listBackgroundColors() {
    var element = document.getElementsByClassName('trow');
    for (var i = 0; i < element.length; i++) {
      if (i % 2 == 0) {
        element[i].classList.add('bg_lightgrey');
        element[i].classList.remove('bg_grey');
      } else {
        element[i].classList.remove('bg_lightgrey');
        element[i].classList.add('bg_grey');
      }
    }
  }

  getPropSelectLists() {
    this._cmsService
      .getPages('5a3cfe3e8e89191f15ed3491')
      .subscribe((res) => this.getPropSelectListsReady(res));
  }

  getPropSelectListsReady(res) {
    this._cmsService.lists = res;
  }
}
