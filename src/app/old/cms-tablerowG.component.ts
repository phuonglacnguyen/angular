import { Compiler, NgModule, NgModuleFactory, AfterViewInit, Injector, ViewContainerRef, ViewChild, Injectable, HostListener, ElementRef, Component, OnInit, Input, ComponentFactoryResolver, Inject, ReflectiveInjector } from '@angular/core';
import { CmsService } from './../../services/cms.service';

//import { DndModule } from 'ng2-dnd';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/delay';
//import { Page } from './../../user/user';
import { Page } from './../../../models/page';
import { Address } from './../../../models/address';
import { DomSanitizer } from '@angular/platform-browser';

import { FormGroupName, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators, EmailValidator, AbstractControl } from '@angular/forms';
import { News } from './../../../models/bots/News';
import { Users } from './../../../models/bots/Users';

import { CmsSubPagesDirective } from './../../directives/cms-subpages.directive';
//import { CmsFiltersComponent } from './../cms-filters/cms-filters.component';
import { FetchJsonPipe } from './../../pipes/fetch-json.pipe';
import { ParentPipe } from './../../pipes/parent.pipe';
import { FirstletterPipe } from './../../pipes/firstletter.pipe';
import { FilterService } from './../../services/filter.service';
import { UserService } from './../../services/user.service';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
//import { DynamicComponentLoader } from './../../dynamic-component-loader/dynamic-component-loader.service';
//import { DynamicComponentLoaderModule } from './../../dynamic-component-loader/dynamic-component-loader.module';


//import { DynamicComponentLoader } from './../../dynamic-component-loader/dynamic-component-loader.service';
//import { CmsTablerowListComponent } from './cms-tablerowlist.component';
//import { MessageComponent } from './../../dynamic-component-loader/message.component';

import * as _moment from 'moment';
//import * as _rollupMoment from 'moment';
import * as  _rollupMoment from 'moment';
const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DDTHH:mm:ss[Z]',
    },
    display: {
        dateInput: 'YYYY-MM-DDTHH:mm:ss[Z]',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    }
}; 

@Component({
  selector: 'app-cms-tablerowG',
  templateUrl: './cms-tablerowG.component.html',
  styleUrls: ['./cms-tablerowG.component.css']
})

@Injectable()
export class CmsTablerowGComponent { // implements AfterViewInit
    @Input() cmsPages;
    @Input() userlogin;
    @Input() currentPage;
    cmsSubPages: Array<Page> = [];
    @Input() tableLevel;
    dropzone = 'dropzone_f';

    cmsSubPagesToggle = [];
    addressez = [];
    objectProps;
    dataObject;
    imagetype: string;

    filterForm: FormGroup;
    
    public pageForm: FormGroup;
    public propForm: FormGroup;
    public pagePropForm: FormGroup;

    container;
    constructor(
        public _userService: UserService,
        private _compiler: Compiler,
        private _injector: Injector,
        //private loader: NgModuleFactoryLoader,
        public _cmsService: CmsService,
        private elementRef: ElementRef,
        public fb: FormBuilder,
        public _filterService: FilterService//,
        //private dynamicComponentLoader: DynamicComponentLoader
    ) { 
        //this._cmsService.pageSelectedUpdated.subscribe(
        //    (pageSelected: Page) => this.ngPageSelected()
        //);
    }
  /*
    time: any;

    @HostListener('click', ['$event.target'])
    onClick(target) {
        this.elementRef.nativeElement.querySelector('.mybuttonz')
            .addEventListener('click', this.onClicc.bind(this));
    }

    onClicc(event) {
        var pageId = document.getElementById(event.currentTarget.id);
        var tazbfield = document.getElementsByClassName('trow');
        for (var i = 0; i < tazbfield.length; i++) {
            tazbfield[i].classList.remove('active');
        }
        console.log(event + ' something onClicc');
    }
    */

    imagetypes(page) {
        if (page.parent == '5bf9cd3ce2776742d808319c') {
            return 'image';
        } else {
            return 'main';
        }
    }

    ngOnInit() {
       //this.createForm();
       //console.log(this._cmsService.pageSelected.objectType);

       if(this._cmsService.pageSelected.objectType == '5bf9cda3e2776742d808319d') {
        this.imagetype = 'main';
       } else {
        this.imagetype = "image";
       }
       //console.log(this.imagetype+' He?');
    }

