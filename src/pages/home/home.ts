import { Component } from '@angular/core';
import { NavController, Events, App } from 'ionic-angular';
import { NewbieService } from '../../providers/newbie-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedMenu: string = '我的收藏';
  // selectedMenuID: string = NewbieService.FAVORITE_KEY;

  isDropdown: boolean = false;
  isEdit: boolean = true;
  
  // currentData: any = [];

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

  forwardTo(menu, item): void {
    // alert(JSON.stringify(ev));
    // if (menu.id === NewbieService.FAVORITE_KEY) {
    //   this.gotoBook(item);
    // } else if 
    if (item.bookitem) {
      this.gotoBookDetail(item);
    } else {
      this.gotoBook(item);
    }
  }

  deleteItem(menu,item): void {
    this.nbService.removeItems(menu.id,[item]);
  }

  gotoBookDetail(item) {
    this.app.getRootNavs()[0].push('AudioplayerPage', item);
  }

  gotoBook(book): void {
    this.app.getRootNavs()[0].push('BookPage', book);
  }

  editOrDone(yesOrNo) 
  {
    if (this.isDropdown && !this.isEdit) {
      this.isDropdown = false;
    }

    this.isEdit = yesOrNo;
  }

  selectMenu(i): void {
    this.selectedMenu = this.menus[i].label;

    this.toggle(false);
  }

  toggle(yesOrNo): void {
    this.isDropdown = yesOrNo;
    this.isEdit = !yesOrNo;
  }

  reorderItems(indexes): void {
    let menu = this.menus[indexes.from];
    this.menus.splice(indexes.from, 1);
    this.menus.splice(indexes.to, 0, menu);

    this.nbService.saveMenues(this.menus);
  }

  reorderItems2(indexes,menu): void {
    let item = menu.data[indexes.from];
    menu.data.splice(indexes.from, 1);
    menu.data.splice(indexes.to, 0, item);

    this.nbService.saveItems(menu.id, menu.data);
  }

  menus: any = [];

}
