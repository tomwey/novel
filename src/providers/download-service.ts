import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ApiService } from './api-service';
import { CatalogitemProvider } from '../providers/catalogitem';
/*
  Generated class for the DownloadServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DownloadServiceProvider {

  downloadList = new Map();
  downloadBooks : any = [];
  downloadedBooks : any = [];
  downloading : boolean = false; //当前是否在下载
  fileTransfer : FileTransferObject;
  curDownloadItem :CatalogitemProvider = null;
  curProgress : number;
  downloadIndex: number = 0;
  constructor(private api: ApiService, private transfer : FileTransfer, private file: File) {
    console.log('Hello DownloadServiceProvider Provider');
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.onProgress((e)=>{
      console.info(e);  
      alert(JSON.stringify(e));
      if (e.lengthComputable) {  
          console.log('当前进度：' + e.loaded / e.total);  
          this.curProgress = e.loaded / e.total;
          if (this.curDownloadItem != null){
            this.curDownloadItem.loaded = e.loaded;
            this.curDownloadItem.total = e.total;
          }
      }  
    })
  }

  addtoDownloadList(chapterItem, bookItem):void{
    var isExist : boolean = false;
    
    if (this.downloadList.has(bookItem.ID)){
      this.downloadList.get(bookItem.ID).forEach(element => {
        if (element.isEqual(chapterItem)){
          isExist = true;
          return false
        }
      });
    }else{
      this.downloadBooks.push(bookItem)
      this.downloadList[bookItem.ID] = [];
    }
    
    if (isExist == false){
      chapterItem.iswaiting = 1
      this.downloadList[bookItem.ID].push(chapterItem)
    }
    this.startDownLoad()
  }

  startDownLoad(){
    console.log("--------------下载列表----------------")
    while(true && this.downloadBooks.length > 0 && this.downloading == false){
      let firstBookId = this.downloadBooks[0].ID;
      if (this.downloading == false && this.downloadList[firstBookId].length > this.downloadIndex){
        var item = this.downloadList[firstBookId][this.downloadIndex]
        item.iswaiting = 2;
        this.curDownloadItem = item;
        this.curProgress = 0;
        this.downloadItem(item);
        break;
      }
      if (this.downloadList[firstBookId].length <= this.downloadIndex){
        this.downloadIndex = 0
        this.downloadedBooks.push(this.downloadBooks.shift())
      }
    }
  }

  downloadItem(chapterItem): Promise<any> {
    console.log("-------------------开始下载---------------")
    this.downloading = true
    chapterItem.downloading = true;
    return new Promise((resolve => {
      this.api.get('getChapter.php', chapterItem.requestParam)
        .then(data => {
          console.log(data);
          var fileurl = this.file.dataDirectory + '/' + chapterItem.requestParam.chapterID + '.mp3';
          var uri = encodeURI(data.chapterSrcArr[0]);
          console.log(fileurl)
          // alert(uri);
          this.fileTransfer.download(uri, fileurl).then((fileEntry)=>{
            console.log('下载音频文件: ' + fileEntry.toURL());
            alert(fileEntry.toURL());
            this.curDownloadItem.downloadSucceed(fileEntry.toURL());
            this.startDownLoad();
            this.downloadIndex ++;
          }).catch((error)=>{
            console.log("Error:"+error);
            alert(JSON.stringify(error));
            this.curDownloadItem.downloadFailed();
            this.startDownLoad();
            this.downloadIndex ++;
          });
          resolve(true);
        })
        .catch(error => {
          console.log("下载失败"+error)
          resolve(false);
        })
    }));
  }

  getCurDownloadItem():any{
    return this.curDownloadItem;
  }

  getCurProgress():number{
    return this.curProgress;
  }

  cancelBook(bookitem){
    var index = this.downloadBooks.indexOf(bookitem)
    if (index == 0) this.fileTransfer.abort();
    if (index >= 0){
      this.downloadList.delete(bookitem.ID);
      this.downloadBooks.splice(index, 1)
    }
    if (index == 0) this.startDownLoad()
  }

  removeDownloadedItem(item, bookid){
    if (this.downloadList.has(bookid)){
      var index = -1;
      for(var i = 0; i < this.downloadList.get(bookid).length; ++i){
        if (this.downloadList.get(bookid)[i].isEqual(item)){
          index = i;
          break;
        }
      }
      if (index >= 0){
        this.downloadList.get(bookid).splice(index, 1);
      }
    }
  }

  refreshItem(item, bookid){ //判断是否在下载列表中存在
    if (this.downloadList.has(bookid)){
      var index = -1;
      for(var i = 0; i < this.downloadList.get(bookid).length; ++i){
        if (this.downloadList.get(bookid)[i].isEqual(item)){
          index = i;
          break;
        }
      } 
      if (index >= 0){
        item.refreshItem(this.downloadList.get(bookid)[index]);
        this.downloadList.get(bookid).splice(index, 1, item);
        if (item.isEqual(this.curDownloadItem)){
          this.curDownloadItem = item;
        }
      }
    }
  }

}
