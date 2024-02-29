import { cloneDeep } from 'lodash-es';
import { Injectable } from '@angular/core';
import { TranslateService } from '../translate/translate.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private readonly translateService: TranslateService) { }

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

  changePaginatorOfLabel() {
    return (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} ${this.translateService.getTranslate('label.of')} ${Number.parseInt(length.toString())}`;
    }
  }
}
