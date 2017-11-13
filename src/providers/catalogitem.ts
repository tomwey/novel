import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

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
  total : number; //总大小
  loaded : number; //已经下载大小
  requestParam : any; //请求参数
  audioFile : string; //音频文件路径
  downloaded : boolean;  //下载已经完成
  iswaiting : number; //等待状态, 0 --- 未开始下载， 1 --- 进入下载列表， 2 --- 开始下载
  constructor(private item : any, private bookitem: any) {
    this.chapterItem = item;
    this.chapterTitle = item.chapterTitle;
    this.downloading = false;
    this.isSelected = false;
    this.iswaiting = 0;
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

  isEqual(chapter:CatalogitemProvider):any{
    if (this.requestParam.chapterHref == chapter.requestParam.chapterHref){
      return true;
    }
    return false;
  }

  downloadSucceed(filepath){
    this.downloaded = true;
    this.audioFile = filepath
  }

  downloadFailed(){
    this.downloading = false;
    this.downloaded = false;
    this.audioFile = null;
  }

  selectItem(){
    this.isSelected = !this.isSelected;
  }

}
