import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { CartMenuComponent } from './components/cart-menu/cart-menu.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { SliderAreaComponent } from './components/slider-area/slider-area.component';
import { BannerAreaComponent } from './components/banner-area/banner-area.component';
import { FeatureAreaComponent } from './components/feature-area/feature-area.component';
import { FooterAreaComponent } from './components/footer-area/footer-area.component';
import { WishlistModalComponent } from './components/modal/wishlist-modal/wishlist-modal.component';
import { AddToCartModalComponent } from './components/modal/add-to-cart-modal/add-to-cart-modal.component';
import { QuickViewModalComponent } from './components/modal/quick-view-modal/quick-view-modal.component';
import { ModalComponent } from './components/modal/modal.component';
import { BreadCrumbAreaComponent } from './components/bread-crumb-area/bread-crumb-area.component';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileAreaComponent } from './pages/profile-area/profile-area.component';
import { WishlistAreaComponent } from './pages/wishlist/wishlist.component';
import { UserComponent } from './user.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CartAreaComponent } from './pages/cart-area/cart-area.component';
import { CheckoutAreaComponent } from './pages/checkout-area/checkout-area.component';
import { ProductPageAreaComponent } from './pages/product-page-area/product-page-area.component';
import { ProductTabComponent } from './pages/product-tab/product-tab.component';
import { ProductCardComponent } from './pages/product-tab/product-card/product-card.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';

@NgModule({
  declarations: [
    BannerAreaComponent,
    BreadCrumbAreaComponent,
    CartMenuComponent,
    FeatureAreaComponent,
    FooterAreaComponent,
    HeaderComponent,
    MobileMenuComponent,
    ModalComponent,
    QuickViewModalComponent,
    AddToCartModalComponent,
    WishlistModalComponent,
    SliderAreaComponent,
    CartAreaComponent,
    CheckoutAreaComponent,
    NotFoundComponent,
    ProductPageAreaComponent,
    ProductTabComponent,
    ProductCardComponent,
    ProfileAreaComponent,
    UnauthorizedComponent,
    WishlistAreaComponent,
    UserComponent,
    OrderStatusComponent
  ],
  imports: [CommonModule, UserRoutingModule, SharedModule, AuthModule],
})
export class UserModule {}
