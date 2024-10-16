import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { SettingsService } from '../../services/settings.service';
import { PokemonService } from '../../services/pokemon.service';

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
  // Text for the search input
  searchPlaceholders: { [key: string]: string } = {
    en: 'Search...',
    de: 'Suche...',
    pt: 'Buscar...',
  };

  /**
   * Initializes the HeaderComponent with the necessary services.
   *
   * @param {SearchService} searchService - The service used to handle search functionality.
   * @param {SettingsService} settingsService - The service used to handle application settings.
   *
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
   * Retrieves a random Pokémon ID within the current Pokémon limit and updates the search service with the new ID.
   *
   * @return {void}
   */
  getRandomPokemon(): void {
    const randomId = Math.floor(
      Math.random() * this.settingsService.getPokemonLimit()
    );

    this.searchService.changeRandomID(randomId);
  }
}
