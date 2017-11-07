import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedMenu: string = '我的收藏';
  
  isDropdown: boolean = false;
  isEdit: boolean = true;
  constructor(public navCtrl: NavController) {
    
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
  }

  menus: any = [
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
