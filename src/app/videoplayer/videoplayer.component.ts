import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MediaService } from './../services/media.service';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.css'],
})
export class VideoplayerComponent implements OnInit {
  Title = 'video_current_title';
  index = 0;
  playing = false;
  waitTime = 150;
  mediaPath = '/assets/media/';
  old_scroll_top = 1000;
  extension = 'mp4';
  updateBar = 1;
  scrsize = '60%';
  play_speed = 1;
  endtime = false;
  playButton = document.getElementById('btnPlay');
  bar = document.getElementById('defaultBar');
  progressBar = document.getElementById('progressBar');
  barSize = '#defaultBar';
  tracks = [];
  //public trackCount = this.images.length;
  npAction = '#npAction';
  npPath = '#npPath';
  npTitle = document.getElementById('video_current_title');
  mouseplay = false;
  tree_id = 0;
  volume = 50;
  paused = false;
  muted = false;
  audio = document.getElementById('video_mp4');
  current_time = 0;
  myPlayer: any;

  @Input('item_id') item_id;
  @Input('item_length') item_length;
  @Input('track_id') track_id;
  @Input('track_date') track_date;
  // @Input('newMedia') newMedia;
  @Input('images') images;
  @Input('playlistReady') playlistReady;
  @Input('MediaSelected') MediaSelected;

  @ViewChild('videoplayer', { static: true }) videoplayer: any; //
  @ViewChild('btnPlay', { static: true }) btnPlay: any; // , { static: true}
  @ViewChild('btnPause', { static: true }) btnPause: any; // , { static: true}
  @ViewChild('btnMute', { static: true }) btnMute: any; // , { static: true}
  @ViewChild('timejump', { static: true }) timejump: any; // , { static: true}

  constructor(private _mediaService: MediaService) {}

  ngOnInit() {
    this.myPlayer = this.videoplayer.nativeElement;
    //this.myPlayer.muted = true;
    //this.myPlayer.volume = 0;

    //console.log('blaat ?', this.images);
    //this.createPlaylist();
    // console.log(this.playlistReady);
    var par = this.myPlayer;
    this.myPlayer.addEventListener(
      'volumechange',
      function () {
        par.volume = par.volume.toFixed(1);
      },
      false
    );

    this.myPlayer.addEventListener(
      'play',
      function () {
        par.playing = true;
        //this.playbuttonz_on();
      },
      false
    );

    this.myPlayer.addEventListener(
      'playing',
      function () {
        par.playing = true;
      },
      false
    );

    this.myPlayer.addEventListener(
      'pause',
      function () {
        par.playing = false;
        //this.paused = true;
      },
      false
    );

    this.myPlayer.addEventListener(
      'ended',
      function () {
        par.playing = false;
        par.npAction.text('Media ended.');
        if (par.index + 1 < par.trackCount) {
          par.index++;
          par.playTrack(par.index);
        } else {
          par.myPlayer.pause();
          par.index = 0;
          par.playTrack(par.index);
        }
      },
      false
    );
  }

  player_mute(muteValue) {
    this.myPlayer.muted = !this.myPlayer.muted;
    //e.preventDefault();
    // console.log(this.myPlayer.muted);
    if (muteValue == 1) {
      document.getElementById('player_volume_mute').className = 'hidden';
      document.getElementById('player_volume_unmute').className =
        'col-md-1 icon icmn-volume-medium';
      this.myPlayer.volume = 0.3;
      //aj_get('ajax', 'set_sound', 'sound=-1');
    } else {
      document.getElementById('player_volume_mute').className =
        'col-md-1 icon icmn-volume-mute2';
      document.getElementById('player_volume_unmute').className = 'hidden';
      //this.myPlayer.muted = true;
      this.myPlayer.volume = 0;
      //aj_get('ajax', 'set_sound', 'sound=1');
    }
  }

  player_play() {
    this.myPlayer.play();
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4 hidden';
    document.getElementById('player_pause').className =
      'col-md-1 icon icmn-pause2';
    //this.myPlayer.setAttribute('src', '/api/assets/media/' + this.images[0]._id + '/main.mp4');
  }

  player_stop() {
    this.myPlayer.pause();
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4';
    document.getElementById('player_pause').className =
      'col-md-1 icon icmn-pause2 hidden';
  }

