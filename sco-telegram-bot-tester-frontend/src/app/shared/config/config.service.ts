import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { has, get, cloneDeep } from 'lodash-es';
import { ConfigConstants } from './config.constants';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  private _data: any;
  public readonly configConstants = ConfigConstants;

  constructor(private readonly http: HttpClient) {}
  
  getDataFromJson(pathJSON: string) {
    return new Promise((resolve, reject) => {
      this.http.get(pathJSON).subscribe({
        next: (data) => {
          this._data = data;
          resolve(true);
        },
        error: (error) => {
          reject(true);
        }
      })
    });
  }

  getData(path: string) {
    if (has(this._data, path)) {
      return get(this._data, path);
    }

    return null;
  }

  getAllData() {
    return cloneDeep(this._data);
  }
}
