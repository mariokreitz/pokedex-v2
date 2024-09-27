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
   * The subject that notifies components of changes to the search term.
   *
   * Components can subscribe to this subject to receive updates to the search term.
   */
  private readonly searchSubject = new BehaviorSubject<string>('');

  /**
   * The current random ID.
   *
   * This is a BehaviorSubject which emits a new random ID whenever it is subscribed to.
   */
  private readonly randomID = new BehaviorSubject<number>(0);

  /**
   * An observable that emits the current search term whenever it changes.
   */
  readonly currentSearch = this.searchSubject.asObservable();

  /**
   * An observable that emits a new random ID whenever it is subscribed to.
   */
  readonly currentRandomID = this.randomID.asObservable();

  /**
   * Updates the current search term.
   *
   * @param {string} searchTerm - The new search term to update the current search with.
   */
  changeSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  /**
   * Updates the current random ID.
   *
   * @param {number} randomID - The new random ID to update the current random ID with.
   */
  changeRandomID(randomID: number): void {
    this.randomID.next(randomID);
  }
}