  //ngOnChanges() {
  player_forward() {
    this.myPlayer.pause();
    if (this.index + 1 > this.images.length) {
      //console.log('kan niet meer vooruit');
      this.index = 0;
    } else {
      this.index = this.index + 1;
      //console.log('next item: ' + this.images[this.index]._id);
      this.myPlayer.setAttribute(
        'src',
        '/api/assets/media/' + this.images[this.index]._id + '/main.mp4'
      );
      this.myPlayer.play();
    }
  }

  player_back() {
    this.myPlayer.pause();
    if (this.index == 0) {
      console.log('kan niet meer terug');
      this.index = 0;
    } else {
      this.index = this.index - 1;
      //console.log('prev item: ' + this.images[this.index]._id);
      this.myPlayer.setAttribute(
        'src',
        '/api/assets/media/' + this.images[this.index]._id + '/main.mp4'
      );
      this.myPlayer.play();
    }
  }

  playlistReadyz() {
    // this.createPlaylist();
  }

  createPlaylist() {
    var playlist_text;
    console.log('current track: ' + this.images[0]._id);
  }

  playbuttonz_on() {
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4 text_red';
  }

  playbuttonz_off() {
    document.getElementById('player_play').className =
      'col-md-1 icon icmn-play4';
  }

  player_pause(event: any) {
    if (this.playing == true) {
      //this.myPlayer.pause();
      //this.playing = false;
      //document.getElementById('player_play').className = 'col-md-1 icon icmn-play4 hidden';
      // document.getElementById('player_pause').className = 'col-md-1 icon icmn-pause2';
    } else {
      //this.myPlayer.play();
      // this.playing = true;
      // document.getElementById('player_play').className = 'col-md-1 icon icmn-play4';
      // document.getElementById('player_pause').className = 'col-md-1 icon icmn-pause2 hidden';
    }
    //console.log(this.playing);
    //this.myPlayer.pause();
  }

  player_toggle_mute(event: any) {
    if (
      document.getElementById('player_volume_mute').className ==
      'col-md-1 icon icmn-volume-mute2'
    ) {
      document.getElementById('player_volume_mute').className =
        'col-md-1 icon icmn-volume-medium';
      this.myPlayer.muted = false;
    } else {
      document.getElementById('player_volume_mute').className =
        'col-md-1 icon icmn-volume-mute2';
      this.myPlayer.muted = true;
    }
  }

  player_volumeUp(e) {
    this.myPlayer.muted = false;
    var vol = (this.myPlayer.volume + 0.1).toFixed(1);
    if (vol != '1.1') {
      this.myPlayer.volume = vol;
      document.getElementById('video_volume').innerHTML =
        this.myPlayer.volume * 100 + '%';
      document.getElementById('player_volume_mute').className = 'hidden';
      document.getElementById('player_volume_unmute').className =
        'col-md-1 icon icmn-volume-medium';
    } else {
      document.getElementById('player_volume_mute').className =
        'col-md-1 icon icmn-volume-mute2';
      document.getElementById('player_volume_unmute').className = 'hidden';
    }
  }

  player_volumeDown(e) {
    var vol = (this.myPlayer.volume - 0.1).toFixed(1);
    if (vol != '-0.1') {
      this.myPlayer.volume = vol;
      document.getElementById('video_volume').innerHTML =
        this.myPlayer.volume * 100 + '%';
      document.getElementById('player_volume_mute').className =
        'col-md-1 icon icmn-volume-mute2';
      document.getElementById('player_volume_unmute').className = 'hidden';
    } else {
      document.getElementById('player_volume_mute').className = 'hidden';
      document.getElementById('player_volume_unmute').className =
        'col-md-1 icon icmn-volume-medium';
    }
  }

  player_seek_back(event) {
    var cid = 10;
    var videotime = this.myPlayer.currentTime;
    if (event.which == 1) {
      this.current_time = parseInt(videotime) - cid;
    } else if (event.which == 2) {
      // middle mouse
      this.current_time = parseInt(videotime) - 180;
    } else if (event.which == 3) {
      // right mouse
      this.current_time = parseInt(videotime) - 60;
    }
    this.myPlayer.currentTime = this.current_time;
  }

  player_seek_forward(event) {
    var cid = 10;
    var videotime = this.myPlayer.currentTime;
    if (event.which == 1) {
      this.current_time = parseInt(videotime) + cid;
    } else if (event.which == 2) {
      // middle mouse
      this.current_time = parseInt(videotime) + 180;
    } else if (event.which == 3) {
      // right mouse
      this.current_time = parseInt(videotime) + 60;
    }
    //console.log(this.current_time);
    this.myPlayer.currentTime = this.current_time;
  }

