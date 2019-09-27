import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { TaskBoardService } from '../taskboard.service';
import { Task } from '../taskboard.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'app/utils/custom-validators';
import * as alertFunctions from './../../shared/data/sweet-alert';

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  providers: [TaskBoardService],
  encapsulation: ViewEncapsulation.None
})
export class TaskboardComponent {

  @ViewChild('todoTitle') titleInputRef: ElementRef;
  @ViewChild('todoMessage') messageInputRef: ElementRef;
  public tasks = [];
  public todo: Task[];
  public inProcess: Task[];
  public backLog: Task[];
  public completed: Task[];

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
    description: new FormControl('')
  });

  constructor(private elRef: ElementRef, private taskBoardService: TaskBoardService) {
    this.todo = taskBoardService.todo;
    this.inProcess = taskBoardService.inProcess;
    this.backLog = taskBoardService.backLog;
    this.completed = taskBoardService.completed;
  }

  onAddTask() {
    if (this.messageInputRef.nativeElement.value !== '' && this.titleInputRef.nativeElement.value !== '') {
      this.taskBoardService.addNewTask(this.titleInputRef.nativeElement.value, this.messageInputRef.nativeElement.value);
      this.todo = this.taskBoardService.gettodo();
    }
    this.titleInputRef.nativeElement.value = '';
    this.messageInputRef.nativeElement.value = '';
    this.titleInputRef.nativeElement.focus();
  }

  change(e) {
    console.log(e);
    console.log(this.todo, this.inProcess, this.completed);
  }

  addTask() {
    const data = this.taskForm.value;
    this.taskBoardService.createTask(data).subscribe(
      (result: any) => {
        if (result.body.success) {
          this.tasks = result.boody.data;
          this.taskForm.reset();
        } else {
          alertFunctions.typeCustom('Error!', result.body.message, 'error');
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

}
