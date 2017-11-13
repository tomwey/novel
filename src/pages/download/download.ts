import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
/**
 * Generated class for the DownloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download',
  templateUrl: 'download.html',
})
export class DownloadPage {
  chapters: any = [];
  bookitem: any;
  downloadSrcs : {[id:string] : string;};
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiService,
    private tool: ToolService,private app: App,
    private transfer: FileTransfer, private file: File
  ) {
    
    console.log(this.navParams)
    this.chapters = this.navParams.data.chapters;
    this.bookitem = this.navParams.data.bookitem;
    this.chapters.forEach(element => {
      element.isSelected = false;
      element.downloading = false;
      element.downloadedPercent = 0;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadPage');
  }

  download(bookitem){

  }

  loadAllSrcs(){
    this.tool.showLoading('加载中...');
    this.chapters.forEach(item => {
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
      requestParams.ID = this.bookitem.ID;
      requestParams.openID = this.bookitem.openID;
      requestParams.chapterjs = this.bookitem.chapterjs;
      requestParams.title = this.bookitem.title;
      requestParams.chapterID = item.chapterID;
      requestParams.chapterTitle = item.chapterTitle;
      requestParams.chapterHref = this.bookitem.chapterpre + item.chapterHref;
      requestParams.chapterServer = item.chapterServer;

    });
  }
  loadAudioData(requestParams, item): Promise<any> {
    return new Promise((resolve => {
      
      this.api.get('getChapter.php', requestParams)
        .then(data => {
          this.tool.hideLoading();
          console.log(data);
          this.downloadSrcs[requestParams.chapterID] = data.chapterSrcArr[0]
          var fileurl = 'cdvfile://localhost/persistent/'+this.bookitem.title+'/'+requestParams.chapterTitle+'.mp3';
          item.downloading = true;
          const fileTransfer: FileTransferObject = this.transfer.create();

          fileTransfer.onProgress((e)=>{
              console.info(e);  
              if (e.lengthComputable) {  
                  console.log('当前进度：' + e.loaded / e.total);  
                  item.downloadedPercent = e.loaded / e.total;
              }  
          })
          fileTransfer.download(data.chapterSrcArr[0], fileurl, true).then((fileEntry)=>{
            console.log('下载音频软件成功: ' + fileEntry.toURL());
          }).catch((error)=>{

          });
          resolve(true);
        })
        .catch(error => {
          this.tool.hideLoading();
          resolve(false);
        })
    }));
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

  }

  //连续选中
  selectMutil(){

  }

}