  loadTrack(id) {
    //audio.pause();
    var index = id;

    /*
        $(".rating_labels").removeClass('txt_green');
        $(".rating_label").removeClass('txt_green');
        $('.heo_rating').prop('checked', false);
        if (tracks[(index)].rating == 0) {
            //aj_get('ajax', 'set_rating', "rating=4&clip_id="+$("#item_id").val());
            //alert(tracks[(index)].rating);
            var asx = $("#filter_rating").val();

            if (asx != '') {
                $(".heo_rating").each(function () {
                    if (asx == $(this).val()) {
                        $(this).prop('checked', true);
                        $(".mod_rating_" + $(this).val()).addClass('txt_green');
                        tracks[(index)].rating = $(this).val();
                        //$("#row_"+(index)).find('.rating').html($(this).val());
                    }
                });
            }
        } else {

            //$(".rating_label").removeClass('txt_green');
            //alert(tracks[(index)].rating);
            $(".heo_rating").each(function () {
                if ($(this).val() == tracks[(index)].rating) {
                    $(this).prop('checked', true);
                    $("." + $(this).attr('id')).css('display', 'inline-block');
                    $("." + $(this).attr('id')).addClass('txt_green');
                    tracks[(index)].rating = $(this).val();
                    //$("#row_"+(index)).find('.rating').html($(this).val());
                }
            });


        }
        //$("#row_"+(index)).find('.rating').html(old_hits);

        //$('#save_supershot').css('display', 'inline-block');
        //$('.updaterclaszz').attr('data-id', tracks[(index)].tree_id);
        $('#trim_blackborder').attr('data-status', '');
        old_hits = parseInt(parseInt($("#row_" + (index)).find('.thits').html()) + 1);
        $("#row_" + (index)).find('.thits').html(old_hits);
        //$("#video_autoplay span").html("True");
        if (tracks[(id)].clip_codec == 'wmv3') {
            var extension = 'wmv';
        } else {
            var extension = 'mp4';
        }


        //alert(tracks[(index)].categorys);

        var txt = '';
        if (index > 5)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 6)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        if (index > 4)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 5)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        if (index > 3)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 4)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        if (index > 2)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 3)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        if (index > 1)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 2)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        if (index > 0)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) - 1)].tree_id + '.jpg" alt="image preview" width="120" height="75" />';
        txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(index)].tree_id + '.jpg" alt="image preview" width="120"  height="75" class="current" />';
        if ((index + 2) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 1)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 3) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 2)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 4) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 3)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 5) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 4)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 6) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 5)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 7) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 6)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 8) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 7)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 9) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 8)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        if ((index + 10) < trackCount)
            txt = txt + '<img src="/assets/properties/detail/NL_plaatje1_' + tracks[(parseInt(index) + 9)].tree_id + '.jpg" alt="image preview" width="120"  height="75" />';
        //$('#thumb_holder').html(txt);

        volu = $('#video_volume span').html();
        volu = volu.replace("%", "");
        document.getElementById("video_mp4").volume = '0.' + parseInt(parseInt(volu) / 10);

        $('.plSel').removeClass('plSel');
        $('#plUL .current').removeClass('current');
        $('#plUL tr').removeAttr('class');

        $('#plUL tr:eq(' + id + ')').addClass('plSel');
        $('#plUL tr:eq(' + id + ')').addClass('current');


        $("#tab_10 h2 a").css('color', '#ffffff');
        $("#tab_10 .current").removeClass('current');

        //$('#tab_10 .blok').css('Opacity', '0.5');

        //$("#tab_10").find('h2').css('color', '#cccccc');
        $('#tab_10 .blok:eq(' + id + ')').find('h2 a').css('color', '#f558a9');
        $('#tab_10 .blok:eq(' + id + ')').addClass('current');
        //$('#tab_10 .blok:eq(' + id + ')').css('Opacity', '1.0');

        if ($(".auto_blok_check").hasClass('active')) {
            if ($('#tabs .tab_10').hasClass('current')) {
                $('#tab_10').find('.updaterclaszz').prop('checked', false);
                $('#tab_10 .blok:eq(' + id + ')').find('.updaterclaszz').prop('checked', true);
            } else if ($('#tabs .tab_1').hasClass('current')) {
                $('#tab_1').find('.updaterclaszz').prop('checked', false);
                $('#tab_1 .tables tr:eq(' + (id + 1) + ')').find('.updaterclaszz').prop('checked', true);
            }
        }

        var title = tracks[(index)].name;

        if (tracks[(index)].channel != 0)
            title = title + ' | S: ' + tracks[(index)].channel;

        if (tracks[(index)].categorys != 0)
            title = title + ' | C: ' + tracks[(index)].categorys;


        $('#video_current_title').html(capitalizeFirstLetter(title.replace('_', ' ')));

        npTitle.text('Now playing: ' + capitalizeFirstLetter(title.toLowerCase()));
        $('.data_treeid').attr('data-treeid', tracks[(index)].tree_id);

        if (tracks[(index)].categorys != '') {
            $(".clip_sategory").css('display', 'inline-block');
            $(".clip_sategory").html('Category : ' + tracks[(index)].categorys);
        } else {
            $(".clip_sategory").css('display', 'none');
            $(".clip_sategory").html('');
        }

        if (tracks[(index)].channel != 0) {
            $(".clip_schannel").css('display', 'inline-block');
            $(".clip_schannel").html('Channel : ' + tracks[(index)].channel);
        } else {
            $(".clip_schannel").css('display', 'none');
            $(".clip_schannel").html('');
        }

        $('#current_res, .current_res').html(tracks[(index)].width + 'x' + tracks[(index)].height);

        if (tracks[(index)].thumbs_ok == 1) {
            //$('#defaultBar').attr('title', tracks[(index)].name);
            $("#defaultBar").attr('data-img', '/assets/clip/thumbs/' + tracks[(index)].tree_id + '/1.jpg');
            $('#defaultBar').addClass('cbutton');
        } else {
            $('#defaultBar').attr('title', '');
            $("#defaultBar").attr('data-img', '');
            $('#defaultBar').removeClass('cbutton');
        }
        //tooltipz();

        if (tracks[(index)].pic1_time > 0) {
            $("#pic1_time").html('Pic1 time: ' + tracks[(index)].pic1_time);
        } else {
            $("#pic1_time").html('Pic1 time not set');
        }

        if ($("#filter_cliptype_bestof2").is(':checked')) {
            audio.pause();
            audio.src = mediaPath + 'NL_bestof_' + tracks[(index)].tree_id + '_' + tracks[(index)].bestof + '.' + extension;
        } else {
            audio.pause();
            audio.src = mediaPath + tracks[(index)].file + '.' + extension;
        }

        $('#save_video').attr('href', '/assets/properties/NL_clip_' + tracks[(index)].tree_id + '.' + extension);
        $('#current_filename').html('NL_clip_' + tracks[(index)].tree_id + '.' + extension);
        $('#admin_edit_link, .admin_link').attr('href', '/admin/index.php?id=' + tracks[(index)].tree_id + '&route=cms');
        $('#download_button1').attr('href', '/assets/properties/NL_clip_' + tracks[(index)].tree_id + '.' + extension);
        $('#download_button2').attr("onclick", "window.open('http://<?php echo $_SERVER['HTTP_HOST'];?>/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=" + tracks[(index)].width + "&height=" + tracks[(index)].height + "&file_extension='+ext+', '<?php echo date('YmdHis');?>','width=" + tracks[(index)].width + ",height=" + tracks[(index)].height + "');");

        if (tracks[(id)].bestof != '0') {
            $('#download_button3').attr("onclick", "window.open('http://<?php echo $_SERVER['HTTP_HOST'];?>/index.php?page_id=<?php echo $page_id;?>&popup=3&tree_id=" + tracks[(index)].tree_id + "&val_multi_id=" + tracks[(index)].bestof + "&file_id=" + tracks[(index)].tree_id + "&width=" + tracks[(index)].width + "&height=" + tracks[(index)].height + "&file_extension=mp4', '<?php echo date('YmdHis');?>','width=" + tracks[(index)].width + ",height=" + tracks[(index)].height + "');");
            //alert(tracks[(index)].tree_id);
            $(".delete_asset_file").css('display', 'inline-block');
            $(".delete_asset_file").attr('data-asset', 'NL_bestof_' + tracks[(index)].tree_id + '_' + tracks[(index)].bestof + '.' + extension);
            $(".delete_asset_file").attr('data-treeid', tracks[(index)].tree_id);
        } else {
            $(".delete_asset_file").css('display', 'none')
            $('#download_button3').attr('onclick', '');
        }
        if (tracks[(id)].supershot != '0') {
            $('#download_button4').attr("onclick", "window.open('http://<?php echo $_SERVER['HTTP_HOST'];?>/index.php?page_id=<?php echo $page_id;?>&popup=2&file_id=" + tracks[(index)].tree_id + "&val_multi_id=" + tracks[(index)].bestof + "&width=" + tracks[(index)].width + "&height=" + tracks[(index)].height + "&file_extension=mp4','<?php echo date('YmdHis');?>','width=" + tracks[(index)].width + ",height=" + tracks[(index)].height + "');");

            $(".delete_ssset_file").css('display', 'inline-block');
            $(".delete_asset_file").attr('data-asset', 'NL_supershot_' + tracks[(id)].tree_id + '_' + tracks[(id)].supershot + '.' + extension);
            $(".delete_asset_file").attr('data-treeid', tracks[(id)].tree_id);
        } else {
            $(".delete_ssset_file").css('display', 'none');
        }

        if (tracks[(index)].thumbs_ok > 0) {
            $(".thumbs_ok").html('Thumbs ok');
            //$("#l_update_thumbs").addClass('current');
        } else {
            $(".thumbs_ok").html('No thumbs');
            //$("#l_update_thumbs").removeClass('current');

            if ($("#l_auto_update_thumbs").hasClass('current')) {
                //l_auto_update_thumbs;
            }
        }

        if ($("#filter_cliptype_bestof2").is(':checked')) {

            var nwidth = tracks[(id)].videoex_width;
            var nheight = tracks[(id)].videoex_height;
            var nfiles = tracks[(id)].videoex_filesize;
            var nlengt = tracks[(id)].videoex_playtime;

        } else {
            var bwidth = tracks[(id)].width;
            var nheight = tracks[(id)].height;
            var nfiles = tracks[(id)].filesiz;
            var nlengt = tracks[(id)].length;
        }

        width = 1280;
        if (bwidth > 0) {
            factor = (bwidth / 1280);
            height = parseInt(nheight / factor);
        } else {
            height = 720;
        }
        $('#download_button5').attr("onclick", "window.open('http://<?php echo $_SERVER['HTTP_HOST'];?>/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=" + width + "&height=" + height + "&file_extension=mp4', '" + tracks[(index)].tree_id + "<?php echo date('YmdHis');?>','width=" + width + ",height=" + height + "');");
        width = 480;
        if (bwidth > 0) {
            factor = (bwidth / 480);
            height = parseInt(nheight / factor);
        } else {
            height = 360;
        }
        $('#download_button6').attr("onclick", "window.open('http://<?php echo $_SERVER['HTTP_HOST'];?>/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=" + width + "&height=" + height + "&file_extension=mp4','" + tracks[(index)].tree_id + "<?php echo date('YmdHis');?>','width=" + width + ",height=" + height + "')");
        $('#download_button7').attr("href", "/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=25p&height=25p&file_extension=mp4");
        $('#download_button8').attr("href", "/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=25p&height=25p&file_extension=mp4");
        $('#download_button9').attr("href", "/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=25p&height=25p&file_extension=mp4");
        $('#download_button10').attr("href", "/index.php?page_id=<?php echo $page_id;?>&popup=1&file_id=" + tracks[(index)].tree_id + "&width=25p&height=25p&file_extension=mp4");

        $('#channels').val(tracks[(id)].channel);

        $('#video_current_filesize').html(nfiles);
        $('#video_current_resolution').html(nwidth);
        $('#video_total_time').html(parseInt((nlengt / 60)));
        var s = parseInt((nlengt) % 60);
        var m = parseInt(((nlengt) / 60) % 60);
        var h = parseInt(((nlengt) / 3600) % 24);
        var newtime = (h < 10 ? "0" + h : h) + ':' + (m < 10 ? "0" + m : m) + ':' + (s < 10 ? "0" + s : s);
        if (newtime != "NaN:NaN:NaN")
            $('#audio_time_remaining_b').html(newtime);

        if ($("#filter_tab").val() == "1") {
            //alert('yes');
            var myContainer = $('#plwrap')
            var scrollTos = $('#plUL .current');
            //alert('wat?');
            myContainer.animate({
                scrollTop: (scrollTos.offset().top - 20) - myContainer.offset().top + myContainer.scrollTop()
            });
        } else if ($("#filter_tab").val() == "10") {
            //alert('yes');
            var myContainer = $('#tab_10 .plwrap')
            var scrollTos = $('#tab_10 .plwrap .current');
            //alert('wat?');
            myContainer.animate({
                scrollTop: (scrollTos.offset().top) - myContainer.offset().top + myContainer.scrollTop()
            });
        }

        //$('#btn_start_cum').attr('data-time',tracks[(id)].timecum);
        $('#btn_start_action').attr('data-time', tracks[(id)].taction);

        //$container = $("#plwrap");
        //$container.animate({scrollTop: $scrollTo.offset().top , scrollLeft: 0},300);
        //$container.animate({ scrollTop: ($scrollTo.offset().top) },500); 

        //$("#plwrap").scrollTop($scrollTo.offset().top);


        //$("#tab_10 .plwrap").scrollTop($scrollTo.offset().top);



        if (tracks[(id)].ufavorite > 0) {
            $("#video_button_menu .icon-heart2").css('display', 'inline-block');
            $("#heo_favorite").removeClass('bg_blue');
            $("#heo_favorite").addClass('bg_pink');
            $("#row_" + id + " .icon-heart2").css('display', 'inline-block');
        } else {
            $("#video_button_menu .icon-heart2").css('display', 'none');
            $("#heo_favorite").removeClass('bg_pink');
            $("#heo_favorite").addClass('bg_blue');
            $("#row_" + id + " .icon-heart2").css('display', 'none');
        }
        $(".icon-heart2, .icon-heart").attr('data-tree-id', tracks[(id)].tree_id);

        $("#clip_timesdi").html('');
        $("#clip_times_cumdi").html('');
        $("#clip_times_enddi").html('');

        if (tracks[(id)].taction > 0) {
            if (!$("#clip_times ul li").length)
                $("#clip_times ul").append('<li class="remove_time_action" data-value="' + parseInt(tracks[(id)].taction) + '" data-id="' + tracks[(id)].tree_id + '">' + seconds_to_time(tracks[(id)].taction) + '</li>');
            $("#time_action").attr('id', 'btn_start_action');
            $("#btn_start_action").parent().removeClass('bg_blue');
            $("#btn_start_action").parent().addClass('bg_green');
            //$("#blok_"+tracks[(id)].tree_id+" .twow").removeClass('txt_black');
            $("#blok_" + tracks[(id)].tree_id + " .twow").addClass('txt_green');
            //$("#row_"+id+" .btn_start_action").css('display', 'inline-block');
        } else {
            $("#btn_start_action").attr('id', 'time_action');
            $("#clip_times ul li").html();
            $("#time_action").parent().removeClass('bg_green');
            $("#time_action").parent().addClass('bg_blue');
            $("#blok_" + tracks[(id)].tree_id + " .twow").removeClass('txt_green');
            //$("#blok_"+tracks[(id)].tree_id+" .twow").addClass('bg_black');
            //$("#row_"+id+" .btn_start_action").css('display', 'none');
            //alert('nee?');
        }
        if (tracks[(id)].timecum > 0) {
            if (!$("#clip_times_cum ul li").length)
                $("#clip_times_cum ul").append('<li class="remove_time_cum" data-value="' + parseInt(tracks[(id)].timecum) + '" data-id="' + tracks[(id)].tree_id + '">' + seconds_to_time(tracks[(id)].timecum) + '</li>');
            $("#time_cum").attr('id', 'btn_start_cum');
            $("#btn_start_cum").parent().removeClass('bg_blue');
            $("#btn_start_cum").parent().addClass('bg_green');
            //$("#blok_"+tracks[(id)].tree_id+" .tdrum").removeClass('bg_black');
            $("#blok_" + tracks[(id)].tree_id + " .tdrum").addClass('txt_green');
            $("#row_" + index + " .tdrum .btn_cum_action").css('display', 'inline-block');
        } else {
            $("#btn_start_cum").attr('id', 'time_cum');
            $("#clip_times_cum ul li").html();
            $("#time_cum").parent().removeClass('bg_green');
            $("#time_cum").parent().addClass('bg_blue');
            $("#blok_" + tracks[(id)].tree_id + " .tdrum").removeClass('txt_green');
            //$("#blok_"+tracks[(id)].tree_id+" .tdrum").addClass('bg_black');
            $("#row_" + index + " .tdrum .btn_cum_action").css('display', 'none');
        }

        if (tracks[(id)].timeend > 0) {
            if (!$("#clip_times_end ul li").length)
                $("#clip_times_end ul").append('<li class="remove_time_end" data-value="' + parseInt(tracks[(id)].timeend) + '" data-id="' + tracks[(id)].tree_id + '">' + seconds_to_time(tracks[(id)].timeend) + '</li>');
            $("#time_end").attr('id', 'btn_start_end');
            $("#btn_start_end").parent().removeClass('bg_blue');
            $("#btn_start_end").parent().addClass('bg_green');
            //$("#blok_"+tracks[(id)].tree_id+" .tstop").removeClass('bg_black');
            $("#blok_" + tracks[(id)].tree_id + " .tstop").addClass('txt_green');
            $("#row_" + index + " .tstop .btn_stop_action").css('display', 'inline-block');
        } else {
            $("#btn_start_end").attr('id', 'time_end');
            $("#clip_times_end ul li").html();
            $("#time_end").parent().removeClass('bg_green');
            $("#time_end").parent().addClass('bg_blue');
            $("#blok_" + tracks[(id)].tree_id + " .tstop").removeClass('txt_green');
            //$("#blok_"+tracks[(id)].tree_id+" .tstop").addClass('bg_black');
            $("#row_" + index + " .tstop .btn_stop_action").css('display', 'none');
        }

        if (tracks[(id)].unfinished > 0) {
            $("#l_unfinished").css('color', '#d00000');
        } else {
            $("#l_unfinished").css('color', '#000000');
        }

        $("#video_volume span").html(parseInt(audio.volume * 100) + '%');
        if (audio.muted == true) {
            $(".icon-volume-medium").css('display', 'none');
            $(".icon-volume-mute2").css('display', 'inline-block');
        } else {
            $(".icon-volume-medium").css('display', 'inline-block');
            $(".icon-volume-mute2").css('display', 'none');
        }

        //category_check(tracks[(id)].categorys);
        //rating_check(tracks[(id)].rating);
        updateBar = setInterval(movupdate, 500);

        //aj_get('ajax', 'update_hits', "tree_id="+tracks[(id)].tree_id);

        $("#row_" + index + " .clip_hits").html(parseInt(parseInt($("#row_" + index + " .clip_hits").html()) + 1));

        //aj_get('tab_6', 'update_clip_info', "clip_id="+tracks[(id)].tree_id);

        //aj_get('supershot', 'update_clip_supershot', "clip_id="+tracks[(id)].tree_id);

        if (tracks[(id)].bestof > 0) {
            $("#video_bestof").css('display', 'inline-block');
            $("#overwrite_supershot").attr('display', 'inline-block');
            $("#overwrite_supershot").attr('data-id', tracks[(index)].bestof);
        } else {
            $("#video_bestof").css('display', 'none');
            $("#overwrite_supershot").attr('display', 'none');
            $("#overwrite_supershot").attr('data-id', '');
        }
        if (tracks[(id)].supershot > 0) {
            $(".video_supershot").css('display', 'inline-block');
            $("#converttype option").each(function () {
                $(this).remove();
            });
            $('#converttype').append($("<option/>", {
                value: 'bestof',
                text: 'bestof'
            }));
        } else {
            $(".video_supershot").css('display', 'none');
            $("#converttype option").each(function () {
                $(this).remove();
            });
            $('#converttype').append($("<option/>", {
                value: 'bestof',
                text: 'bestof'
            }));
            $('#converttype').append($("<option/>", {
                value: 'supershot',
                text: 'supershot'
            }));
        }

        newtit = 0;
        $(".remove_user_start").each(function () {
            if ($(this).hasClass('current')) {
                var newtit = $(this).attr('data-value');
                if (newtit == '1') {
                    newtit = 0;
                } else if (newtit == '2') {
                    if (tracks[(index)].taction != 0) {
                        newtit = tracks[(index)].taction;
                    } else if (tracks[(index)].timecum != 0) {
                        newtit = tracks[(index)].timecum;
                    }
                } else if (newtit == '3') {
                    if (tracks[(index)].timecum != 0) {
                        newtit = tracks[(index)].timecum;
                    } else if (tracks[(index)].taction != 0) {
                        newtit = tracks[(index)].taction;
                    }
                } else {
                    newtit = get_user_time(tracks[(index)].length);
                    if (newtit == 0) {
                        if (tracks[(index)].timecum != 0) {
                            tracks[(index)].timecum;
                        } else if (tracks[(index)].taction != 0) {
                            tracks[(index)].taction;
                        }
                    }
                }
                starttime = newtit;
            }
        });
        $("#video_starttime").val(starttime);


        if ($(".clip_cut_part").hasClass('current')) {
            mousetime = get_mouse_time();
            userend = get_user_start();
            //alert(starttime);

            $("#time_jumpdi li").each(function () {
                if ($(this).hasClass('current')) {
                    if ($(this).attr('data-heo') == 'half') {
                        factor = 2;
                    } else if ($(this).attr('data-heo') == 'third') {
                        factor = 3;
                    } else if ($(this).attr('data-heo') == 'quarter') {
                        factor = 4;
                    }
                }
            });

            if (factor > 0) {
                if (userend == 'Action time') {
                    startt = tracks[(index)].taction;
                } else if (userend == 'Cum time') {
                    startt = tracks[(index)].timecum;
                } else if (tracks[(index)].length != 0) {
                    startt = 0;
                }
                //alert(parseInt(startt));
                if (mousetime > 0) {
                    newtime = parseInt(parseInt((parseInt(tracks[(index)].length) - startt) / factor) - mousetime);
                } else {
                    newtime = parseInt((parseInt(tracks[(index)].length) - startt) / factor) - 3;
                }
                //alert(factor);
                //alert(seconds_to_time(newtime));
                //skip_time = get_user_timejump();
                //alert('length:'+seconds_to_time(tracks[(index)].length)+' action:'+seconds_to_time(parseInt(tracks[(index)].taction))+'='+seconds_to_time(parseInt(newtime))) ;
                $(this).attr('data-time', newtime);
                $("#timejump").val(newtime);
                $("#time_jump span").html(seconds_to_time(newtime));
            }
        }

        audio.playbackRate = $("#playbackrate").val();
        audio.currentTime = starttime;
        if ($("#clip_user_end .current").length != 0 && $("#clip_user_end .current").attr('data-value') != 'x') {
            endtime = parseInt(parseInt(starttime) + parseInt($("#clip_user_end .current").attr('data-value')));
            $("#endtime").val(endtime);
        } else {
            endtime = nlengt;
        }


        $(".track_total").html('' + parseInt(id + 1) + ' / ' + trackCount);
        $(".clip_start").html(get_user_start());
        $(".clip_stop").html(get_user_end());
        $(".clip_skip").html(get_user_timejump_title());
        $(".clip_speed").html($("#playbackrate").val());
        $(".clip_mouse").html(get_mouse_time());

        $(".current_image").html('<img src=' + tracks[(id)].plaatje1 + ' alt="' + tracks[(id)].name + '" width="100" />');
        $(".video_current_speed").html('x' + audio.playbackRate);
        if (tracks[(id)].clip_codec != 0) {
            if (tracks[(id)].clip_codec == 'h264') {
                $("#X264_codec_image").css('display', 'inline-block');
                $("#HEVC_codec_image").css('display', 'none');
            } else if (tracks[(id)].clip_codec == 'hevc') {
                $("#HEVC_codec_image").css('display', 'inline-block');
                $("#X264_codec_image").css('display', 'none');
            }

        }


        // clip_category

        setTimeout(function () { $("#cimage_div").html($("#cimage_div_ori").html()); }, 3000);

        play_speed = get_user_speed();
        audio.playbackRate = play_speed;

        // cattable
        $(".cattable").each(function () {
            // categorys
        });
        */
  }

