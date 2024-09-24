import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { SettingsService } from '../../services/settings.service';

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
   * Initializes the HeaderComponent with the necessary services.
   *
   * @param {SearchService} searchService - The search service.
   * @param {SettingsService} settingsService - The settings service.
   */
  constructor(
    private searchService: SearchService,
    private settingsService: SettingsService
  ) {}

  /**
   * Retrieves the currently set language.
   *
   * @return {string} The currently set language.
   */
  get language(): string {
    return this.settingsService.getLanguage();
  }

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

  /**
   * Displays a surprise alert message to the user.
   *
   * @return {void} No return value.
   */
  suprise(): void {
    alert(
      'Hmm... something is wiggling in there! Could be treasure... or just a very hyper Pikachu. You won’t know unless you peek!'
    );
  }
}
