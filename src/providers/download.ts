import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
/*
  Generated class for the DownloadServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DownloadService {
  // 0 默认状态 1 等待下载 2 下载中 3 下载完成
  private _downloadBooks: any = [];           // 保存正在下载的书籍
  private _chapters: any = new Map();         // 缓存所有的章节
  private _downloadChapters: any = new Map(); // 保存正在下载的章节

  private _currentDownloadChapter: any = null; // 保存当前正在下载的章节

  constructor(private api: ApiService) {
    
  }

  getChapters(bookID): any {
    if (!this._chapters.has(bookID)) return null;

    return this._chapters[bookID];
  }

  saveChapters(bookID, chapters): void {
    this._chapters[bookID] = chapters;
  }

  addToDownloadQueue(book, chapters) {
    if (!book || !chapters || chapters.length === 0) return;

    if (this._downloadChapters.has(book.ID)) {
      this._downloadChapters[book.ID] = this._downloadChapters[book.ID].concat(chapters);
    } else {
      this._downloadBooks.push(book);
      this._downloadChapters[book.ID] = chapters;
    }

    if (!this._currentDownloadChapter) {
      let firstChapter = this._downloadChapters[book.ID][0];

      this._currentDownloadChapter = firstChapter;
      firstChapter._s = 2; // 即将下载
      
      this._prepareCurrentDownload();
    }
  } 

  private _prepareCurrentDownload() {

  }

  // getDownloadStateDesc(book, chapter): string {
  //   if (this._downloadBooks.length === 0) {
  //     return '下载';
  //   }

  //   let downloadBook = this.getDownloadBook(book);
  //   if (!downloadBook) {
  //     return '下载';
  //   }

    
  // }

  getDownloadBook(book) {
    this._downloadBooks.forEach(element => {
      if (element.ID === book.ID) {
        return element;
      }
    });
    return null;
  }

  /**
   * 添加章节到下载队列
   * @param chapterItems 需要下载的章节
   */
  addToDownload(chapterItems: any) {

  }

  /**
   * 取消某本书的一些章节，如果chapters为空，则取消该书全部下载
   * @param book 书
   * @param chapters 下载章节 
   */
  cancelDownloads(book, chapters) {

  }

}
