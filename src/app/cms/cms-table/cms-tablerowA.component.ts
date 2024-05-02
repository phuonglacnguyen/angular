import { Component, Input, Injectable } from '@angular/core';
import { CmsService } from './../../services/cms.service';
import { UserService } from './../../services/user.service';
import { Page } from './../../../models/page';
import { FilterService } from './../../services/filter.service';

@Component({
    selector: 'app-cms-tablerowA',
    templateUrl: './cms-tablerowA.component.html',
    styleUrls: ['./cms-tablerowA.component.css']
})

@Injectable()
export class CmsTablerowAComponent {
    @Input() cmsPages: Array<Page> = [];
    @Input() currentPage: Page = new Page();
    @Input() userlogin: boolean = false;
    @Input() tableLevel: number = 0;

    constructor(
        public _userService: UserService,
        public _cmsService: CmsService,
        public _filterService: FilterService) { }

}
