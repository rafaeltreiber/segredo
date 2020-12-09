import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
 
// Send unauthorized users to login
const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/login']);
 
// Automatically log in users
const redirectLoggedInToEsconder = () => redirectLoggedInTo(['/esconder']);
 
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToEsconder),
  },
  {
    path: 'esconder',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./esconder/esconder.module').then( m => m.EsconderPageModule)
  },
  {
    path: 'login',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'procurar',
    loadChildren: () => import('./procurar/procurar.module').then( m => m.ProcurarPageModule)
  }
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }