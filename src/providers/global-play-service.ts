import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Constants } from './constants';

@Injectable()
export class GlobalPlayService {
  
  constructor(private store: Storage, private events: Events) {
    // console.log('Hello ToolService Provider');
  }

  getPlayButton(): string {
    if (Constants.APP_TYPE === 1) {
      return '播放中';
    }

    if (Constants.APP_TYPE === 2) {
      return '阅读中';
    }

    return '';
  }

  gotoPlay() {
    alert(123);
  }

}
