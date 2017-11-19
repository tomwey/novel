import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileTransferError } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ApiService } from './api-service';
import { CatalogitemProvider } from '../providers/catalogitem';
import { Events } from 'ionic-angular/util/events';
/*
  Generated class for the DownloadServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DownloadServiceProvider {
  private _downloadingCount: number = 0;
  downloadList = new Map();
  downloadedList = new Map();
  downloadBooks : any = [];
  downloadedBooks : any = [];
  downloading : boolean = false; //当前是否在下载
  fileTransfer : FileTransferObject;
  curDownloadItem :CatalogitemProvider = null;
  curProgress : number;
  //downloadIndex: number = 0;
  constructor(private api: ApiService, private transfer : FileTransfer, 
              private file: File,
              private events: Events,
              private ngZone: NgZone
            ) {
    this.fileTransfer = this.transfer.create();
    this.fileTransfer.onProgress((e)=>{
      // this.ngZone.run(() => {
        if (e.lengthComputable) {  
          //console.log('当前进度：' + e.loaded / e.total);  
          this.curProgress = e.loaded / e.total;
          this.ngZone.run(() => {
            if (this.curDownloadItem != null){
              this.curDownloadItem.loaded = e.loaded.toString();
              this.curDownloadItem.total = e.total.toString();
              // this.curDownloadItem.status = `正在下载：${e.loaded} / ${e.total}`;
            }
          });
        } 
      // }) 
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
    }
    var bookExsit :boolean  = false;
    this.downloadBooks.forEach(element => {
      if (element.ID == bookItem.ID){
        bookExsit = true;
        return false;
      }
    });
    if (bookExsit == false){
      this.downloadBooks.push(bookItem)
      this.events.publish('book.downloading.add', bookItem);
      if (!this.downloadList.has(bookItem.ID)){
        this.downloadList.set(bookItem.ID, []);
      }
      if (!this.downloadedList.has(bookItem.ID)){
         this.downloadedList.set(bookItem.ID, []);
      }
    }
    
    if (isExist == false){
      this.downloadingCount ++;

      chapterItem.iswaiting = 1
      this.downloadList.get(bookItem.ID).push(chapterItem)
    }
    console.log("---------------------书本Length="+this.downloadBooks.length+", 章节="+this.downloadList.get(bookItem.ID).length);
    this.startDownLoad()
  }

  get downloadingCount() {
    return this._downloadingCount;
  }

  set downloadingCount(val) {
    this._downloadingCount = val;
    this.events.publish('chapter:downloading', this._downloadingCount);
  }

  startDownLoad(){
    
    while(true && this.downloadBooks.length > 0 && this.downloading == false){
      console.log("----------------startDownLoad11")
      let firstBookId = this.downloadBooks[0].ID;
      if (this.downloading == false && this.downloadList.get(firstBookId).length > 0){
        var item = this.downloadList.get(firstBookId)[0]
        item.iswaiting = 2;
        this.fileTransfer.abort();
        this.curDownloadItem = item;
        this.curProgress = 0;
        this.downloading = true;
        console.log("-----------------------开始下载："+item.requestParam.chapterID);
        this.downloadItem(item);
        break;
      }
      if (this.downloadList.get(firstBookId).length <= 0){
        var exsit = false;
        this.downloadedBooks.forEach(element => {
          if (element.ID == firstBookId){
            exsit = true;
            return false;
          }
        });
        if (exsit == false){
          console.log("----------------装载下载完成-----------")
          this.downloadedBooks.push(this.downloadBooks.shift())
        }else{
          this.downloadBooks.shift()
        }
      }
    }
  }

  downloadItem(chapterItem):Promise<any> {

    if (chapterItem.downloaded || chapterItem.isFailed){
      this.downloading = false;
      this.startDownLoad()
      return;
    }
    
    return new Promise((resolve => {
      this.api.get('getChapter.php', chapterItem.requestParam)
        .then(data => {
          console.log(data);
          var title = chapterItem.requestParam.title.replace(/^\s+|\s+$/g,"");
          var path = this.file.documentsDirectory;//"D:\\" ; //this.file.documentsDirectory
          this.file.checkDir(path, title).then(hasExsit=>{
            if (!hasExsit){
              this.file.createDir(path, title, false).catch(()=>{

              });
            }
          }).catch(()=>{

          })
          // var fileurl = path + chapterItem.requestParam.chapterID + '.mp3';
          var fileurl = path + title + "/" + chapterItem.requestParam.chapterID + '.mp3';
          
          var uri = encodeURI(data.chapterSrcArr[0]);
         
          this.fileTransfer.abort();
          this.fileTransfer.download(uri, fileurl, true).then((fileEntry)=>{
            console.log('下载音频文件: ' + fileEntry.toURL());
            this.downloadingCount --;
            this.curDownloadItem.downloadSucceed(fileEntry.toURL());
            let firstBookId = this.downloadBooks[0].ID;
            this.downloadedList.get(firstBookId).push(this.curDownloadItem)
            this.downloadList.get(firstBookId).shift()
            this.downloading = false;
            this.startDownLoad();
          }).catch((error :FileTransferError)=>{
            console.log("下载报错Error:-------------");
            console.log(error)
            this.downloadingCount --;

            if (error.code != 4){
              this.curDownloadItem.downloadFailed();

              let firstBookId = this.downloadBooks[0].ID;
              this.downloadedList.get(firstBookId).push(this.curDownloadItem)
              console.log(this.curDownloadItem)
              this.downloadList.get(firstBookId).shift()
            }
            this.downloading = false;
            this.startDownLoad();
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

  cancelChapter(chapterItem, bookid){
    if (this.downloadList.has(bookid)){
      var index : number = 0;
      for(var i = 0; i < this.downloadList.get(bookid).length; ++i){
        if (this.downloadList.get(bookid)[i].isEqual(chapterItem)){
          index = i;
          break;
        }
      }
      if (index >= 0){
        if (chapterItem.isEqual(this.curDownloadItem)){
          this.fileTransfer.abort();
          this.downloading = false;
          this.curDownloadItem = null;
        }
        chapterItem.cancelSelf()
        this.downloadList.get(bookid).splice(index, 1)
        this.startDownLoad();
        console.log("---------------------书本Length="+this.downloadBooks.length+", 章节="+this.downloadList.get(bookid).length);
      }
    }
  }

  removeFailedItem(item, bookid){
    if (this.downloadedList.has(bookid)){
      var index = 0;
      for(var i = 0; i < this.downloadedList.get(bookid).length; ++i){
        if (this.downloadedList.get(bookid)[i].isEqual(item)){
          index = i;
          break;
        }
      }
      if (index >= 0){
        item.cancelSelf()
        this.downloadedList.get(bookid).splice(index, 1)
      }
    }
  }

  cancelBook(bookitem){
    var index = this.downloadBooks.indexOf(bookitem)
    if (index == 0) {
      this.fileTransfer.abort();
      this.downloading = false;
      this.curDownloadItem = null;
    }
    if (index >= 0){
      if (this.downloadList.has(bookitem.ID)){
        this.downloadList.get(bookitem.ID).forEach(element => {
          element.cancelSelf();
        });
        this.downloadList.delete(bookitem.ID);
      }
      this.downloadBooks.splice(index, 1)
      this.events.publish('book.downloading.cancel', bookitem);
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
