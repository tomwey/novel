import { Component } from '@angular/core';
import { NavController, Events, App } from 'ionic-angular';
import { NewbieService } from '../../providers/newbie-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedMenu: string = '我的收藏';
  selectedMenuID: string = NewbieService.FAVORITE_KEY;

  isDropdown: boolean = false;
  isEdit: boolean = true;
  
  // currentData: any = [];
  
  disabled: boolean = true

  selectedData: any = [];

  constructor(public navCtrl: NavController, 
              private nbService: NewbieService,
              private events: Events,
              private app: App,
            ) {
    this.nbService.getMenues()
      .then(data => {
        this.menus = data;

        this.addSubscribes();

      }).catch(error => {});
  }

  addSubscribes() {
    for (var i=0; i<this.menus.length; i++) {
      let menu = this.menus[i];

      this.nbService.getItems(menu.id).then(data => {
        // alert(JSON.stringify(data));
        menu.data = data 
      });

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

  // 播放中或者阅读中
  gotoPlayer() {

  }

  // 点击一个条目跳转
  forwardTo(menu, item): void {
    if (!this.isEdit) {
      this.selectItem(item);
      return;
    }
    if (item.bookitem) {
      this.gotoBookDetail(item);
    } else {
      this.gotoBook(item);
    }
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
    if (this.selectedMenu === this.menus[i].label) return;

    this.selectedMenu = this.menus[i].label;
    this.selectedMenuID = this.menus[i].id;

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

}
