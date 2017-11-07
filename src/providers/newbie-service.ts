import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class NewbieService {
  
  constructor(private store: Storage) {
    // console.log('Hello ToolService Provider');
  }

  // 获取菜单项
  getMenues(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getObject('menues')
        .then(data => {
          resolve(data || this.initMenues);
        })
        .catch(error => reject(error));
    });
  }

  // 保存菜单项
  saveMenues(menues) {
    this.saveObject('menues', menues);
  }

  // 获取所有的收藏
  getAllFavorites(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getObject('favorites')
        .then(data => resolve(data || []))
        .catch(error => reject(error));
    });
  }
  
  // 是否已经收藏过
  hasFavorited(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllFavorites()
        .then(data => {
          if (data.length === 0) {
            resolve(false);
          } else {
            for (var i = 0; i < data.length; i++) {
              var obj = data[i];
              if (obj.title === item.title) {
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

  // 收藏
  addFavorite(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllFavorites()
        .then(data => {
          if (item) {
            data.unshift(item);
            this.saveObject('favorites', data)
              .then(data => resolve(true))
              .catch(error => reject(error));
          }
        })
        .catch(error => reject(error));
    });
  }
  // 取消收藏
  removeFavorite(item): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllFavorites()
        .then(data => {
          let temp = [];
          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.title !== item.title) {
              temp.push(obj);
            }
          }

          this.saveObject('favorites', temp)
            .then(data => resolve(true))
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }

  // 删除所有收藏
  removeAllFavorites(): Promise<any> {
    return this.saveObject('favorites', null);
  }

  // 移动数据到某个文件夹
  moveItemsToDir(items, dir): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  saveObject(key: string, obj: any) {
    if (!obj) {
      return this.store.remove(key);
    } else {
      return this.store.set(key, JSON.stringify(obj))
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
      id: 'favorites',
      label: '我的收藏',
      empty: '目前没有收藏',
      data: [],
    },
    {
      id: 'uploaded',
      label: '电脑上传',
      empty: '',
      data: [],
    },
    {
      id: 'histories',
      label: '历史记录',
      empty: '目前没有历史记录',
      data: [],
    },
    {
      id: 'downloaded',
      label: '下载完成',
      empty: '目前没有下载缓存',
      data: [],
    },
    {
      id: 'downloading',
      label: '正在下载',
      empty: '目前没有下载任务',
      data: [],
    },
    {
      id: 'bookmarks',
      label: '我的书签',
      empty: '目前没有书签',
      data: [],
    },
  ];

}
