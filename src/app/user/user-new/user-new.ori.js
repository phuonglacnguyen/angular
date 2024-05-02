import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { UserService } from './../user.service';
import { User, Address } from './../user';
//import { User, Address } from './../../data-model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-user-new',
    templateUrl: './user-new.component.html',
    styleUrls: ['./user-new.component.css']
})

export class UserNewComponent implements OnChanges {
    public newUser = new User();
    @Output() createNewUserEvent = new EventEmitter();
    @Input() myAweSomeValue;
    @Input() countriess;
    @Input() sshowNewUser;
    @Input() newsUser;
    @Output() myOutputValue = new EventEmitter();
    public goodbye = 'goodbye';
    @Output() event = new EventEmitter();
    @Input() uplistClick;

    userForm: FormGroup;
    nameChangeLog: string[] = [];

    constructor(
        private _userService: UserService,
        private fb: FormBuilder) {
        this.createForm();
        this.logNameChange();
    }

    createForm() {
        this.userForm = this.fb.group({
            name: '',
            secretLairs: this.fb.array([]),
            power: '',
            sidekick: ''
        });
    }

    ngOnChanges() {
        this.userForm.reset({
            name: this.newUser.first_name
        });
        this.setAddresses(this.newUser.addresses);
    }

    get secretLairs(): FormArray {
        return this.userForm.get('secretLairs') as FormArray;
    };

    setAddresses(addresses: Address[]) {
        const addressFGs = addresses.map(address => this.fb.group(address));
        const addressFormArray = this.fb.array(addressFGs);
        this.userForm.setControl('secretLairs', addressFormArray);
    }

    addLair() {
        this.secretLairs.push(this.fb.group(new Address()));
    }

    onSubmit() {
        this.newUser = this.prepareSaveUser();
        this._userService.update(this.newUser).subscribe(/* error handling */);
        this.ngOnChanges();
    }

    prepareSaveUser(): User {
        const formModel = this.userForm.value;

        // deep copy of form model lairs
        const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
            (address: Address) => Object.assign({}, address)
        );

        // return new `Hero` object containing a combination of original hero value(s)
        // and deep copies of changed form model values
        const saveUser: User = {
            _id: this.newUser._id,
            first_name: formModel.first_name as string,
            last_name: formModel.last_name as string,
            email: formModel.email as string,
            telephone: formModel.telephone as string,
            // address: formModel.first_name as string,
            addresses: this.fb.array([]),
            password: this.newUser.password,
            dateCreated: this.newUser.dateCreated,
            editable: formModel.first_name as boolean,
            userRole: formModel.first_name as string,
            active: formModel.first_name as boolean,
            logins: this.newUser.logins,
            dateLast: this.newUser.dateLast
            // addresses: formModel.secretLairs // <-- bad!
            //addresses: secretLairsDeepCopy
        };
        return saveUser;
    }

    revert() { this.ngOnChanges(); }

    logNameChange() {
        const nameControl = this.userForm.get('first_name');
        nameControl.valueChanges.forEach(
            (value: string) => this.nameChangeLog.push(value)
        );
    }

    ngOnInit() {
        this.event.emit(this.goodbye);
    }

    create() {
        if (this.newUser.first_name != '' && this.newUser.last_name != '' && this.newUser.email != '') {
            //console.log('create user-new.component event');
            this.newUser.dateCreated = new Date();
            // this.newUser.password = this.generateHash(this.newUser.password);
            //console.log(this.newUser.password);
            this.createNewUserEvent.emit(this.newUser);
            this.newUser = new User();
            this.sshowNewUser = false;
        }
    }

    sendParentValue() {
        this.myAweSomeValue = 'clicked from user-new.component';
        this.event.emit(this.myAweSomeValue);
    }

    sendToParent() {
        this.event.emit(this.goodbye)
    }

}
