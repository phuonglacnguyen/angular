import { Input, Component, Injectable  } from '@angular/core';
import { CmsService } from './../../services/cms.service';
import { FilterService } from './../../services/filter.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cms-table',
  templateUrl: './cms-table.component.html',
  styleUrls: ['./cms-table.component.css']
})

@Injectable()
export class CmsTableComponent  {
    @Input() cmsPages;
    @Input() userlogin;
    tableLevel = 0;

    constructor(
        public _cmsService: CmsService,
        private _http: HttpClient) {
    }

    onMove(page, position) {
        var element = document.getElementsByClassName('trow');
        for (var i = 0; i < element.length; i++) {
            var tekt = element[i].getAttribute('id');
            this.updatePickorder(tekt.replace('rowli_', ''), i);
        }
        const todoToDragEl = document.getElementById('rowul_' + page._id);
        triggerEvent(todoToDragEl, 'dragstart', 'MouseEvent');
        function triggerEvent(elem: HTMLElement, eventName: string, eventType: string) {
            const event: Event = document.createEvent(eventType);
            event.initEvent(eventName, true, true);
        }
    }

    updatePickorder(pageId, pickorder: number) {
        return this._http.get("/api/updatepickorder/" + pageId + "/" + pickorder)
            .pipe();
    }
}