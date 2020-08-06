import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
    
  },
  {
  path: '',
  loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'add-product-page',
    loadChildren: () => import('./add-product-page/add-product-page.module').then( m => m.AddProductPagePageModule)
  },
  {
    path: 'product-detail-page',
    loadChildren: () => import('./product-detail-page/product-detail-page.module').then( m => m.ProductDetailPagePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
