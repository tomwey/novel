import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { CataloggroupProvider } from '../../providers/cataloggroup';
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
  catalogs : CataloggroupProvider;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiService,
    private tool: ToolService,private app: App,
    private transfer: FileTransfer, private file: File
  ) {
    
    console.log(this.navParams)
    this.chapters = this.navParams.data.chapters;
    this.bookitem = this.navParams.data.bookitem;
    this.catalogs = new CataloggroupProvider(this.bookitem, this.chapters);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadPage');
  }

  select(chapterItem){
    chapterItem.selectItem();
  }

  //选中所有
  selectAll(){
    this.catalogs.selectAll()
  }

  //不选
  unselectAll(){
    this.catalogs.unselectAll()
  }

  //反序
  reverse(){
    this.catalogs.reverse()
  }

  //下载选中
  downloadAll(){
    this.catalogs.downloadAll()
  }

  //连续选中
  selectMutil(){
    this.catalogs.selectMutil()
  }

  cancelAll(){
    
  }


}
