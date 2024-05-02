import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { User, Address } from './../user';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
    @Input() user: User;

    @Output() updateUserEvent = new EventEmitter();
    @Input() userEdit: User = new User();
    @Output() destroyUserEvent = new EventEmitter();
    @Input() zzhowNewUser;

    userForm: FormGroup;
    nameChangeLog: string[] = [];

    constructor(
        private fb: FormBuilder,
    ) {
        this.createForm();
        this.logNameChange();
    }

    public clicked = 'tab_1';
    public cdate = new Date();



    ngOnInit() {
        Object.assign(this.userEdit, this.user);
        if (!this.user.logins) {
            this.user.logins = 0;
        }
        if (!this.user.dateLast) {
            this.user.dateLast = new Date();
        }


    }

    createForm() {
        this.userForm = this.fb.group({
            first_name: '',
            last_name: '',
            email: '',
            telephone: '',
            addresses: this.fb.array([]),
            password: '',
            userRole: '',
            active: '',
        });
    }

    setAddresses(addresses: Address[]) {
        const addressFGs = addresses.map(address => this.fb.group(address));
        const addressFormArray = this.fb.array(addressFGs);
        this.userForm.setControl('addresses', addressFormArray);
    }

    ngOnChanges() {
        this.userForm.reset({
            name: this.user.first_name
        });
        this.setAddresses(this.user.address);
    }

    logNameChange() {
        const nameControl = this.userForm.get('first_name');
        nameControl.valueChanges.forEach(
            (value: string) => this.nameChangeLog.push(value)
        );
    }

    destroy(user: User) {
        this.destroyUserEvent.emit(user);
    }


    update() {
        //console.log('save?');
        // this.userEdit.editable = false;
        // this.userEdit = Object.assign({}, this.user);

        this.updateUserEvent.emit({ original: this.user, edited: this.userEdit });
        // this.updateUserEvent.emit(this.userEdit);
        // console.log('save?');
    }


    settab(tabt, tid) {

        //let elements = document.getElementsByClassName("nav-pillz");
        // elements.removeClass('hidden');
        //  elements.addClass('show');

        //  document.getElementById('tabs div').classList.remove('show');
        //   document.getElementById('tabs div').classList.add('hidden');

        //document.getElementById('nav-pills').classList.remove('active');
        //document.getElementById('nav-pillz').classList.remove('active');


        document.getElementById('tab_1').className = 'hidden';
        document.getElementById('tab_2').className = 'hidden';
        document.getElementById('tab_3').className = 'hidden';
        document.getElementById('tab_4').className = 'hidden';

        var myButtonClasses = document.getElementById(tid).classList;
        myButtonClasses.add('show');
        myButtonClasses.remove('hidden');
        // document.getElementById(''+tid).className('show');


        // console.log(tid);
    }

    cancel_user_edit() {
        this.userEdit.editable = false;
        console.log('shit?');
    }


}
