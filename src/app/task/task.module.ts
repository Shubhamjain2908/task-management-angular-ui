import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './task-listing/task-listing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    TaskRoutingModule
  ],
  declarations: [
    TaskComponent
  ]
})
export class TaskModule { }
