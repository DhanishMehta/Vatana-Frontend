import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { ViewProductComponent } from './products/view-product/view-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { UpdateProductComponent } from './products/update-product/update-product.component';
import { isAdmin } from 'src/auth/auth.guard';
import { ViewOrdersComponent } from './orders/view-orders/view-orders.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [isAdmin],
    canActivateChild: [isAdmin],
    children: [
      {
        path: '',
        component: MainContentComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: '',
            component: ViewUsersComponent,
          },
          {
            path: 'new',
            component: AddUserComponent,
          },
          {
            path: 'edit/:id',
            component: EditUserComponent,
          },
        ],
      },
      {
        path: 'products',
        component: ProductsComponent,
        children: [
          {
            path: '',
            component: ViewProductComponent,
          },
          {
            path: 'new',
            component: AddProductComponent,
          },
          {
            path: 'edit/:id',
            component: UpdateProductComponent,
          },
        ],
      },
      {
        path: 'orders',
        component: ProductsComponent,
        children: [
          {
            path: '',
            component: ViewOrdersComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
