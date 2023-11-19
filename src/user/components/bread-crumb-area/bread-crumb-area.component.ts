import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-bread-crumb-area',
  templateUrl: './bread-crumb-area.component.html',
  styleUrls: ['./bread-crumb-area.component.scss'],
})
export class BreadCrumbAreaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  activePage = '';
  constructor(private router: Router) {}

  ngOnInit(): void {

    const sub = this.router.events.subscribe({
      next: (val) => {
        if (val instanceof NavigationEnd === false) {
          console.error(val);
          this.getPage();
        }
      },
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getPage() {
    let path = window.location.pathname.slice(1) + '/';
    path = path.toLowerCase();
    const index = path.indexOf('/');
    path = path.slice(0, 1).toUpperCase() + path.slice(1, index);
    this.activePage = path;
    if (this.activePage == 'Pd') this.activePage = 'Product';
  }
}
