import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-users-sort-icon',
  templateUrl: './sort-icon.component.html',
  styleUrls: ['./sort-icon.component.scss'],
})
export class SortIconComponent {
  @Input() isSort = false;
  @Input() isSortedByColumn = false;
  @Input() sortIcon = '';
  @Input() id = '';
}
