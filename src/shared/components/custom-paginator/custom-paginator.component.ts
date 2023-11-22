import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
})
export class CustomPaginatorComponent implements OnInit {
  @Output() page: EventEmitter<PageEvent> = new EventEmitter();
  @Input() length = 0;
  @Input() pageSize = 0;
  pageArray: Array<number>;
  selectedPage = 0;
  noOfPages = 0;

  pageEvent: PageEvent;

  ngOnInit(): void {
    this.pageEvent = {
      pageIndex: 0,
      pageSize: this.pageSize,
      previousPageIndex: 0,
      length: this.length,
    };
    this.noOfPages = Math.floor(this.pageEvent.length / this.pageEvent.pageSize);
    this.pageArray = new Array(this.noOfPages);
    this.pageArray.fill(this.noOfPages);
  }

  goToFirst() {
    this.pageEvent = {
      pageIndex: 0,
      pageSize: this.pageSize,
      previousPageIndex: 0,
      length: this.length,
    };
    this.selectedPage = 0;
    this.page.emit(this.pageEvent);
  }

  goToLast() {
    this.pageEvent = {
      pageIndex: this.noOfPages - 2,
      pageSize: this.pageSize,
      previousPageIndex: this.noOfPages - 3,
      length: this.length,
    };
    this.selectedPage = this.noOfPages - 1;
    this.page.emit(this.pageEvent);
  }

  updatePage(i: number) {
    this.selectedPage = i;
    this.pageEvent = {
      pageIndex: i,
      pageSize: this.pageSize,
      previousPageIndex: i - 1,
      length: this.length,
    };
    this.page.emit(this.pageEvent);
  }
}
