import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { UserService } from './../../services/user.service';
import { User, Address, MediaImage } from './../user';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css'],
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

  constructor(private _userService: UserService, private fb: FormBuilder) {
    // this.createForm();
    // this.logNameChange();
  }
  public clicked = 'tab_1';
  public cdate = new Date();

  createForm() {
    this.userForm = this.fb.group({
      _id: [''],
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required]),
      telephone: new FormControl(''),
      secretLairs: this.fb.array([]),
      secretImages: this.fb.array([]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      dateCreated: [''],
      editable: [''],
      userRole: [''],
      active: [''],
      logins: [''],
      dateLast: [''],
    });
    this.addLair();
  }

  ngOnChanges() {
    // this.userForm.reset({
    //name: this.newUser.first_name
    // });
    this.createForm();
    //this.setAddresses(this.newUser.addresses);
  }
  get first_name() {
    return this.userForm.get('first_name');
  }
  get last_name() {
    return this.userForm.get('last_name');
  }
  get password() {
    return this.userForm.get('password');
  }

  get secretLairs(): FormArray {
    return this.userForm.get('secretLairs') as FormArray;
  }
  get secretImages(): FormArray {
    return this.userForm.get('secretImages') as FormArray;
  }
  setImages(images: MediaImage[]) {
    const imagesFGs = images.map((image) => this.fb.group(image));
    const imagesFormArray = this.fb.array(imagesFGs);
    this.userForm.setControl('secretImages', imagesFormArray);
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map((address) => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.userForm.setControl('secretLairs', addressFormArray);
  }

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }
  addImage() {
    this.secretImages.push(this.fb.group(new MediaImage()));
  }

  onSubmit() {
    this.newUser = this.prepareSaveUser();
    //console.log(this.newUser);
    this.create();
  }

  prepareSaveUser(): User {
    const formModel = this.userForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );
    const secretImagesDeepCopy: MediaImage[] = formModel.secretLairs.map(
      (images: MediaImage) => Object.assign({}, images)
    );
    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const saveUser: User = {
      _id: '',
      first_name: formModel.first_name as string,
      last_name: formModel.last_name as string,
      gender: formModel.gender as string,
      email: formModel.email as string,
      telephone: formModel.telephone as string,
      password: formModel.password as string,
      dateCreated: new Date() as Date,
      editable: formModel.editable as boolean,
      userRole: formModel.userRole as string,
      active: formModel.first_name as boolean,
      logins: 0,
      dateLast: new Date() as Date,
      addresses: formModel.addresses,
      images: formModel.images,
    };
    return saveUser;
  }

  revert() {
    this.ngOnChanges();
  }

  logNameChange() {
    const nameControl = this.userForm.get('first_name');
    nameControl.valueChanges.forEach((value: string) =>
      this.nameChangeLog.push(value)
    );
  }

  ngOnInit() {
    this.event.emit(this.goodbye);
  }

  create() {
    if (
      this.newUser.first_name != '' &&
      this.newUser.last_name != '' &&
      this.newUser.email != ''
    ) {
      this.newUser.dateCreated = new Date();
      this.createNewUserEvent.emit(this.newUser);
      this.newUser = new User();
      //this.sshowNewUser = false;
    }
  }

  sendParentValue() {
    this.myAweSomeValue = 'clicked from user-new.component';
    this.event.emit(this.myAweSomeValue);
  }

  sendToParent() {
    this.event.emit(this.goodbye);
  }

  settab(tabt, tid) {
    this.clicked = tid;
    document.getElementById('tab_1').className = 'hidden';
    document.getElementById('tab_2').className = 'hidden';

    var myButtonClasses = document.getElementById(tid).classList;
    myButtonClasses.add('show');
    myButtonClasses.remove('hidden');
  }
}
