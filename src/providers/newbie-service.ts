import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class NewbieService {
  
  public static FAVORITE_KEY = 'favorites';
  public static UPLOADED_KEY = 'uploaded';
  public static BOOKMARK_KEY = 'bookmarks';
  public static HISTORY_KEY  = 'histories';
  public static DOWNLOADED_KEY = 'downloaded';
  public static DOWNLOADING_KEY = 'downloading';

  private downloadingBooks: any = []; // 缓存正在下载的小说

  constructor(private store: Storage, 
              private events: Events,
            ) {
    // console.log('Hello ToolService Provider');
  }

  // 获取菜单项
  getMenues(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getObject('menues')
        .then(data => {
          let temp = data || [];
          if (temp.length === 0) {
            temp = this.initMenues;
          }
          resolve(temp);
        })
        .catch(error => reject(error));
    });
  }

  // 保存菜单项
  saveMenues(menues) {
    return this.saveObject('menues', menues);
  }

  // 移动数据到某个文件夹
  moveItemsToDir(items, dir): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  // 获取数据
  getItems(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (key === NewbieService.DOWNLOADING_KEY) {
        // 正在下载的菜单，数据是保存到内存里面的
        resolve(this.downloadingBooks);
      } else {
        this.getObject(key)
          .then(data => resolve(data || []))
          .catch(error => reject(error));
      }
    });
  }

  saveItems(key: string, items) {
    this.saveObject(key, items);
  }

  // 判断是否已经添加过
  hasAdded(key: string, item): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getItems(key)
        .then(data => {
          if (data.length === 0) {
            resolve(false);
          } else {
            for (var i = 0; i < data.length; i++) {
              var obj = data[i];
              if (obj.ID === item.ID) {
                resolve(true);
                break;
              }
            }

            resolve(false);
          }
        })
        .catch(error => {
          resolve(false);
        });
    });
  }

  // 添加数据
  addItem(key: string, item): Promise<any> {
    return this.addItems(key, [item]);
  }

  // 添加一批数据
  addItems(key: string, items): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getItems(key)
        .then(data => {
          for(var i=0; i<items.length; i++) {
            let item = items[i];
            data.unshift(item);
          }
          this.saveObject(key, data)
            .then(data => resolve(true))
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }

  // 删除数据
  removeItems(key: string, items): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getItems(key)
        .then(data => {
          if (items && items.length > 0) {

            // console.log(data);

            let temp = [];
            for (var i=0; i<data.length; i++) { // 1,2,3,4
              let old = data[i];
              let count = 0;
              // console.log(old.id);
              for (var j=0; j<items.length; j++) { // 1, 3
                let del = items[j]; 
                 
                if (old.ID === del.ID) {
                  count++;
                }   
              }
              if (count === 0) {
                temp.push(old);
              }
            }
            
            // console.log(temp);
            this.saveObject(key, temp)
              .then(data => resolve(true))
              .catch(error => reject(error));
          } else {
            resolve(true);
          }
        })
        .catch(error => reject(error));
    });
  }

  // 删除所有数据
  removeAllItems(key: string): Promise<any> {
    return this.saveObject(key, null);
  }

  saveObject(key: string, obj: any): Promise<any> {
    if (!obj) {
      if (key === NewbieService.DOWNLOADING_KEY) { // 正在下载
        return new Promise(resolve => {
          this.downloadingBooks = [];
          this.events.publish(`${key}:changed`);
        });
      }
      return this.store.remove(key).then(data => {
        if (key !== 'menues') {
          this.events.publish(`${key}:changed`);
        }
      });
    } else {
      if (key === NewbieService.DOWNLOADING_KEY) { // 正在下载
        return new Promise(resolve => {
          this.downloadingBooks = obj;
          this.events.publish(`${key}:changed`);
        });
      }

      return this.store.set(key, JSON.stringify(obj)).then(data => {
        // console.log(data);
        if (key !== 'menues') {
          this.events.publish(`${key}:changed`);
        }
      });
    }
  }

  getObject(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.get(key)
        .then(data => {
          if (!data) {
            resolve(null);
          } else {
            resolve(JSON.parse(data));
          }
        })
        .catch(error => {
          reject(error);
        })
    });
  }

  private initMenues: any = [
    {
      id: NewbieService.FAVORITE_KEY,
      label: '我的收藏',
      empty: '目前没有收藏',
      data: [],
      s: 0
    },
    {
      id: NewbieService.UPLOADED_KEY,
      label: '电脑上传',
      empty: '',
      data: [],
      s: 1
    },
    {
      id: NewbieService.HISTORY_KEY,
      label: '历史记录',
      empty: '目前没有历史记录',
      data: [],
      s: 2
    },
    {
      id: NewbieService.DOWNLOADED_KEY,
      label: '下载完成',
      empty: '目前没有下载缓存',
      data: [],
      s: 3
    },
    {
      id: NewbieService.DOWNLOADING_KEY,
      label: '正在下载',
      empty: '目前没有下载任务',
      data: [],
      s: 4
    },
    {
      id: NewbieService.BOOKMARK_KEY,
      label: '我的书签',
      empty: '目前没有书签',
      data: [],
      s: 5
    },
  ];

}
