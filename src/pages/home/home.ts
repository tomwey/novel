import { Component } from '@angular/core';
import { NavController, Events, App } from 'ionic-angular';
import { NewbieService } from '../../providers/newbie-service';
import { GlobalPlayService } from '../../providers/global-play-service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ApiService } from '../../providers/api-service'
import { DownloadServiceProvider } from '../../providers/download-service';
declare let window;
window.downloadTool;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedMenu: string = '我的收藏';
  selectedMenuID: string = NewbieService.FAVORITE_KEY;
  
  allowMove: boolean = true;

  isDropdown: boolean = false;
  isEdit: boolean = true;
  
  disabled: boolean = true

  selectedData: any = [];

  constructor(public navCtrl: NavController, 
              private nbService: NewbieService,
              private events: Events,
              private app: App,
              public globalService: GlobalPlayService,
              private api : ApiService,
              private file : File,
            ) {
    if (window.downloadTool == null) window.downloadTool = new DownloadServiceProvider(this.api, new FileTransfer(), this.file, this.events);
    this.nbService.getMenues()
      .then(data => {
        this.menus = data;

        this.addSubscribes();

      }).catch(error => {});
    
    this.events.subscribe('menu:select', data => {
      this.doMoveItems(data);
    });

    // 小说下载操作监听
    this.events.subscribe('book.downloading.add', item => {
      this.nbService.addItems(NewbieService.DOWNLOADING_KEY, [item]);
    });
    this.events.subscribe('book.downloading.cancel', item => {
      this.nbService.removeItems(NewbieService.DOWNLOADING_KEY, [item]);
    });
  }

  addSubscribes() {
    this.customMenues = [];
    for (var i=0; i<this.menus.length; i++) {
      let menu = this.menus[i];

      if (menu.custom) {
        this.customMenues.push(menu);
      }

      this.nbService.getItems(menu.id).then(data => {
        menu.data = data 
      });

      this.events.unsubscribe(`${menu.id}:changed`);

      this.events.subscribe(`${menu.id}:changed`, () => {
        // alert(123);
        this.nbService.getItems(menu.id).then(data => {
          // alert(JSON.stringify(data));
          menu.data = data 
        });
      });
    }
  }

  getMenuForKey(key: string): any {
    for (var i=0; i<this.menus.length; i++) {
      let menu = this.menus[i];
      if (menu.id === key) {
        return menu;
      }
    }
    return null;
  }

  getMenuForLabel(label: string): any {
    for (var i=0; i<this.menus.length; i++) {
      let menu = this.menus[i];
      if (menu.label === label) {
        return menu;
      }
    }
    return null;
  }

  getImageUrl(menu,item): string {
    if (item.bookitem) {
      return item.bookitem.src;
    }
    return item.src;
  }

  getTitle(menu, item): string {
    if (item.bookitem) {
      return item.bookitem.title;
    }
    return item.title;
  }

  getContent1(menu, item): string {
    // console.log(JSON.stringify(item));
    if (item.bookitem) {
      return item.bookitem.name;
    }
    return item.author;
  }

  getContent2(menu, item): string {
    // return null;
    if (item.item) {
      return item.item.chapterTitle;
    }

    if (item.time) {
      return item.time.split('\n')[1];
    }
    return null;
  }

  // 选中或取消选中某个条目
  selectItem(item): void {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedData.push(item);
    } else {
      // this.selectedItems.splice()
      for(var i=0; i<this.selectedData.length; i++) {
        let obj = this.selectedData[i];
        if (obj.ID === item.ID) {
          this.selectedData.splice(i,1);
          break;
        }
      }
    }

    this.disabled = this.selectedData.length === 0;
  }

  // 批量移动
  moveItems() {
    // let menu = this.getMenuForKey(this.selectedMenuID);
    this.app.getRootNavs()[0].push('SelectFolderPage', this.customMenues);
  }

  // 处理批量移动
  doMoveItems(name) {
    let menu = this.getMenuForLabel(name);
    let oldMenu = this.getMenuForLabel(this.selectedMenu);

    if (!menu) {
      this.createMenuAndMove(oldMenu, name);
    } else {
      if (oldMenu.id === menu.id) {
        let index = this.getMenuIndex(menu);
        this.selectMenu(index);

        this.clearSelectedData();
        this.isEdit = true;

      } else {
        // 数据移动
        this.moveItemsBetween(oldMenu, menu);
      }
    }
  }

  moveItemsBetween(oldMenu, menu) {
    // console.log(oldMenu);
    // console.log(menu);

    // 如果全部移除，那么把目录删掉
    if (oldMenu.data.length <= this.selectedData.length) { 
      if (oldMenu.id !== NewbieService.FAVORITE_KEY) {
        // 删除自定义的目录
        let index = this.getMenuIndex(oldMenu);
        if (index !== -1) {
          this.menus.splice(index, 1);
          // this.customMenues.splice()
          for (var i=0; i<this.customMenues.length; i++) {
            let m = this.customMenues[i];
            if (m.id === oldMenu.id) {
              this.customMenues.splice(i, 1);
              break;
            }
          }

          // 重置目录
          this.resetMenues();
        }
      }
    } 

    // 删除旧目录的数据
    this.nbService.removeItems(oldMenu.id, this.selectedData)
      .then(data => {
        if (data) {
          // 新增数据到新目录

          // 重置选中
          for(var index=0; index<this.selectedData.length; index++) {
            let item = this.selectedData[index];
            item.selected = false;
            item.save_key = menu.id;
          }

          this.nbService.addItems(menu.id, this.selectedData)
            .then(data => {
              // 切换到新目录
              let index = this.getMenuIndex(menu);
              this.selectMenu(index);
            }).catch();
        }
      }).catch(error => {});
  }

  // 创建菜单项并移动条目
  createMenuAndMove(oldMenu, name): void {
    // 创建菜单
    this.createMenu(name).then(menu => {
      // 数据移动
      this.moveItemsBetween(oldMenu, menu);
    });
  }

  // 创建菜单
  createMenu(name): Promise<any> {
    return new Promise((resolve) => {
      let menu = {
        id: name,
        label: name,
        empty: '',
        custom: 1,
        data: []
      };
  
      // 更新菜单
      this.customMenues.push(menu);

      this.resetMenues().then(data => {
        if (data) {
          resolve(menu);
        }
      });
    });
  }

  // 重置菜单项
  resetMenues(): Promise<any> {
    return new Promise((resolve) => {
      this.customMenues.sort((o1,o2) => {
        return o1.id < o2.id;
      });
      
      // 获取初始菜单项，并排序
      let temp = [];
      for(var i=0;i<this.menus.length; i++) {
        let m = this.menus[i];
        if (!m.custom) {
          temp.push(m);
        }
      }
      // 排序
      temp.sort((o1,o2) => {
        return o1.s - o2.s;
      });

      for (var j=0; j<this.customMenues.length; j++) {
        temp.splice(1, 0, this.customMenues[j]);
      }
      
      this.menus = temp;

      console.log(this.menus);
      
      this.nbService.saveMenues(this.menus).then(data => {
        this.addSubscribes();
        resolve(true);
      }).catch(error => { resolve(false) });
    });
  }

  getMenuIndex(menu): number {
    for(var i=0; i<this.menus.length; i++) {
      let o = this.menus[i];
      if (menu.id === o.id) {
        return i;
      }
    }
    return -1;
  }

  // 批量删除
  removeItems() {
    this.nbService.removeItems(this.selectedMenuID, this.selectedData)
      .then(data => {
        this.selectedData = [];
        this.isEdit = true;
      })
      .catch(error => {});
  }
  
  // 点击一个条目跳转
  forwardTo(menu, item): void {
    if (!this.isEdit) {
      this.selectItem(item);
      return;
    }

    if (item._type && item._type === 'podcast') {
      this.gotoPodcast(item);
    } else {
      if (menu.id === NewbieService.DOWNLOADING_KEY || 
          menu.id === NewbieService.DOWNLOADED_KEY) {
        // console.log('11111');
        this.gotoChapters(item);
      } else {
        if (item.bookitem) {
          this.gotoBookDetail(item);
        } else {
          this.gotoBook(item);
        }
      }
    }
  }

  gotoChapters(book) {
    this.app.getRootNavs()[0].push('ChapterListPage', book);
  }

  gotoPodcast(item): void{
    if (item.href == null){
      item.href = item.chapterUrlArr[0]
    }
    // if (window.globalAudioTack){
    //   window.globalAudioTack.pause()
    // }
    this.app.getRootNavs()[0].push('PodcastDetailPage', { 
      title: item.title,
      url: item.href, 
      item: item, // 临时加的
    });
  }

  // 删除某个条目
  deleteItem(menu,item): void {
    this.nbService.removeItems(menu.id,[item]);
  }

  // 跳到播放或者阅读界面
  gotoBookDetail(item) {
    this.app.getRootNavs()[0].push('AudioplayerPage', item);
  }

  // 跳到小说详情
  gotoBook(book): void {
    this.app.getRootNavs()[0].push('BookPage', book);
  }

  // 编辑按钮切换
  editOrDone(yesOrNo) 
  {
    if (this.isDropdown && !this.isEdit) {
      this.isDropdown = false;
    }

    this.isEdit = yesOrNo;

    if (this.isEdit) {
      this.clearSelectedData();
    }
  }

  // 选择菜单
  selectMenu(i): void {
    if (i === -1) return;

    if (this.selectedMenu === this.menus[i].label) return;

    this.selectedMenu = this.menus[i].label;
    this.selectedMenuID = this.menus[i].id;

    this.allowMove = (!!this.menus[i].custom || this.selectedMenuID === NewbieService.FAVORITE_KEY);

    this.toggle(false);

    this.clearSelectedData();
  }

  clearSelectedData() {
    // 清空全局选中条目
    for(var index=0; index<this.selectedData.length; index++) {
      let item = this.selectedData[index];
      item.selected = false;
    }
    this.selectedData = [];

    this.disabled = true;
  }

  toggle(yesOrNo): void {
    this.isDropdown = yesOrNo;
    this.isEdit = !yesOrNo;
  }

  // 移动菜单顺序
  reorderItems(indexes): void {
    let menu = this.menus[indexes.from];
    this.menus.splice(indexes.from, 1);
    this.menus.splice(indexes.to, 0, menu);

    this.nbService.saveMenues(this.menus);
  }

  // 移动某个条目顺序
  reorderItems2(indexes,menu): void {
    let item = menu.data[indexes.from];
    menu.data.splice(indexes.from, 1);
    menu.data.splice(indexes.to, 0, item);

    this.nbService.saveItems(menu.id, menu.data);
  }

  menus: any = [];
  customMenues: any = [];
}
