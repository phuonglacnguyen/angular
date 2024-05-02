import { Component, Input, Injectable } from '@angular/core';
import { CmsService } from './../../services/cms.service';
import { UserService } from './../../services/user.service';
import { FilterService } from './../../services/filter.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-cms-tablerow',
  templateUrl: './cms-tablerow.component.html',
  styleUrls: ['./cms-tablerow.component.css'],
})
@Injectable()
export class CmsTablerowComponent {
  @Input() cmsPages;
  @Input() currentPage;
  @Input() ParentPage;
  @Input() userlogin;
  @Input() tableLevel;
  classLevels: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  classLevelsmall: Array<string> = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
  ];

  constructor(
    public _userService: UserService,
    public _cmsService: CmsService,
    public _filterService: FilterService
  ) {}

  onDrop(event: any) {
    moveItemInArray(this.cmsPages, event.previousIndex, event.currentIndex);
    this.cmsPages.forEach((page, idx) => {
      this._cmsService.updatePickorder(page._id, idx + 1).subscribe();
    });
  }

  searchObjectFilter(page): number {
    return this._cmsService.filterObjectFullPage.findIndex(
      (e) => e.objectType == page.objectType
    );
  }

  getDataKids(page) {
    if (page.title == 'Media') {
      return 'on';
    } else {
      return 'off';
    }
  }
}
