import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => AdminModule,
  },
  {
    path: "auth",
    loadChildren: () => AuthModule
  },
  {
    path: "",
    loadChildren: () => UserModule
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
