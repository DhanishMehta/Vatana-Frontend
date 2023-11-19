import { Component, Input, OnInit } from '@angular/core';

export interface Card {
  title: string;
  description: string;
  color: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'admin-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class  CardComponent implements OnInit{
  @Input() card: Card | undefined;
  ngOnInit(): void {
  }
}
