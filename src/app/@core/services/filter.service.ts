import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Filters } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filters: Filters;

  onFiltersUpdate = new Subject<Filters>();

  constructor() { }

  getFilters() {
    this.onFiltersUpdate.next(this.filters);
  }

  setFilters(filters: Filters) {
    this.filters = filters;
    this.getFilters();
  }

}
