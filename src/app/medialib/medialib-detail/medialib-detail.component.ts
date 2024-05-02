import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-medialib-detail',
  templateUrl: './medialib-detail.component.html',
  styleUrls: ['./medialib-detail.component.css']
})
export class MedialibDetailComponent implements OnInit {
    @Input() newMedia;    

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
      
  }

}
