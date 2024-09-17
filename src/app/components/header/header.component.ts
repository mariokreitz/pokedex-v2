import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

/**
 * The header component.
 *
 * This component displays the header of the application, which includes a search bar and a
 * button to toggle the UI settings.
 *
 * @example <app-header></app-header>
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /**
   * Constructor.
   *
   * @param {SearchService} searchService - The search service.
   */
  constructor(private searchService: SearchService) {}

  /**
   * Handles search bar input change.
   *
   * @param {string} searchTerm - The search term.
   */
  handleSearchInputChange(searchTerm: string): void {
    this.searchService.changeSearch(searchTerm);
  }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {}
}
