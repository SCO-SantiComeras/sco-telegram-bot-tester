import { cloneDeep } from 'lodash-es';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  getColumnsWithoutActions(displayedColumns: string[]) {
    if (!displayedColumns || displayedColumns && displayedColumns.length == 0) {
      return [];
    }

    const existActions: string = displayedColumns.find(c => c == 'actions');
    if (!existActions) {
      return displayedColumns;
    }

    const indexOf: number = displayedColumns.indexOf(existActions);
    if (indexOf == -1) {
      return displayedColumns;
    }

    const slicedArray: string[] = cloneDeep(displayedColumns);
    slicedArray.splice(indexOf, 1);
    return slicedArray;
  }

}