    ngPageSelected() {
        //console.log('1');
        //this.createForm();
    }

    createForm() {
        //console.log('createForm');
        this.pageForm = this.fb.group({
            _id: new FormControl(this._cmsService.pageSelected._id),
            parent: new FormControl(this._cmsService.pageSelected.parent),
            title: new FormControl(this._cmsService.pageSelected.title), // , [Validators.required, Validators.minLength(2)]
            dateCreated: new FormControl(this._cmsService.pageSelected.dateCreated),
            visible: new FormControl(this._cmsService.pageSelected.visible),
            secure: new FormControl(this._cmsService.pageSelected.secure),
            treelevel: new FormControl(this._cmsService.pageSelected.treelevel),
            dateLast: new FormControl(this._cmsService.pageSelected.dateLast),
            createdBy: new FormControl(this._cmsService.pageSelected.createdBy),
            secretImages: this.fb.array([]),
            kids: new FormControl(this._cmsService.pageSelected.kids),
            listItem: new FormControl(this._cmsService.pageSelected.listItem),
            pickorder: new FormControl(this._cmsService.pageSelected.pickorder),
            schemaextend: this.fb.array([]),
            properties: this.fb.array([]),
            filter: this.fb.array([])
        });

        this.filterForm = this.fb.group({
            //_id: new FormControl(''),
            //type: new FormControl(''),
            values: new FormControl('')
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
            valuesarr: new FormControl('')
        });
        this.pagePropForm = this.fb.group({
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
            valuesarr: new FormControl(''),
            labels: new FormControl(''),
            labelsarr: new FormControl('')
        });

        this.dynamicForm();
    }

    dynamicForm() {
        const formModel = this.propForm.value;
        const pipeModel = this.filterForm.value;
        //console.log('dynamicForm');
        var newNews;
        this._cmsService.pagefiles = [];

        if (this._cmsService.parentPage._id == '5a44e48d62a3a12810e8b634') {
            newNews = new Users;
        } else if (this._cmsService.pageSelected.parent == '5a111281aaa94d061a93e71a') {
            newNews = new News;
            //console.log('News');
        }

        var objectMerged = Object.assign(this._cmsService.pageSelected);
        this.dataObject = this._cmsService.pageSelected;
        const formGroup = {};
        for (let prop of Object.keys(this.dataObject)) {
            if (prop == 'title') {
                formGroup['title'] = new FormControl(this._cmsService.pageSelected.title);
            } else if (prop == 'media') {
                formGroup[prop] = this.fb.array([]);
            } else if (prop == 'schemaextend') {
                formGroup['schemaextend'] = new FormGroup({});
                if (this._cmsService.pagetpropertiesFull && this._cmsService.pagetpropertiesFull.length > 0) {
                    //console.log('formfill extra fields...');
                    for (var i = 0; i < this._cmsService.pagetpropertiesFull.length; i++) {
                        var labelf = this._cmsService.pagetpropertiesFull[i].pname;
                        var propdata = this._cmsService.pagetpropertiesFull[i].type;
                        var propval;
                        if (this._cmsService.pageSelected.schemaextend[0] != undefined && this._cmsService.pageSelected.schemaextend[0][labelf] != undefined && this._cmsService.pageSelected.schemaextend[0][labelf] != '') {
                            propval = this._cmsService.pageSelected.schemaextend[0][labelf];
                        } else {
                            if (propdata == 'boolean') {
                                propval = false;
                            } else {
                                propval = '';
                            }
                        }
                        var required: any;
                        if (this._cmsService.pagetpropertiesFull[i].required == true) {
                            required = Validators.required;
                        } else {
                            required = '';
                        }
                        if (propdata == 'Date') {
                            var ndate = (new Date(propval));
                            formGroup['schemaextend'].addControl(labelf, new FormControl(ndate, required));
                            var bname = 'bid_' + labelf;
                            var tval = moment(propval).format('D MMM YYYY');
                            formGroup['schemaextend'].addControl(bname, new FormControl(tval, required));
                        } else if (propdata == 'boolean') {
                            if (propval == undefined)
                                propval = false;
                            //console.log('Boolean | ' + labelf + ' | ' + propval);
                            formGroup['schemaextend'].addControl(labelf, new FormControl(propval, required)); // , Validators.required
                        } else if (propdata == 'file') {
                            //console.log('file | ' + labelf + ' | ' + propval);
                            var b = this.getById(this._cmsService.properties, this._cmsService.parentPage.properties[i]);
                            if (this._cmsService.pageSelected.schemaextend[0] != undefined) {
                                var filenamez = this._cmsService.pagetpropertiesFull[i].values + '_' + this._cmsService.pageSelected._id + "." + this._cmsService.pageSelected.schemaextend[0].user_image;
                            } else {
                                var filenamez = "";
                            }
                            var contdiv = 'content_' + labelf;
                            if (propval != '' && filenamez != '') {
                                var file = '/api/assets/content/' + filenamez;
                                var url = '<a class="margin_r_10 icmn-info icomoon float_r" href="/api/assets/content/' + filenamez + '" target="_blank"></a><div class="thumbnail"><img src="' + file + '" class="" alt="" /></div>';
                                var filein = labelf;
                                this._cmsService.pagefiles.push({ div: contdiv, url: url, filein: filein });
                            } else {
                                this._cmsService.pagefiles.push({ div: contdiv, url: "", filein: '' });
                            }
                            formGroup['schemaextend'].addControl(labelf + '_extension', new FormControl((propval ? propval : ""))); // , Validators.required
                            formGroup['schemaextend'].addControl(labelf, new FormControl("", required)); // , Validators.required
                        } else if (propdata == 'Object') {
                            var tempobject = new FormArray([]);
                            if (labelf == 'addresses') {
                                formGroup['schemaextend'].addControl('addresses', new FormArray([]));
                                if (propval != '') {
                                    this.addressez = this._cmsService.pageSelected.schemaextend[0][labelf];
                                }
                            }
                        } else {
                            if (propval != '') {
                                formGroup['schemaextend'].addControl(labelf, new FormControl(propval, required)); // , Validators.required
                            } else {
                                formGroup['schemaextend'].addControl(labelf, new FormControl('')); // , Validators.required
                            }
                        }
                    }
                }
            } else {
                formGroup[prop] = new FormControl(this.dataObject[prop]);
            }
        }

        this.pageForm = new FormGroup(formGroup);
        this.setAddresses(this.addressez);
        this.schemaextend.setControl('addresses', this.addresses);
        this.checkDeleteButton(this._cmsService.pageSelected);
    }

