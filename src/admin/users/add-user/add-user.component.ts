import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User, UserRole } from 'src/shared/model/userModel';
import { UserService } from 'src/shared/services/user/user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'admin-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  newUser!: User;
  addUserForm!: FormGroup;
  userRoles: UserRole[] = [
    'ADMIN',
    'USER',
    'DELIVERY_PARTNER',
    'STORE_MANAGER',
  ];
  isLoading = false;
  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.initNewUser();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }

  initForm() {
    this.addUserForm = this.fb.group({
      userFirstName: this.fb.control('', Validators.required),
      userLastName: this.fb.control('', [Validators.required]),
      userPhone: this.fb.control('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13),
      ]),
      userEmail: this.fb.control('', [Validators.required, Validators.email]),
      userRole: this.fb.control('', Validators.required),
    });
  }

  initNewUser() {
    this.newUser = {
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userPhone: '',
      userRole: 'USER',
      userSavedAddresses: [],
      cart: {
        cartTotal: 0,
        cartItems: [],
      },
      userEncryptedPassword: '',
    };
  }

  handleSubmit() {
    if (this.addUserForm.valid) {
      const formValue = this.addUserForm.value;
      this.isLoading = true;
      this.newUser.userFirstName = formValue.userFirstName;
      this.newUser.userLastName = formValue.userLastName;
      this.newUser.userEmail = formValue.userEmail;
      this.newUser.userPhone = formValue.userPhone;
      this.newUser.userRole = formValue.userRole;
      
      const sub = this.userService.addUser(this.newUser).subscribe({
        next: (res) => {
          let message = 'User Addition Failed !';
          let action = 'Try Again Later';
          if (res.success) {
            message = 'User Added Successfully!!';
            action = 'Yayy!!';
          }
          this.snackBar.open(message, action, {
            duration: 4000,
          });
          this.isLoading = false;
          this.router.navigate(['/admin/users']);
        },
      });

      this.subscriptions.push(sub);
    }
  }

  handleCancel() {
    this.addUserForm.reset();
    this.snackBar.open('User addition cancelled!', 'Okay', {
      duration: 3000,
    });
    this.router.navigate(['/admin/users']);
  }
}
