import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { UserService } from 'src/shared/services/user/user.service';
import { OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'
import { Order } from 'src/shared/model/orderModel';
import { OrderService } from 'src/shared/services/order/order.service';



@Component({
  selector: 'user-profile-area',
  templateUrl: './profile-area.component.html',
  styleUrls: ['./profile-area.component.scss']
})
export class ProfileAreaComponent implements OnInit, OnDestroy{
  isLoading = true;
  subscriptions: Subscription[] = [];
  user: User;
  editUserForm!: FormGroup;
  orderList: Order[] = [];
  constructor(private fb: FormBuilder, private orderService: OrderService, private authService: AuthService, private userService: UserService, private snackbar: MatSnackBar, private router: Router){};

  ngOnInit(): void {
      this.getUserDetails();
      this.getOrders();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getUserDetails(){
    const userId = this.authService.getUserId();
    if(userId !== null){
      const sub = this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res.data;
          this.initForm();
        },
        error: (er) => {
          console.error(er);
        }
      });

      this.subscriptions.push(sub);
    }
  }

  getOrders() {
    const sub = this.orderService.getOrdersOfLoggedInUser().subscribe({
      next: (res) => {
        this.orderList = res.data;
        this.isLoading = false;
      },
      error: (er) => {
        console.error(er);
      }
    });
    this.subscriptions.push(sub);
  }

  initForm(){
    this.editUserForm = this.fb.group({
      firstname: this.fb.control(this.user.userFirstName, [Validators.required, Validators.minLength(3), Validators.maxLength(17)]),
      lastname: this.fb.control(this.user.userLastName, [Validators.required, Validators.minLength(3), Validators.maxLength(17)]),
      email: this.fb.control(this.user.userEmail, [Validators.email, Validators.required]),
      phoneNo: this.fb.control(this.user.userPhone,[Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
    })
  }

  handleEditUser() {
    if(this.editUserForm.valid){
      let updatedUser = this.user;
      const formValue = this.editUserForm.value;
      updatedUser.userFirstName = formValue.firstname;
      updatedUser.userLastName = formValue.lastname;
      updatedUser.userEmail = formValue.email;
      updatedUser.userPhone = formValue.phoneNo;

      const sub = this.userService.updateUser(updatedUser, this.user.userId!).subscribe({
        next: (res) => {
          if(res.success) {
            this.snackbar.open("User details updated", "Yayy!", {
              duration: 3000
            });
          } else {
            this.snackbar.open("Unable to edit user details", "Try later!", {
              duration: 3000
            });
          }
        }
      });

      this.subscriptions.push(sub);
    }
  }

  handleLogout(){
    this.authService.clearSessionStorage();
    this.router.navigate(['/']);
  }

  routeToOrder(orderId: String){
    this.router.navigate(['/order/success'], {queryParams: {id: orderId}})
  }

  // generatePDF(action = 'open') {
  //   let docDefinition = {
  //     content: [
  //       {
  //         text: 'VATANA CORP',
  //         fontSize: 16,
  //         alignment: 'center',
  //         color: '#92BF26'
  //       },
  //       {
  //         text: 'INVOICE',
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center',
  //         decoration: 'underline',
  //         color: 'skyblue'
  //       },
  //       {
  //         text: 'Customer Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: this.invoice.customerName,
  //               bold:true
  //             },
  //             { text: this.invoice.address },
  //             { text: this.invoice.email },
  //             { text: this.invoice.contactNo }
  //           ],
  //           [
  //             {
  //               text: `Date: ${new Date().toLocaleString()}`,
  //               alignment: 'right'
  //             },
  //             { 
  //               text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
  //               alignment: 'right'
  //             }
  //           ]
  //         ]
  //       },
  //       {
  //         text: 'Order Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', 'auto', 'auto', 'auto'],
  //           body: [
  //             ['Product', 'Price', 'Quantity', 'Amount'],
  //             ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
  //             [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
  //           ]
  //         }
  //       },
  //       {
  //         text: 'Additional Details',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           text: this.invoice.additionalDetails,
  //           margin: [0, 0 ,0, 15]          
  //       },
  //       {
  //         columns: [
  //           [{ qr: `${this.invoice.customerName}`, fit: '50' }],
  //           [{ text: 'Signature', alignment: 'right', italics: true}],
  //         ]
  //       },
  //       {
  //         text: 'Terms and Conditions',
  //         style: 'sectionHeader'
  //       },
  //       {
  //           ul: [
  //             'Order can be return in max 10 days.',
  //             'Warrenty of the product will be subject to the manufacturer terms and conditions.',
  //             'This is system generated invoice.',
  //           ],
  //       }
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,
  //         decoration: 'underline',
  //         fontSize: 14,
  //         margin: [0, 15,0, 15]          
  //       }
  //     }
  //   };

  //   if(action==='download'){
  //     pdfMake.createPdf(docDefinition).download();
  //   }else if(action === 'print'){
  //     pdfMake.createPdf(docDefinition).print();      
  //   }else{
  //     pdfMake.createPdf(docDefinition).open();      
  //   }

  // } 
}
