import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/shared/model/reqResModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class AuthLoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  loginForm!: FormGroup;
  usernames: string[] = [];
  submissionTried = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) this.ifUserLoggedIn();
    else this.ifUserLoggedOut();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * @function ifUserLoggedIn: navigates to Home if user is logged in
   */
  ifUserLoggedIn() {
    this.snackbar.open('User already logged in!!', 'Great');
    this.router.navigate(['/']);
  }
  
  /**
   * @function ifUserLoggedOut: performs actions if user is logged out
   */
  ifUserLoggedOut() {
    this.initForm();
    this.getAllUsernames();
  }

  /**
   * @function initForm: function to initialize forms
   */
  initForm() {
    this.loginForm = this.fb.group({
      userEmail: this.fb.control('', [Validators.required, Validators.email]),
      userPassword: this.fb.control('', [Validators.required]),
    });
  }

  /**
   * @function getAllUsernames: function to get all usernames
   */
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

  /**
   * @function isEmailUnique: function to check if the entered email is unique or not
   * @returns 
   */
  isEmailUnique(): boolean {
    const newEmail = this.loginForm.controls['userEmail'].value;
    if (this.usernames.includes(newEmail)) return false;
    else return true;
  }

  /**
   * @function buildAuthReq: function to transform and the form values to authentication request
   * @returns 
   */
  buildAuthReq() {
    const formValue = this.loginForm.value;
    const authDetails: AuthenticationRequest = {
      userEmail: formValue.userEmail,
      userPassword: formValue.userPassword,
    };
    return authDetails;
  }

  /**
   * @function handleLogin: function to handle login
   * @returns 
   */
  handleLogin() {
    if (this.loginForm.valid) {
      this.submissionTried++;
      if (this.isEmailUnique()) {
        return;
      }
      const sub = this.authService.authenticate(this.buildAuthReq()).subscribe({
        next: (res) => {
          let message = 'Failed to Log In';
          let action = 'Try later';
          if (res.success) {
            message = 'Logged In Successfully';
            action = 'Yayy!';
            this.authService.setRole(res.data.data.userRole);
            this.authService.setToken(res.data.token);
            this.authService.setUserId(res.data.data.userId);
            // this.snackbar.open(message, action, {
            //   duration: 2000
            // });
            this.router.navigate(['/']);
          } else {
            this.snackbar.open(message, action, {
              duration: 3000,
            });
          }
        },
        error: (er) => {
          console.error(er);
        },
      });
      this.subscriptions.push(sub);
    }
  }
}
