import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-videoplayer-topbuttons',
    templateUrl: './videoplayer-topbuttons.component.html',
    styleUrls: ['./videoplayer-topbuttons.component.css']
})
export class VideoplayerTopButtonsComponent implements OnInit {
    @ViewChild('audio') audio; // , { static: true}

    constructor() { }

    ngOnInit() {
        
    }

    player_stop() {
        this.audio.pause();
    }

}
