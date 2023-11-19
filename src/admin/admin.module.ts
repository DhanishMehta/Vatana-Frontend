import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from 'src/shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopbarComponent } from './components/main-content/topbar/topbar.component';
import { CardComponent } from './components/main-content/card/card.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { SortIconComponent } from './components/sort-icon/sort-icon.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ViewProductComponent } from './products/view-product/view-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { UpdateProductComponent } from './products/update-product/update-product.component';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrdersComponent } from './orders/view-orders/view-orders.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    SidebarComponent,
    MainContentComponent,
    FooterComponent,
    TopbarComponent,
    CardComponent,
    UsersComponent,
    ProductsComponent,
    SortIconComponent,
    ViewUsersComponent,
    AddUserComponent,
    EditUserComponent,
    ViewProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    OrdersComponent,
    ViewOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
