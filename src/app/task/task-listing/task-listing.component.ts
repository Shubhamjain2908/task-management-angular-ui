import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as alertFunctions from '../../shared/data/sweet-alert';
import swal from 'sweetalert2';
import { noWhitespaceValidator } from 'app/utils/custom-validators';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-listing',
  templateUrl: './task-listing.component.html',
  styleUrls: ['./task-listing.component.scss'],
  providers: [TaskService],
  encapsulation: ViewEncapsulation.None
})

export class TaskComponent implements OnInit {
  public data: any = [];
  noRecordErr = false;
  table_loader_class = 'table_loader';
  table_loader_class2 = '';

  disable_next = false;
  modalReference: NgbModalRef;
  closeResult: string;
  task: any;

  page = 1;
  currentPage = 0;
  payload: Object = {
    page: 1
  };

  addTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
    description: new FormControl('')
  });

  updateTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
    description: new FormControl('')
  });

  constructor(private modalService: NgbModal,
    private _httpService: TaskService,
    private _router: Router) {
  }

  ngOnInit() {
    this.listing();
  }

  listing() {
    this.table_loader_class = 'table_loader';
    this.data = [];
    this.noRecordErr = false;
    this._httpService.fetchTasks()
      .subscribe((result: any) => {
        if (result.success === true) {
          this.table_loader_class = '';
          if (result.data.length > 0) {
            this.data = result.data;
          }
          if (result.data.length === 0) {
            this.noRecordErr = true;
          }
        }
      }, (err: any) => {
        this.table_loader_class = '';
        this.errorHandle(err);
      }, () => console.log());
  }

  onAddTask() {
    const data = this.addTaskForm.value;
    const b = this.data.some(obj => obj.title === data.title);
    if (b) {
      alertFunctions.typeCustom('Error!', 'Task already present!', 'warning');
    } else {
      this._httpService.createTask(data)
        .subscribe((result: any) => {
          if (result.success === true) {
            this.modalReference.close();
            alertFunctions.typeCustom('Great!', 'Task added!', 'success');
            data.created_at = new Date();
            this.data.push(result.data);
            this.addTaskForm.reset();
          }
        }, (err: any) => {
          this.errorHandle(err);
        }, () => console.log());
    }
  }

  onUpdateTask() {
    const data = this.updateTaskForm.value;
    this._httpService.updateTask(this.task.id, data)
      .subscribe((result: any) => {
        if (result.success === true) {
          this.modalReference.close();
          alertFunctions.typeCustom('Great!', 'Task updated!', 'success');
          this.data = this.data.map((a) => {
            if (+a.id === +this.task.id) {
              a.title = data.title;
              a.description = data.description;
            }
            return a;
          });
          this.updateTaskForm.reset();
        }
      }, (err: any) => {
        this.errorHandle(err);
      }, () => console.log());
  }

  onChangeStatus(taskId, status) {
    this._httpService.updateStatus(taskId, { status: status })
      .subscribe((result: any) => {
        if (result.success === true) {
          alertFunctions.typeCustom('Great!', 'Status updated!', 'success');
          this.data = this.data.map((a) => {
            if (+a.id === +taskId) {
              a.status = status;
            }
            return a;
          });
          this.updateTaskForm.reset();
        }
      }, (err: any) => {
        this.errorHandle(err);
      }, () => console.log());
  }

  openUpdTask(content, task) {
    this.task = task;
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirmTextTask(data) {
    const self = this;
    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0CC27E',
      cancelButtonColor: '#FF586B',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success btn-raised mr-5',
      cancelButtonClass: 'btn btn-danger btn-raised',
      buttonsStyling: false
    }).then(function (isConfirm) {
      if (typeof isConfirm.value !== 'undefined' && isConfirm.hasOwnProperty('value')) {
        self.deleteTask(data);
      }
    })
  }

  deleteTask(data) {
    this._httpService.deleteTask(data.id)
      .subscribe((result: any) => {
        alertFunctions.typeCustom('Great!', 'Task Deleted!', 'success');
        this.data.splice(this.data.indexOf(data), 1);
      }, (err: any) => {
        this.errorHandle(err);
      }, () => console.log());
  }

  errorHandle(err) {
    // this.displayMessageError = true;
    if (err.status === 0) {
      // this.message = 'Please check your internet connection';
      alertFunctions.typeCustom('Error!', 'Please check your internet connection', 'warning');
      return;
    } else if (err.status === 500) {
      alertFunctions.typeCustom('Server Error!', 'Internal Server Error', 'error');
    } else if (err.status === 422) {
      alertFunctions.typeCustom('Validation Error!', err.error.message, 'error');
    } else if (err.status === 406) {
      alertFunctions.typeCustom('Not Allowed!', err.error.message, 'error');
    } else if (err.status === 401) {
      this._router.navigate(['/logout']);
    }
    // this.message = JSON.parse(err._body).message;
  }
}
