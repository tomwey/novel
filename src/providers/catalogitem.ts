import { Injectable, state } from '@angular/core';
import 'rxjs/add/operator/map';
import { File, RemoveResult } from '@ionic-native/file';
declare let window;
window.downloadTool;
/*
  Generated class for the CatalogitemProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CatalogitemProvider {
  chapterTitle : string; //章节标题
  downloading : boolean; //是否在下载中
  chapterItem : any; //章节数据
  isSelected : boolean; //是否选中
  private _total : number = 0; //总大小
  private _loaded : number = 0; //已经下载大小
  requestParam : any; //请求参数
  audioFile : string; //音频文件路径
  downloaded : boolean;  //下载已经完成
  private _iswaiting : number; //等待状态, 0 --- 未开始下载， 1 --- 进入下载列表， 2 --- 开始下载
  isFailed : boolean = false;
  status:string;
  bookId:string;
  constructor(private item : any, private bookitem: any, private file:File) {
    this.chapterItem = item;
    this.chapterTitle = item.chapterTitle;
    this.downloading = false;
    this.isSelected = false;
    this.downloaded = false;
    this.iswaiting = 0;
    this.bookId = bookitem.ID;
    this.parseParam(bookitem)
  }

  parseParam(bookitem){
    var requestParams: any = { 
      openID:"e47d16be01ae009dbcdf696e62f9c1ecd5da4559",//设备唯一标识，可随意填一个
      isPlay : "1",
      chapterID : "ccc51fbfe2b4f5d2fd7804d0ba3d0083",
      chapterTitle : "[第003集]",
      title : "借命",
      chapterjs : "",
      chapterHref : "http:\/\/www.ysts8.com\/Yshtml\/Ys22483.html?vid=AGJ6AWV7BnFdNDUoNWZ4ATQqATB7LGAoMqQnLDNcADMpMDIsMWF8LJ7,,url=http:\/\/www.ysts8.com\/down_22483_50_1_3.html",
      chapterServer : "44c29edb103a2872f519ad0c9a0fdaaa",
      ID : "41f33a237e4af3435ba53c3d308a8cdf",
      ungz: 1
    };
    requestParams.ID = bookitem.ID;
    requestParams.openID = bookitem.openID;
    requestParams.chapterjs = bookitem.chapterjs;
    requestParams.title = bookitem.title;
    requestParams.chapterID = this.chapterItem.chapterID;
    requestParams.chapterTitle = this.chapterItem.chapterTitle;
    requestParams.chapterHref = bookitem.chapterpre + this.chapterItem.chapterHref;
    requestParams.chapterServer = this.chapterItem.chapterServer;
    this.requestParam = requestParams;
  }

  public get total(){
    return this._total;
  }

  public set total(value){
    this._total = value;
    this.status = this.getdesc()
  }

  public get loaded(){
    return this._loaded;
  }

  public set loaded(value){
    this._loaded = value;
    this.status = this.getdesc()
  }

  public set iswaiting(value){
    this._iswaiting = value;
    this.status = this.getdesc()
  }

  public get iswaiting(){
    return this._iswaiting;
  }

  isEqual(chapter:CatalogitemProvider):any{
    if (this.requestParam.chapterHref == chapter.requestParam.chapterHref){
      return true;
    }
    return false;
  }

  downloadSucceed(filepath){
    this.downloaded = true;
    this.audioFile = filepath;
    this.isFailed = false;
  }

  downloadFailed(){
    this.downloading = false;
    this.downloaded = false;
    this.audioFile = null;
    this.isFailed = true;
  }

  selectItem(){
    this.isSelected = !this.isSelected;
  }

  getdesc(){
    if (this.isSelected == true){
      if (this.iswaiting == 1){
        return "等待下载"
      }else if (this.iswaiting == 2){
        if (this.downloaded == false && this.isFailed == false){
          return this.loaded + "/" + this.total
        }else if (this.isFailed){
          return "下载失败"
        }else if (this.downloaded){
          return "下载成功"
        }
      }
    }
    return "未知状态"
  }

  deleteself(){
    if (this.downloaded && this.audioFile){
      var path = this.file.dataDirectory + this.requestParam.title + '/';
      var filename = this.requestParam.chapterID + '.mp3';
      if (this.file.checkFile(path, filename)){
        this.file.removeFile(path, filename).then((e:RemoveResult)=>{
          if (e.success){
            this.downloaded = false;
            this.iswaiting = 0;
            this.isSelected = false;
            this.isFailed = false;
            this.total = 0;
            this.loaded = 0;
            this.audioFile = null;
            if (window.downloadTool){
              window.downloadTool.removeDownloadedItem(this, this.bookId)
            }
          }
        }).catch((error)=>{
          console.log("删除文件出错")
        })
      }
    }
  }

  refreshItem(newItem : CatalogitemProvider){
    this.downloading = newItem.downloading;
    this.isSelected = newItem.isSelected;
    this.total = newItem.total;
    this.loaded = newItem.loaded;
    this.audioFile = newItem.audioFile;
    this.downloaded = newItem.downloaded;
    this.iswaiting = newItem.iswaiting;
    this.isFailed = newItem.isFailed;
    this.status = newItem.status;
  }

}
