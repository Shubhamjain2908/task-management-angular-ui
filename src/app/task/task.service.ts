import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/services/base.service';

@Injectable()
export class TaskService {

  constructor(private http: BaseService) { }

  createTask(data): Observable<any> {
    return this.http.post('tasks', data);
  }

  fetchTasks(): Observable<any> {
    return this.http.get('tasks');
  }

  updateTask(id, data): Observable<any> {
    return this.http.put('task/' + id, data);
  }

  updateStatus(id, data): Observable<any> {
    return this.http.patch(`task/${id}/status`, data);
  }

  deleteTask(id) {
    return this.http.delete('task/' + id);
  }

}
