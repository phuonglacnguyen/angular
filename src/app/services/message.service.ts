import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  messages: Array<any> = [];
  alertClass = '';

  SetAlertSuccess(text) {
    this.alertClass = 'alert-success';
    this.setMessages(text);
    document.getElementById('messagesAlert').removeAttribute('hidden');
    this.removeErrorTxt();
  }

  SetAlertInfo(text) {
    this.alertClass = 'alert-info';
    this.setMessages(text);
  }

  SetAlertWarning(text) {
    this.alertClass = 'alert-warning';
    this.setMessages(text);
    this.removeErrorTxt();
  }

  SetAlertDanger(text) {
    this.alertClass = 'alert-danger';
    this.setMessages(text);
    this.removeErrorTxt();
  }

  setMessages(text) {
    this.ShowMessageAlert();
    this.messages = [];
    this.messages.push(text);
    window.scrollTo(0, 0);
  }

  ShowMessageAlert() {
    var str = this.alertClass + ' messages';
    document.getElementById('messagesAlert').setAttribute('class', str);
  }

  public closeMessageAlert() {
    document
      .getElementById('messagesAlert')
      .setAttribute('class', 'hidden messages');
  }

  removeErrorTxt() {
    setTimeout(function () {
      document.querySelector('#messagesAlert').classList.add('hidden');
    }, 6000);
  }
}
