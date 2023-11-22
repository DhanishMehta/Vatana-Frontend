import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export const StrongPasswordRegx =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class AuthRegisterComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  registerForm!: FormGroup;
  userToken = '';
  usernames: string[] = [];
  isPasswordVisibile = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllUsernames();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * @function initForm: fucntion to initialize forms
   */
  initForm() {
    this.registerForm = this.fb.group({
      userFirstName: this.fb.control('', [Validators.required]),
      userLastName: this.fb.control('', [Validators.required]),
      userPhone: this.fb.control('', [Validators.required]),
      userEmail: this.fb.control('', [Validators.required, Validators.email]),
      userPassword: this.fb.control('', [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
      ]),
    });
  }

  /**
   * @function isEmailUnique: function to check if the email is unique
   * @returns 
   */
  isEmailUnique(): boolean {
    const newEmail = this.registerForm.controls['userEmail'].value;
    if (this.usernames.includes(newEmail)) return false;
    else return true;
  }

  /**
   * @function buildNewUser: funciton to build new user from the form valuess
   * @returns new user
   */
  buildNewUser(): User {
    const formValue = this.registerForm.value;
    const newUser: User = {
      userFirstName: formValue.userFirstName,
      userLastName: formValue.userLastName,
      userPhone: formValue.userPhone,
      userEncryptedPassword: formValue.userPassword,
      userEmail: formValue.userEmail,
      userRole: 'USER',
      userSavedAddresses: [],
    };
    return newUser;
  }

  /**
   * @function handleRegister: function to handle the new user registration
   * @returns 
   */
  handleRegister(): void {
    if (this.registerForm.valid) {
      if (!this.isEmailUnique()) {
        this.snackBar.open('This Email already exists.', 'Okay');
        return;
      }
      const newUser = this.buildNewUser();
      const sub = this.authService.register(newUser).subscribe({
        next: (res) => {
          let message = 'User Registration Failed';
          let action = 'Try again later!';
          if (res.success) {
            message = 'User Registered Successfully';
            action = 'Yayy!!';
            this.authService.setToken(res.data.token);
            this.authService.setRole(res.data.data.userRole);
            this.authService.setUserId(res.data.data.userId);
          }
          this.snackBar.open(message, action, {
            duration: 3000,
          });
          this.router.navigate(['/']);
        },
      });
      this.subscriptions.push(sub);
    }
  }

  getAllUsernames() {
    const sub = this.authService.getAllUsernames().subscribe({
      next: (res) => {
        if (res.success) {
          this.usernames = res.data;
        } else {
          console.error('Failed to get usernames');
        }
      },
    });
    this.subscriptions.push(sub);
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById(
      'floatingPassword'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.isPasswordVisibile = true;
    } else {
      passwordInput.type = 'password';
      this.isPasswordVisibile = false;
    }
  }
}
