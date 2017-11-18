import { Injectable, state } from '@angular/core';
import 'rxjs/add/operator/map';
import { File, RemoveResult } from '@ionic-native/file';
import { NewbieService } from './newbie-service';
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
  private _total : string = "0"; //总大小
  private _loaded : string = "0"; //已经下载大小
  private totalSize:number = 0;
  private loadSize:number = 0;
  requestParam : any; //请求参数
  audioFile : string; //音频文件路径
  private _downloaded : boolean;  //下载已经完成
  private _iswaiting : number; //等待状态, 0 --- 未开始下载， 1 --- 进入下载列表， 2 --- 开始下载
  private _isFailed : boolean = false;
  status:string;
  bookId:string;
  lcount :number = 0;
  
  icon_name: string = 'ios-download-outline';
  
  constructor(private item : any, private bookitem: any, private file:File, private nbService: NewbieService) {
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
    this._total = this.changeTwoDecimal_f(parseFloat(value) / 1024 / 1024);
    //this.status = this.getdesc()
    this.totalSize = parseInt(value)
  }

  public get loaded(){
    return this._loaded;
  }

  public set loaded(value){
    if (parseInt(value) < this.loadSize){
      return;
    }
    console.log("正在下载-----")
    this.lcount ++;
    this._loaded = this.changeTwoDecimal_f(parseFloat(value) / 1024 / 1024);
    this.loadSize = parseInt(value);
    // if (this.lcount > 10 || this.loadSize >= this.totalSize){
      // setTimeout(() => {
        this.status = this.getdesc()
      // }, 0);
      this.lcount = 0;
    // }
  }

  public set iswaiting(value){
    this._iswaiting = value;
    this.status = this.getdesc()
  }

  public get iswaiting(){
    return this._iswaiting;
  }

  private get downloaded(){
    return this._downloaded;
  }

  private set downloaded(value){
    this._downloaded = value;
    this.status = this.getdesc();
  }

  private get isFailed(){
    return this._isFailed;
  }

  private set isFailed(value){
    this._isFailed = value;
    this.status = this.getdesc();
  }

  changeTwoDecimal_f(x) {
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
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
    this.chapterItem.audioFile = filepath;
    this.updateStorge()
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
        this.icon_name = 'ios-close-outline';
        return "等待下载"
      }else if (this.iswaiting == 2){
        if (this.downloaded == false && this.isFailed == false){
          this.icon_name = 'ios-close-outline';
          return "正在下载：" + this.loaded + "M/" + this.total + "M"
        }else if (this.isFailed){
          this.icon_name = 'ios-trash-outline';
          return "下载失败"
        }else if (this.downloaded){
          this.icon_name = 'ios-trash-outline';
          return "下载成功"
        }
      }
    }
    this.icon_name = 'ios-download-outline';
    return "下载"
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
            this.total = "0";
            this.loaded = "0";
            this.audioFile = null;
            if (window.downloadTool){
              window.downloadTool.removeDownloadedItem(this, this.bookId)
            }
            this.updateStorge()
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

  updateStorge(){
    this.nbService.getItems(NewbieService.DOWNLOADED_KEY).then(data => {
      var isExsit = false;
      if (data && data.length > 0){
        data.forEach(chapters => {
          if (chapters.ID == this.bookitem.ID){
            isExsit = true;
            if (chapters.downloadedChapter && chapters.downloadedChapter.length >= 0){
              for (var i = 0; i < chapters.downloadedChapter.length; ++i){
                if (chapters.downloadedChapter[i].chapterID == this.chapterItem.chapterID){
                  chapters.downloadedChapter.splice(i, 1);
                  break;
                } 
              }
              if (this.chapterItem.audioFile){
                chapters.downloadedChapter.push(this.chapterItem)
              }
            }else {
              chapters.downloadedChapter = [];
              chapters.downloadedChapter.push(this.chapterItem)
            }
            return false;
          }
        });
      }
      if (!isExsit){
        this.bookitem.downloadedChapter = [];
        this.bookitem.downloadedChapter.push(this.chapterItem)
        data.push(this.bookitem)
      }
      this.nbService.removeItems(NewbieService.DOWNLOADED_KEY, [data]).then(()=>{
        this.nbService.saveObject(NewbieService.DOWNLOADED_KEY, data);
      }).catch(()=>{

      })
    })
  }

}
