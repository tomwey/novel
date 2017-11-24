import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CatalogitemProvider } from '../providers/catalogitem';
import { File } from '@ionic-native/file';
import { NewbieService } from './newbie-service';
import { DownloadServiceProvider } from '../providers/download-service';
/*
  Generated class for the CataloggroupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CataloggroupProvider {

  chapters : any = [];
  book : any;

  constructor(private bookitem: any, private bookchapters : any, private file:File, private nbservice : NewbieService,
  private downloadTool : DownloadServiceProvider) {
    console.log('Hello CataloggroupProvider Provider');
    this.book = bookitem;
    var containItems = [];
    var downloadItems = this.downloadTool.getBookDownloadItem(this.book.ID)
    if (downloadItems){
      downloadItems.forEach(element => {
        containItems.push(element.requestParam.chapterID)
      });
    }
    bookchapters.forEach(element => {
        if (containItems.indexOf(element.chapterID) == -1){
          var citem = new CatalogitemProvider(element, this.book, file, nbservice, this.downloadTool);
          this.downloadTool.refreshItem(citem)
          this.chapters.push(citem);
        }else {
          this.chapters.push(downloadItems[containItems.indexOf(element.chapterID)])
        }
    });
    // downloadItems.forEach(element => {
    //   this.chapters.splice(itemIndexes[index++], 0, element)
    // });
  }

  freshItems(){

  }

  downloadSelectItems(){
    this.chapters.forEach(element => {
      if (element.isSelected && element.iswaiting === 0){
        this.downloadTool.addtoDownloadList(element, this.book);
      }
    });
  }

  downloadOneItem(item){
    item.isSelected = true;
    if (this.downloadTool){
        if (item.downloaded) {
          item.deleteself();
        } else {
          if (item.iswaiting === 0) {
            console.log("开始下载")
            this.downloadTool.addtoDownloadList(item, this.book)
          } else {
            
            if (item.isFailed){
              console.log("删除下载失败内容")
              this.removeFailedItem(item);
            }else{
              console.log('取消下载');
              this.cancelItem(item);
            }
          }
        }
    }
  }

  //选中所有
  selectAll(){
    this.chapters.forEach(element => {
      element.isSelected = true;
    });
  }

  //反选
  unselectAll(){
    this.chapters.forEach(element => {
      element.isSelected = !element.isSelected;
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
  selectMutil(fid, lid){
    console.log("还未实现该方法")
    var fIndex = -1;
    var lIndex = -1;
    for(var i = 0; i < this.chapters.length; ++i){
      if (this.chapters[i].requestParam.chapterID == fid){
        fIndex = i;
      }
      if (this.chapters[i].requestParam.chapterID == lid){
        lIndex = i;
      }
      if (lIndex != -1 && fIndex != -1){
        break;
      }
    }
    if (lIndex != -1 && fIndex != -1){
      for (var j = Math.min(lIndex, fIndex) + 1; j < Math.max(lIndex, fIndex); ++j){
        this.chapters[j].isSelected = true;
      }
    }
  }

  cancelAll(){
    this.downloadTool.cancelBook(this.book)
  }

  cancelItem(item){
    this.downloadTool.cancelChapter(item, this.book.ID);
  }

  removeFailedItem(item){
    this.downloadTool.removeFailedItem(item, this.book.ID);
  }
}
