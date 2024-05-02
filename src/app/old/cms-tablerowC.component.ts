import { Component, Input, OnInit, Injectable, ViewChild, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CmsService } from './../../services/cms.service';
//import { DndModule } from 'ng2-dnd';
import { By } from '@angular/platform-browser';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/of'; 
import { Page } from './../../../models/page';
import { DomSanitizer } from '@angular/platform-browser';
import { CmsSubPagesDirective } from './../../directives/cms-subpages.directive';
//import { DynamicComponentLoader } from './../../dynamic-component-loader/dynamic-component-loader.service';
import { CmsTablerowDComponent } from './cms-tablerowD.component';
//import { MessageComponent } from './../../dynamic-component-loader/message.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FilterService } from './../../services/filter.service';
import { UserService } from './../../services/user.service';
import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-cms-tablerowC',
  templateUrl: './cms-tablerowC.component.html',
  styleUrls: ['./cms-tablerowC.component.css']
})

@Injectable()
export class CmsTablerowCComponent implements OnInit { // implements AfterViewInit
    @Input() cmsPages;
    @Input() userlogin;
    @Input() currentPage;
    @Input() tableLevel;

    sortableList = [];
    dropzone = 'dropzone_c';

    constructor(
        public _userService: UserService,
        public _cmsService: CmsService,
        public _filterService: FilterService
    ) { }


    ngOnInit() {

    }

    ngOnChanges() {
        if (this.cmsPages != undefined && this.cmsPages.length > 0) {
            this._cmsService.sortableList = [];
            var tazbfield = this.cmsPages;
            for (var i = 0; i < tazbfield.length; i++) {
                //this._cmsService.sortableList.push(tazbfield[i].title);
            }
        }
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

      getDataKids(page) {
        if(page.title == "Media") {
            return "on";
        } else {
            return "off";
        }
    }
}
