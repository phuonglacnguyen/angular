import { Directive, Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { User, Address, Page } from './../../user/user';

import { FilterService } from './../../services/filter.service';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { FormsModule } from '@angular/forms';
import { FormGroupName, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators, EmailValidator, AbstractControl } from '@angular/forms';

import { MessageService } from './../../services/message.service';
import { News } from './../../../models/bots/News';
import { CmsObject } from './../../../models/object';
import { CmsProperty } from './../../../models/property';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { MyFilterPipe } from './../../pipes/my-filter.pipe';

import * as _moment from 'moment';
import * as  _rollupMoment from 'moment';
const moment = _rollupMoment || _moment;
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
    },
};

@Component({
  selector: 'app-cms-filters',
  templateUrl: './cms-filters.component.html',
  styleUrls: ['./cms-filters.component.css']
})


export class CmsFiltersComponent {
    items = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
    //filterargs = { index: 'a' };
    filterargs = { item: 'a' };
    //items = [{ title: 'a' }, { title: 'b' }, { title: 'c' }, { title: 'd' }, { title: 'e' }, { title: 'f' }, { title: 'g' }, { title: 'h' }, { title: 'i' }, { title: 'j' }, { title: 'k' }, { title: 'l' }, { title: 'm' }, { title: 'n' }, { title: 'o' }, { title: 'p' }, { title: 'q' }, { title: 'r' }, { title: 's' }, { title: 't' }, { title: 'u' }, { title: 'v' }, { title: 'w' }, { title: 'x' }, { title: 'y' }, { title: 'z' }];

    @Input() filterText;
    @Input() filterFirstletter;
    @Input() filterParent;
    @Input() filterMediaList;
    @Input() filterKidsList;
    @Input() filterPropertiesList;
    @Input() filterFilterList;
    @Input() cmsFilterVisible;
    @Input() cmsFilterSecure;
    @Input() cmsFilterdateCreated;
    @Input() cmsFilterEnddate;
    @Input() cmsFilterStartdate;
    @Input() cmsFilterBoolean;
    currentFilters = [];
    QuestionableBooleanPipe;
    public propForm: FormGroup;

    constructor(
        private _cmsService: CmsService,
        private _userService: UserService,
        private _messageService: MessageService,
        private _filterService: FilterService
    ) { 
        this.cmsFilterBoolean = false;
        this._filterService.filterUpdated.subscribe(
            (filterSelected: any) => this.ngFilterSelected()
        );
        this.filterFirstletter = '';
    }

    ngOnInit() {
        /*
        this.currentFilters = [];
        if (this.pageSelected.properties.length > 0) {
            for (var i = 0; i < this.pageSelected.properties.length; i++) {
                this.getProperty(this.pageSelected.properties[i])
                    .then(resprop => this.resprope(resprop));
            }

        }
        */
    }

    ngFilterSelected() {
        //console.log(this._filterService.vari);
    }

    ngOnChanges() {

    }

