import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CatalogitemProvider } from '../providers/catalogitem';
declare let window;
window.donwloadTool;
/*
  Generated class for the CataloggroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CataloggroupProvider {

  chapters : any = [];
  book : any;

  constructor(private bookitem: any, private bookchapters : any) {
    console.log('Hello CataloggroupProvider Provider');
    this.book = bookitem;
    bookchapters.forEach(element => {
      var citem = new CatalogitemProvider(element, this.book);
      this.chapters.push(citem);
    });
  }

  downloadSelectItems(){
    this.chapters.forEach(element => {
      if (element.isSelected){
        window.donwloadTool.addtoDownloadList(element, this.book);
      }
    });
  }

  //选中所有
  selectAll(){
    this.chapters.forEach(element => {
      element.isSelected = true;
    });
  }

  //不选
  unselectAll(){
    this.chapters.forEach(element => {
      element.isSelected = false;
    });
  }

  //反序
  reverse(){
    this.chapters.reverse();
  }

  //下载选中
  downloadAll(){
    this.chapters.forEach(element => {
      element.isSelected = true;
    });
    this.downloadSelectItems()
  }

  //连续选中
  selectMutil(){
    console.log("还未实现该方法")
  }

  cancelAll(){

  }
}