  playTrack(id) {
    this.loadTrack(id);
    this.btnPlay.css('display', 'none');
    this.btnPause.css('display', 'inline-block');

    this.item_id.value = this.tracks[id].tree_id;
    this.item_length.value = parseInt(this.tracks[id].length) - 1;
    this.track_id.html = 'ID: ' + this.tracks[id].tree_id;
    //var larsy = parseInt(this.tracks[(id)].length / 60);

    //if (document.getElementById("filter_cliptype_bestof2").is(':checked')) {
    //    varsy = parseInt(tracks[(id)].videoex_playtime / 60);
    //    $(".track_lenght").html(varsy + " min | " + seconds_to_time(larsy));
    //    $("#Mediaplayer_file").val('NL_bestof_' + tracks[(id)].tree_id + '_' + tracks[(id)].bestof + '.mp4');
    //} else {
    //    $(".track_lenght").html(larsy + " min | " + seconds_to_time(larsy));
    //    $("#Mediaplayer_file").val('NL_clip_' + tracks[(id)].tree_id + '.mp4');
    // }
    this.track_date.html = this.tracks[id].track_date;

    var playsongs = document.getElementsByClassName('song');
    // playsongs.each(function (item) {
    for (var i = 0, len = playsongs.length; i < len; i++) {
      var item = playsongs[i];
      //if (item.hasClass('current')) {
      //    document.getElementsByClassName("#video_mp4_exaudio").src = 'http://heo.voormezelf.nl/' + item.attr('data-inf'));
      //    document.getElementsByClassName("#video_mp4_exaudio_title").innerHTML = (item.attr('data-title'));
      // }
    }
  }
}