    setFilter(event, inputId) {
       //this._filterService.cmsFilters = [];
      // this._filterService.cmsFilterstxt = '';

       var xx = (document.getElementById(inputId)) as HTMLSelectElement;
       var x = xx.selectedIndex;
       var y = xx.options;
       var b = y[x].value;
       
       //this._filterService.cmsFilters = [];
       
       if (y[x].value == '') {
           this._filterService.cmsFilters = [];
           this._filterService.cmsFiltersArr = [];
           this._filterService.cmsFilterstxt = '';
           this._filterService.vilvar = {};
       } else if (typeof y[x].value !== 'undefined') {
           var isTrueSet = (b === 'true');
           //var vari = `{$inputId}:${isTrueSet}`;
           //var vari = { $inputId: isTrueSet };
           //console.log(isTrueSet + ':'+y[x].value);

           var a = this._filterService.cmsFiltersArr.indexOf(inputId);

           if (a != -1) { // bestaat niet

               // removes 0 elements from index 2, and inserts 'drum'
               var removed = this._filterService.cmsFiltersArr.splice((a), 1);
               var removed = this._filterService.cmsFilters.splice((a), 1);

               //delete this._filterService.cmsFiltersArr[a];
               //delete this._filterService.cmsFilters[a];
           } else {

           }

           var vari = {};
           vari[`${inputId}`] = isTrueSet;
           //this._filterService.vari.push(vari);
           //console.log(vari);
           this._filterService.cmsFilters.push(vari);
           this._filterService.cmsFiltersArr.push(inputId);

           //this._filterService.cmsFilterstxt = JSON.stringify(this._filterService.vilvar);

           //if (this._filterService.cmsFilterstxt != '')
           //    this._filterService.cmsFilterstxt += ',';
           //this._filterService.cmsFilterstxt += '{"' + inputId + '":' + isTrueSet + '}';

           //this._filterService.cmsFilterstxt += vari;

           //this._filterService.myJSON = JSON.stringify(this._filterService.cmsFilters);

           this._filterService.filterUpdated.emit(this._filterService.vari);
           this.cmsFiltersToText(inputId);
           //console.log(vari);
       } //else {
         //  this._filterService.cmsFilterstxt = '';
         //  this._filterService.cmsFilters = [];
       //}

       //console.log(this._filterService.vari);
       

       //console.log(this._filterService.cmsFilters);
       
       //this.cmsFiltersToArr(inputId);
    }

    cmsFiltersToArr(inputId) {
        if (this._filterService.cmsFilters.length > 0) {
            for (var j = 0; j < this._filterService.cmsFilters.length; j++) {
                console.log(this._filterService.cmsFilters[j]);
            }
        }
    }

    cmsFiltersToText(inputId) {
        this._filterService.cmsFilterstxt = '';
        var tazbfield = document.getElementsByClassName('filterInput');
        if (tazbfield.length > 0) {
            //this._filterService.cmsFilterstxt += '{';
            for (var i = 0; i < tazbfield.length; i++) {
                var name = tazbfield[i].getAttribute('id');
                var xx = (document.getElementById(name)) as HTMLSelectElement;
                var x = xx.selectedIndex;
                var y = xx.options;
                //if (xx.value != '') {
                var b = y[x].value;
                //var isTrueSet = (b === 'true');
                if (b != '') {
                    //console.log(name + ': ' + b);
                    var c: any;
                    if (b == 'false') {
                        c = false;
                    } else if (b == 'true') {
                        c = true;
                    } else {
                        c = b;
                    }
                    var vari = {};
                    vari[`${name}`] = c;
                    //this._filterService.vilvar = vari;
                    //this._filterService.vilvar[`"${name}"`] = c;
                    

                    if (this._filterService.cmsFilterstxt == '') {
                        //this._filterService.cmsFilterstxt = vari;
                        this._filterService.cmsFilterstxt += '"' + name + '": ' + c + ' '; // '{ ' +

                    } else {
                        //this._filterService.vilvar += ', {' + name + ':"' + b + '"}';
                        //this._filterService.cmsFilterstxt += ', ' + vari;
                        this._filterService.cmsFilterstxt += ', "' + name + '": ' + c + ' ';
                    } //else {
                    //  this._filterService.cmsFilterstxt += ' : ' + name + ':' + b;// + ' }';
                    //}


                    //this._filterService.cmsFilterstxt = vari;
                    //this._filterService.cmsFilterstxt += vari;

                    if (this._filterService.cmsFilterstxt != '') {
                        //this._filterService.cmsFilterstxt = this._filterService.cmsFilterstxt + ',';
                    }
                    //this._filterService.cmsFilterstxt = this._filterService.cmsFilterstxt + ',' + vari;

                    //var element = { name: "${b}" };
                    //this._filterService.cmsFilters.push(element);

                    //if (i == (tazbfield.length - 1)) {
                    //this._filterService.cmsFilterstxt += ' }';
                    //    console.log(this._filterService.cmsFilterstxt);
                    //}
                    var blaat = this._filterService.cmsFilterstxt;
                    //this._filterService.vilvar = { blaat };

                    var vari = {};
                    vari[`${name}`] = c;
                    this._filterService.vilvar = vari;

                }
                // this._filterService.cmsFilterstxt += '}';


                //}
            }
            //var blaat = this._filterService.cmsFilterstxt;
            //this._filterService.vilvar = { blaat };

            //this._filterService.cmsFilterstxt += '}';

            //var blaat = this._filterService.cmsFilterstxt;
            //this._filterService.vilvar = { blaat };
            //console.log(this._filterService.vilvar);
            //console.log(this._filterService.cmsFilterstxt);
            //console.log(this._filterService.cmsFilterstxt);
        };

            //console.log(this._filterService.cmsFilterstxt);
 

        /*
        var tmp = [];
        if (this._filterService.cmsFilters.length > 0) {
            for (var i = 0; i < this._filterService.cmsFilters.length; i++) {
                var vox = this._filterService.cmsFilters[i];
                var voz = vox.split(':');
                //console.log(voz[0]);

                tmp[voz[0]] = voz[1];

                
                
            }

            for (var prop in tmp) {
                //console.log(prop + ': ' + tmp[prop]);
                if (this._filterService.cmsFilterstxt == '') {
                    this._filterService.cmsFilterstxt = prop + ':' + tmp[prop] + '';
                } else {
                    this._filterService.cmsFilterstxt += ',' + prop + ':' + tmp[prop] + '';
                }
            }
            //console.log(this._filterService.cmsFilterstxt);
        }
        */
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>, elid: string) {
        var nfield = 'bid_' + elid;
        var nvalue = event.target.value;
        var tval = (new Date(nvalue)).toISOString();
        var sval = moment(event.target.value).format('D MMM YYYY');
        this.propForm.patchValue({ elid: sval });
    }

