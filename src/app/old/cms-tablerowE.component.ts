import { Compiler, NgModule, NgModuleFactory, AfterViewInit, NgModuleFactoryLoader, Injector, ViewContainerRef, ViewChild, Injectable, HostListener, ElementRef, Component, OnInit, Input, ComponentFactoryResolver, Inject, ReflectiveInjector } from '@angular/core';
import { CmsService } from './../../services/cms.service';
//import { CmsTablerowFComponent } from './../../cms/cms-table/cms-tablerowF.component';

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

import { CmsTablerowFComponent } from './cms-tablerowF.component';

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
  selector: 'app-cms-tablerowE',
  templateUrl: './cms-tablerowE.component.html',
  styleUrls: ['./cms-tablerowE.component.css']
})

@Injectable()
export class CmsTablerowEComponent { // implements AfterViewInit
    @Input() cmsPages;
    @Input() userlogin;
    @Input() currentPage;
    @Input() tableLevel;
    dropzone = 'dropzone_e';

    cmsSubPages: Array<Page> = [];

    cmsSubPagesToggle = [];
    addressez = [];
    objectProps;
    dataObject;

    filterForm: FormGroup;

    public pageForm: FormGroup;
    public propForm: FormGroup;
    public pagePropForm: FormGroup;

    container;
    constructor(
        public _userService: UserService,
        private _compiler: Compiler,
        private _injector: Injector,
        private loader: NgModuleFactoryLoader,
        public _cmsService: CmsService,
        public fb: FormBuilder,
        public _filterService: FilterService//,
        //private dynamicComponentLoader: DynamicComponentLoader
    ) { 
        //this._cmsService.pageSelectedUpdated.subscribe(
        //    (pageSelected: Page) => this.ngPageSelected()
        //);
    }

    time: any;
    /*
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

    ngOnInit() {
       //this.createForm();
    }

    ngPageSelected() {
        //console.log('1');
        //this.createForm();
    }

  getImdb(page) {
    this._cmsService.getImdb(page);
//      .then(res => this.getImdbReady(res))
  }


  getImdbReady(res) {
    //console.log(res);
  }
  createThumb(pageId) {
       this._cmsService.createThumb(pageId)
       .subscribe(res => this.createThumbReady(res))
   }
   createThumbReady(res) {

   }
    getMovieInfo(page) {
    this._cmsService.getMovieInfo(page)
      .subscribe(res => this.getMovieInfoReady(res))
  }
  getMovieInfoReady(res) {
    console.log(res);
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
