import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly searchSubject = new BehaviorSubject<string>('');

  readonly currentSearch = this.searchSubject.asObservable();

  /**
   * Updates the current search term.
   *
   * @param {string} searchTerm - The new search term to update the current search with.
   * @return {void} No return value.
   */
  changeSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
