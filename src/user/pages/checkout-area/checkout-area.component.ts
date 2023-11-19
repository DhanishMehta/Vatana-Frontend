import { Component, OnInit } from '@angular/core';
// import {uuid4} from "uuid";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutItem, Order } from 'src/shared/model/orderModel';
import { User } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { OrderService } from 'src/shared/services/order/order.service';
import { UserService } from 'src/shared/services/user/user.service';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from 'src/shared/services/cart/cart.service';
import { CouponService } from 'src/shared/services/coupon/coupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var Razorpay: any;

@Component({
  selector: 'user-checkout-area',
  templateUrl: './checkout-area.component.html',
  styleUrls: ['./checkout-area.component.scss'],
})
export class CheckoutAreaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoading = true;

  couponCode!: FormControl;
  orderDetails!: FormArray;
  billingDetails!: FormGroup;
  addressDetails!: FormGroup;
  payemntDetails!: FormGroup;
  couponForm: FormGroup;
  couponDiscount = 0;

  newOrder: Order;
  user: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private couponService: CouponService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getUser() {
    const userId = this.authService.getUserId();
    const sub = this.userService.getUserById(userId!).subscribe({
      next: (res) => {
        this.user = res.data;
        this.initForms();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub);
  }

  initForms() {
    this.couponCode = this.fb.control('');
    this.orderDetails = this.fb.array([
      (this.billingDetails = this.fb.group({
        firstName: this.fb.control(
          this.user.userFirstName,
          Validators.required
        ),
        lastName: this.fb.control(this.user.userLastName, Validators.required),
        emailAddress: this.fb.control(this.user.userEmail, Validators.required),
        phoneNo: this.fb.control(this.user.userPhone, Validators.required),
        companyName: this.fb.control(''),
        companyAddress: this.fb.control(''),
      })),
      (this.addressDetails = this.fb.group({
        country: this.fb.control('India'),
        addressLine1: this.fb.control(
          this.user.userSavedAddresses[0]
            ? this.user.userSavedAddresses[0].addressLineOne
            : '',
          Validators.required
        ),
        addressLine2: this.fb.control(
          this.user.userSavedAddresses[0]
            ? this.user.userSavedAddresses[0].addressLineTwo
            : '',
          Validators.required
        ),
        city: this.fb.control(
          this.user.userSavedAddresses[0]
            ? this.user.userSavedAddresses[0].addressCity
            : '',
          Validators.required
        ),
        state: this.fb.control(
          this.user.userSavedAddresses[0]
            ? this.user.userSavedAddresses[0].addressState
            : '',
          Validators.required
        ),
        zipcode: this.fb.control(
          this.user.userSavedAddresses[0]
            ? this.user.userSavedAddresses[0].addressPincode
            : '',
          Validators.required
        ),
        deliveryInstructions: this.fb.control(''),
      })),
      (this.payemntDetails = this.fb.group({
        paymentMethod: this.fb.control(''),
      })),
    ]);

    this.couponForm = this.fb.group({
      couponCode: this.fb.control(''),
    });

    this.updateNewOrder();
    this.newOrder.orderId = '';

    this.isLoading = false;
  }

  handleAddCouponCode() {
    const couponCode = this.couponForm.get('couponCode').value;
    this.couponService.validateCoupon(couponCode).subscribe({
      next: (res) => {
        if(res.success){
          this.couponDiscount = res.data.redemption;
          this.setPriceInOrder();
          this.snackbar.open("Coupon code Added", "Yayy!");
        }
      },
      error: (er) => {
        console.error(er);
      }
    })
  }

  handlePlaceOrder() {
    if (this.orderDetails.valid) {
      this.updateNewOrder();
      this.postOrderToServer();
      // this.clearCart(); called inside postOrderToServer
      // this.handlePayment(); called inside postOrderToServer
    }
  }

  updateNewOrder() {
    const formValue = this.orderDetails.value;
    const userId = this.authService.getUserId();
    this.newOrder = {
      userId: userId,
      billingDetails: {
        firstName: formValue[0].firstName,
        lastName: formValue[0].lastName,
        emailAddress: formValue[0].emailAddress,
        phoneNo: formValue[0].phoneNo,
        companyName: formValue[0].companyName,
        companyAddress: formValue[0].companyAddress,
      },
      address: {
        addressLineOne: formValue[1].addressLine1,
        addressLineTwo: formValue[1].addressLine2,
        addressState: formValue[1].state,
        addressCity: formValue[1].city,
        addressPincode: formValue[1].zipcode,
        addressLandmark: formValue[1].deliveryInstructions,
      },
      paymentDetails: {
        paymentMethod: '',
        transactionId: '',
        success: false,
      },
      items: [],
      pricing: {
        orderTotal: 0,
        discount: 0,
        delivery: 0,
        GST: 0,
        grandTotal: 0,
      },
      orderStatus: 'INITIALIZED',
    };
    this.setItemsInOrder();
    this.setPriceInOrder();
  }

  setItemsInOrder() {
    this.newOrder.items = [];
    this.user.cart?.cartItems.forEach((item) => {
      const newCheckoutItem: CheckoutItem = {
        productName: item.cartItemProduct.desc,
        productImage: item.cartItemProduct.images![0].m,
        price: item.cartItemProduct.pricing.discount.mrp,
        quantity: item.cartItemQuantity,
      };
      this.newOrder.items.push(newCheckoutItem);
    });
  }

  setPriceInOrder() {
    this.newOrder.pricing.orderTotal = this.user.cart?.cartTotal!;
    let discount = 0;
    this.user.cart?.cartItems.forEach((item) => {
      discount +=
        Number(item.cartItemProduct.pricing.discount.mrp) -
        Number(item.cartItemProduct.pricing.discount.subscription_price);
    });
    discount += this.couponDiscount;
    this.newOrder.pricing.discount = Number(discount.toFixed(2));
    this.newOrder.pricing.delivery = Number(
      (0.1 * this.newOrder.pricing.orderTotal).toFixed(2)
    );
    this.newOrder.pricing.GST = Number(
      (0.18 * this.newOrder.pricing.orderTotal).toFixed(2)
    );
    this.newOrder.pricing.grandTotal = Number(
      (
        this.newOrder.pricing.orderTotal +
        0.18 * this.newOrder.pricing.orderTotal +
        0.1 * this.newOrder.pricing.orderTotal -
        discount
      ).toFixed(2)
    );
  }

  clearCart() {
    this.cartService.clearCart();
  }

  postOrderToServer() {
    const sub = this.orderService.postOrder(this.newOrder).subscribe({
      next: (res) => {
        this.newOrder.orderId = res.data.orderId;
        this.clearCart();
        this.handlePayment();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub);
  }

  handlePayment() {
    let totAmount = this.newOrder.pricing.grandTotal;
    var options = {
      key: 'rzp_test_7o9eJC3c7HeJpn', // Enter the Key ID generated from the Dashboard
      amount: totAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'INR',
      name: 'Vatana Corp', //your business name
      description: 'Test Transaction',
      image: '/assets/img/favicon.png',
      order_id: this.newOrder.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: (response: any, error: any) => {
        let redirectUrl = '/';
        if (!response.razorpay_payment_id || response.razorpay_payment_id < 1) {
          redirectUrl += 'order/failed';
        } else {
          redirectUrl += 'order/success';
        }
        this.router.navigate([redirectUrl], {
          queryParams: { id: this.newOrder.orderId },
        });
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name:
          this.newOrder.billingDetails.firstName +
          ' ' +
          this.newOrder.billingDetails.lastName, //your customer's name
        email: this.newOrder.billingDetails.emailAddress,
        contact: this.newOrder.billingDetails.phoneNo, //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: 'Vatana Corporate Office',
      },
      theme: {
        color: '#80B500',
      },
    };

    // var rzp1 = new Razorpay(options);
    Razorpay.open(options);
  }
}
