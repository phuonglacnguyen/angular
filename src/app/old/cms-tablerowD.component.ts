import { Compiler, NgModule, NgModuleFactory, AfterViewInit, NgModuleFactoryLoader, Injector, ViewContainerRef, ViewChild, Injectable, HostListener, ElementRef, Component, OnInit, Input, ComponentFactoryResolver, Inject, ReflectiveInjector } from '@angular/core';
import { CmsService } from './../../services/cms.service';
//import { DndModule } from 'ng2-dnd';
import { By } from '@angular/platform-browser';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/delay';
import { Page } from './../../../models/page';
import { Address } from './../../../models/address';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, FormGroupName, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators, EmailValidator, AbstractControl } from '@angular/forms';
import { News } from './../../../models/bots/News';
import { Users } from './../../../models/bots/Users';
import { CmsTablerowEComponent } from './cms-tablerowE.component';
import { CmsSubPagesDirective } from './../../directives/cms-subpages.directive';
import { FilterService } from './../../services/filter.service';
import { UserService } from './../../services/user.service';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

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
  selector: 'app-cms-tablerowD',
  templateUrl: './cms-tablerowD.component.html',
  styleUrls: ['./cms-tablerowD.component.css']
})

@Injectable()
export class CmsTablerowDComponent { // implements AfterViewInit
    @Input() cmsPages;
    @Input() userlogin;
    @Input() currentPage;
    @Input() tableLevel;
    cmsSubPages: Array<Page> = [];
    dropzone = 'dropzone_d';

    cmsSubPagesToggle = [];
    addressez = [];
    objectProps;
    dataObject;

    filterForm: FormGroup;

    container;
    constructor(
        public _userService: UserService,
        private _compiler: Compiler,
        private _injector: Injector,
        private loader: NgModuleFactoryLoader,
        public _cmsService: CmsService,
        public _filterService: FilterService
    ) {   }

    time: any;

    ngOnInit() {
       //this.createForm();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        //console.log(event);
        moveItemInArray(this.cmsPages, event.previousIndex, event.currentIndex);
        this.cmsPages.forEach((page, idx) => {
            //console.log(page);
            //page.pickorder = idx + 1;
            
            this._cmsService.updatePickorder(page._id, idx + 1)
                    .subscribe(res => console.log(res));
            
            
        });

        
      }
}
