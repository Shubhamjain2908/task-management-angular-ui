import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragulaModule } from 'ng2-dragula';
import { TaskboardRoutingModule } from './taskboard-routing.module';

import { TaskboardComponent } from './taskboard/taskboard.component';
import { CustomFormsModule } from 'ng5-validation';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TaskboardRoutingModule,
    DragulaModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule
  ],
  declarations: [
    TaskboardComponent
  ]
})
export class TaskboardModule { }