    toggleCheckbox(elema) {
        //if (this._cmsService.mustLogIn == false || this._userService.getUserLoggedIn() == true) {
        //    if (this._cmsService.mustLogIn == false || this._userService.user_current.userRole > 29) {
                var celema = document.getElementById(elema);
                celema.click();
                //this._filterService.cmsFilterBoolean = { "{elema}": "{this.cmsFilterBoolean}" };
                this._filterService.cmsFilterBoolean = `${elema} :  ${this.cmsFilterBoolean}`;
               // this._filterService.cmsFilterBoolean = this.cmsFilterBoolean;
        /*
                var celb = document.getElementsByClassName(elema);
                for (var i = 0; i < celb.length; i++) {
                    if (celb[i].getAttribute('class') == elema + ' icmn-checkbox-unchecked2') {
                        celb[i].setAttribute('class', elema + ' icmn-checkbox-checked2');
                    } else {
                        celb[i].setAttribute('class', elema + ' icmn-checkbox-unchecked2');
                    }
                }
        */
          //  } else {
           //     this._messageService.SetAlertDanger('Insufficient rights. Contact the administrator');
          //  }
       // } else {
       //     this._messageService.SetAlertDanger('Insufficient rights. Please login');
       // }
    }

    filterSelectFirstletter(event) {
        //console.log(event.target.value);
        this._filterService.filterFirstletter = event.target.value;
    }

    filterKeyword(event) {
        //console.log(event.target.value);
        this._filterService.filterText = event.target.value;
    }

    filterBooleanCheckbox(event, prop) {
        //console.log(event.target.value);
        //this.cmsFilterBoolean = event.target.value;
        //document.getElementById(prop._id);

        if (prop.pname.checked == false) {
            this.cmsFilterBoolean.checked = true;
        }
        else {
            if (prop.pname.checked == true) {
                this.cmsFilterBoolean.checked = false;
            }
        }
    }

    //filterFirstletter(event) {
        //console.log(event.target.value);
    //    this.filterargs = event.target.value;

    //}
}
