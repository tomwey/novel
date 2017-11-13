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

  downloadList : {[id:string]: any};
  downloadBooks : any = [];
  downloadedList : {[id:string]: any};
  downloadedBooks : any = [];
  downloading : boolean = false; //当前是否在下载
  fileTransfer : FileTransferObject;
  curDownloadItem :CatalogitemProvider = null;
  curProgress : number;
  downloadIndex: number = 0;
  constructor(private api: ApiService, private transfer : FileTransfer) {
    console.log('Hello DownloadServiceProvider Provider');
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.onProgress((e)=>{
      console.info(e);  
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
    if (this.downloadList[bookItem.ID] != null){
      this.downloadList[bookItem.ID].forEach(element => {
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
      this.downloadList[bookItem].push(chapterItem)
    }
    this.startDownLoad()
  }

  startDownLoad(){
    while(true && this.downloadBooks.length > 0){
      let firstBookId = this.downloadBooks[0].ID;
      if (this.downloading == false && this.downloadList[firstBookId].length > this.downloadIndex){
        var item = this.downloadList[firstBookId][this.downloadIndex]
        this.curDownloadItem = item;
        this.curProgress = 0;
        this.downloadItem(item);
        break;
      }
      if (this.downloadList[firstBookId].length <= 0){
        this.downloadedBooks.push(this.downloadBooks.shift())
      }
    }
  }

  downloadItem(chapterItem): Promise<any> {
    this.downloading = true
    chapterItem.downloading = true;
    return new Promise((resolve => {
      this.api.get('getChapter.php', chapterItem.requestParams)
        .then(data => {
          console.log(data);
          var fileurl = 'cdvfile://localhost/persistent/'+ chapterItem.requestParams.title + '/' + chapterItem.requestParams.chapterID + '.mp3';
          this.fileTransfer.download(data.chapterSrcArr[0], fileurl, true).then((fileEntry)=>{
            console.log('下载音频文件: ' + fileEntry.toURL());
            this.curDownloadItem.downloadSucceed(fileEntry.toURL());
            this.startDownLoad();
            this.downloadIndex ++;
          }).catch((error)=>{
            console.log("Error:"+error);
            this.curDownloadItem.downloadFailed();
            this.startDownLoad();
            this.downloadIndex ++;
          });
          resolve(true);
        })
        .catch(error => {
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

}
