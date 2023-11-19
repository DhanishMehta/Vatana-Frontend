import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { UserService } from 'src/shared/services/user/user.service';

@Component({
  selector: 'admin-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {
  user: User;
  subsriptions: Subscription[] = [];

  constructor(private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
      this.getUser();
  }

  ngOnDestroy(): void {
      this.subsriptions.forEach(sub => sub.unsubscribe());
  }

  getUser(){
    const userId = this.authService.getUserId();
    this.userService.getUserById(userId).subscribe({
      next: (res) => {
        this.user = res.data;
      }
    })
  }


}
