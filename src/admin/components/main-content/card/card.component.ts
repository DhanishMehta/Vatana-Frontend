import { Component, Input } from '@angular/core';

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
export class  CardComponent{
  @Input() card: Card | undefined;
}
