import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaService } from './../../services/media.service';

@Component({
    selector: 'app-videoplayer-buttons',
    templateUrl: './videoplayer-buttons.component.html',
    styleUrls: ['./videoplayer-buttons.component.css']
})
export class VideoplayerButtonsComponent implements OnInit {
    @ViewChild('audio') audio; // , { static: true}
    constructor(private _mediaService: MediaService) { }

    ngOnInit() {
        
    }

    player_pause() {
        this._mediaService.player_pause()
            //.then(data => this.newMedia = data)
    }

}
