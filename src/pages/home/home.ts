import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewbieService } from '../../providers/newbie-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedMenu: string = '我的收藏';
  
  isDropdown: boolean = false;
  isEdit: boolean = true;
  constructor(public navCtrl: NavController, private nbService: NewbieService) {
    this.nbService.getMenues()
      .then(data => {
        this.menus = data;
      }).catch(error => {});
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

  menus: any = [];

}
