import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-display',
  templateUrl: './review-display.component.html',
  styleUrls: ['./review-display.component.scss']
})
export class ReviewDisplayComponent implements OnInit{
 @Input() rating = '';
  fullStar = 0;
  halfStar = 0;
  noStar = 0

  fullStarArr = [];
  noStarArr = [];
  halfStarArr = [];

 ngOnInit(): void {
    const rate = Number(this.rating);``
    
    this.fullStar = Math.floor(Number(rate));
    this.halfStar = Math.round(Number(rate)) == this.fullStar ? 0 : 1;
    this.noStar = 5 - this.fullStar - this.halfStar;
    this.fullStarArr = Array(this.fullStar).fill(1);
    this.noStarArr = Array(this.noStar).fill(1);
    this.halfStarArr = Array(this.halfStar).fill(1);
 }
}
