import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class SearchService {
  
  public static SEARCH_KEY = 'search_key';

  constructor(private store: Storage, private events: Events) {
    // console.log('Hello ToolService Provider');
  }

  getKeywords(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.get(SearchService.SEARCH_KEY).then(data => {
        if (!data) {
          resolve([]);
        } else {
          resolve(JSON.parse(data));
        }
      }).catch(error => reject(error));
    });
  }

  addKeyword(kw): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!kw) {
        resolve(false)
      } else {
        this.getKeywords().then(data => {
          let index = data.indexOf(kw);
          if (index === -1) {
            data.unshift(kw);
          }

          this.store.set(SearchService.SEARCH_KEY, JSON.stringify(data))
            .then(data => resolve(data))
            .catch(error => reject(error));

        }).catch(error => reject(error));
      }
    });
  }

}
