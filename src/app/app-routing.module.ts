import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthFormComponent } from './auth/auth-form/auth-form.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'new', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'login', component: AuthFormComponent},
  { path: 'sign-up', component: AuthFormComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
