import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isLoggedIn } from 'src/auth/auth.guard';
import { UserComponent } from './user.component';
import { ProductTabComponent } from './pages/product-tab/product-tab.component';
import { ProductPageAreaComponent } from './pages/product-page-area/product-page-area.component';
import { CartAreaComponent } from './pages/cart-area/cart-area.component';
import { WishlistAreaComponent } from './pages/wishlist/wishlist.component';
import { CheckoutAreaComponent } from './pages/checkout-area/checkout-area.component';
import { ProfileAreaComponent } from './pages/profile-area/profile-area.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        component: ProductTabComponent,
      },
      {
        path: 'shop',
        component: ProductTabComponent,
      },
      {
        path: 'pd/:productId/:productSlug',
        component: ProductPageAreaComponent,
      },
      {
        path: 'cart',
        component: CartAreaComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: 'wishlist',
        component: WishlistAreaComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: 'checkout',
        component: CheckoutAreaComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: 'profile',
        component: ProfileAreaComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: 'order/:status?id=:order_id',
        component: OrderStatusComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '403',
        component: UnauthorizedComponent,
      },
      {
        path: '**',
        redirectTo: '/404',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
