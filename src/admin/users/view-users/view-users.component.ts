import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { User } from 'src/shared/model/userModel';
import { UserService } from 'src/shared/services/user/user.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/shared/components/alert-dialog/alert-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'admin-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements OnInit, OnDestroy {
  userList: User[] = [];
  subscriptions: Subscription[] = [];
  userListLength = 0;
  isLoading = true;

  searchForm: FormGroup = new FormGroup({});
  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    length: 10
  };
  sortIcon = '';
  sortState = 'unsorted';
  displayedColumns = [
    {
      width: '12%',
      name: 'UserID',
    },
    {
      width: '12%',
      name: 'First Name',
    },
    {
      width: '12%',
      name: 'Last Name',
    },
    {
      width: '15%',
      name: 'Phone No',
    },
    {
      width: '25%',
      name: 'Email ID',
    },
    {
      width: '10%',
      name: 'User Role',
    },
    {
      width: '10%',
      name: '',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.handlePagination();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initForm() {
    this.searchForm = this.fb.group({
      searchQuery: this.fb.control(''),
    });
  }

  handlePagination() {
    this.isLoading = true;
    this.subscriptions.forEach((sub) => sub.unsubscribe);
    const sub = this.userService
      .getAllUsers()
      .subscribe({
        next: (res) => {
          this.userList = res.data;
          this.userListLength = this.userList.length;
          this.pageEvent.length = this.userListLength;
          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.handlePagination();
  }

  handleDelete(userId: string) {
    let user!: User;
    const sub = this.userService.getUserById(userId).subscribe({
      next: (res) => {
        user = res.data;
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: {
            title: 'Alert',
            message: [
              'The below user will be Deleted',
              ...[user.userFirstName + ' ' + user.userLastName],
            ],
            dangerButton: 'Delete',
            neutralButton: 'Cancel',
          },
        });
        dialogRef.afterClosed().subscribe({
          next: (res) => {
            let message = 'User Deletion Canceled!';
            let action = 'Ok';
            if (res) {
              this.userService.deleteUser(userId).subscribe({
                next: (response) => {
                  message = 'User Deletion Failed';
                  action = 'Try Again Later!';
                  if (response) {
                    message = 'User Deleted';
                    action = 'Okay!';
                  }
                  this.handlePagination();
                  this.snackBar.open(message, action, {
                    duration: 3000,
                  });
                },
              });
            } else {
              this.snackBar.open(message, action, {
                duration: 3000,
              });
            }
          },
        });
      },
    });
    this.subscriptions.push(sub);
  }
}
