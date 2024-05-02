import { Component, NgModule, Input, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CmsService } from './../../services/cms.service';
import { By } from '@angular/platform-browser';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/of';
import { Page } from './../../../models/page';
import { DomSanitizer } from '@angular/platform-browser';
import { CmsSubPagesDirective } from './../../directives/cms-subpages.directive';
//import { DynamicComponentLoader } from './../../dynamic-component-loader/dynamic-component-loader.service';
import { CmsTablerowCComponent } from './cms-tablerowC.component';
//import { MessageComponent } from './../../dynamic-component-loader/message.component';
import { QuestionableBooleanPipe } from './../../pipes/boolean.pipe';
//import { DndModule } from 'ng2-dnd';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FilterService } from './../../services/filter.service';
import { UserService } from './../../services/user.service';

import { moveItemInArray, CdkDragDrop } from "@angular/cdk/drag-drop";
@Component({
    selector: 'app-cms-tablerowB',
    templateUrl: './cms-tablerowB.component.html',
    styleUrls: ['./cms-tablerowB.component.css']
})

@Injectable()
export class CmsTablerowBComponent { 
    @Input() cmsPages;
    @Input() currentPage;
    @Input() userlogin;
    @Input() tableLevel;
    dropzone = 'dropzone_B';
    
    constructor(
        public _userService: UserService,
        public _cmsService: CmsService,
        public _filterService: FilterService
    ) { 
       
    }

    ngOnInit() {
        
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

      getDataKids(page) {
        if(page.title == "Website") {
            return "on";
        } else {
            return "off";
        }
      }
}

/*
db.pages.update({"_id": ObjectId("5dcac71ab5db6e1f986c5c30")}, {$set: {cmsSubPages: [{ "_id" : "5c0d439264c6c530246b5689", "title" : "Videos", "kids" : "7", "treelevel" : "4" }, {"_id" : "5bd13b5af01e2a3d7c47dc42", "title" : "Music", "kids" : "9", "treelevel": "4"}, {"_id": "5bd14e37f01e2a3d7c47dc56", "title" : "Personal", "kids" : "5", "treelevel" : "4"}]}})
db.pages.update({"_id": ObjectId("5a11ca02aaa94d061a93e71c")}, {$set: {cmsSubPages: [{ "_id" : "5dcac71ab5db6e1f986c5c30", "title" : "Media", "kids" : "3", "treelevel" : "3", "cmsSubPages" : [{"_id" : "5c0d439264c6c530246b5689", "title" : "Videos", "kids" : "7", "treelevel" : "4"}, {"_id" : "5bd13b5af01e2a3d7c47dc42", "title" : "Music", "kids" : "9", "treelevel" : "4"}, {"_id" : "5bd14e37f01e2a3d7c47dc56", "title" : "Personal" , "kids" : "5", "treelevel" : "4"}] }, {"_id" : "5dcadbe5b5db6e1f986c5c33", "title" : "Apps", "kids" : "1", "treelevel": "3"}]}})
*/