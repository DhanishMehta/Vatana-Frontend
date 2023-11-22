import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  /**
   * @function isHomePage: function to check if the current page is Home page
   */
  isHomePage(): boolean {
    return window.location.pathname === '/';
  }
}
