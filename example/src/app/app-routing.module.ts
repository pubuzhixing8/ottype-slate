import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoRichtextComponent } from './richtext/richtext.component';

const routes: Routes = [
  {
    path: '',
    component: DemoRichtextComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
