import { Injectable } from '@angular/core';
import { BaseService } from '../shared/services/base.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {
  constructor(private http: BaseService) {
  }

  dashboard(): Observable<any> {
    return this.http.get('dashboard');
  }
}