    setAddresses(addresses: Address[]) {
        const addressFGs = addresses.map(address => this.fb.group(address));
        const addressFormArray = this.fb.array(addressFGs);
        this.pageForm.setControl('addresses', addressFormArray);
    }

    get addresses(): FormArray {
        return this.pageForm.get('addresses') as FormArray;
    };

    checkDeleteButton(page) {
        var element = document.getElementsByClassName('btndeletePage');
        if (this._cmsService.pageSelected.secure == true) {
            for (var i = 0; i < element.length; i++) {
                element[i].classList.add('hidden');
            }
        } else {
            for (var i = 0; i < element.length; i++) {
                element[i].classList.add('add');
            }
        }
    }

    getById(arr, id) {
        for (var d = 0, len = arr.length; d < len; d += 1) {
            if (arr[d] != '' && arr[d]._id === id) {
                return arr[d];
            }
        }
    }

    get schemaextend(): FormGroup {
        return this.pageForm.get('schemaextend') as FormGroup;
    };

  
  onMoveb(page: Page, position: number) {
      var element = document.getElementsByClassName('trow');
      for (var i = 0; i < element.length; i++) {
          var tekt = element[i].getAttribute('id');
          this._cmsService.updatePickorder(tekt.replace('tabrow_', ''), i);
      }
      const todoToDragEl = document.getElementById('trowul_' + page._id);
      triggerEvent(todoToDragEl, 'dragstart', 'MouseEvent');
      function triggerEvent(elem: HTMLElement, eventName: string, eventType: string) {
          const event: Event = document.createEvent(eventType);
          event.initEvent(eventName, true, true);
      }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    //console.log(event);
    moveItemInArray(this.cmsPages, event.previousIndex, event.currentIndex);
    this.cmsPages.forEach((page, idx) => {
        //console.log(page);
        //page.pickorder = idx + 1;
        
        this._cmsService.updatePickorder(page._id, idx + 1)
                .subscribe();
        
        
    });

    
  }

}
