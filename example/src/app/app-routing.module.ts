import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoRoomComponent } from './room/room.component';

const routes: Routes = [
  {
    path: '',
    component: DemoRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
