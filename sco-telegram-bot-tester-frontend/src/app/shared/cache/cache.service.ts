import { Injectable } from '@angular/core';
import { CacheConstants } from './cache.constants';

@Injectable({
  providedIn: 'root'
})

export class CacheService {

  private reources: Map<string, any>;
  public readonly cacheConstants =  CacheConstants;

  constructor() { 
    this.reources = new Map<string, any>();
  }

  setElement(key: string, element: any) {
    this.reources.set(key, element);
  }

  getElement(key: string) {
    return this.reources.get(key);
  }

  hasElement(key: string) {
    return this.reources.has(key);
  }
}
