import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Provides a way to notify components of changes to the current search term.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  /**
   * The current search term.
   */
  private readonly searchSubject = new BehaviorSubject<string>('');

  /**
   * An observable that emits the current search term whenever it changes.
   */
  readonly currentSearch = this.searchSubject.asObservable();

  /**
   * Updates the current search term.
   *
   * @param {string} searchTerm - The new search term to update the current search with.
   */
  changeSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
}
