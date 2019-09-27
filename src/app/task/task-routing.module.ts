import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task-listing/task-listing.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TaskComponent,
        data: {
          title: 'Task listing'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule { }
