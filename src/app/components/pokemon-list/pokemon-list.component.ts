import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';
import { SearchService } from '../../services/search.service';
import { PokemonPopupComponent } from './pokemon-popup/pokemon-popup.component';
import { SettingsService } from '../../services/settings.service';

/**
 * A component that displays a list of Pokémon and provides functionality to
 * navigate between them.
 */
@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent, PokemonPopupComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  /**
   * The list of Pokémon to display, filtered based on the current search term.
   */
  displayedPokemons!: Pokemon[];
  /**
   * The complete list of Pokémon, fetched from the API.
   */
  pokemons!: Pokemon[];
  /**
   * The filtered list of Pokémon, used to store the filtered list of Pokémon
   * while the component is initializing.
   */
  filteredPokemons!: Pokemon[];

  /**
   * The currently selected Pokémon, or null if no Pokémon is selected.
   */
  selectedPokemon: Pokemon | null = null;

  /**
   * Initializes the PokemonListComponent with the necessary services.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @param {SearchService} searchService - The service used to handle search functionality.
   */
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly searchService: SearchService,
    private readonly settingsService: SettingsService
  ) {}

  /**
   * Initializes the component by setting up subscriptions to the current Pokémon limit and search term.
   *
   * When the current Pokémon limit changes, it fetches the Pokémon data and filters it based on the current search term.
   *
   * When the search term changes, it filters the Pokémon data based on the new search term.
   *
   * @return {Promise<void>} No return value, initializes the component instead.
   */
  async ngOnInit(): Promise<void> {
    this.settingsService.currentPokemonLimit.subscribe(() => {
      this.pokemonService.getPokemons().then((fetchedPokemons) => {
        this.pokemons = fetchedPokemons;
        this.filterPokemons('');
      });
    });

    this.searchService.currentSearch.subscribe((searchTerm) => {
      this.filterPokemons(searchTerm);
    });
  }

  /**
   * Filters the list of Pokémon based on the provided search term.
   *
   * @param {string} searchTerm - The term to search for in the Pokémon names.
   * @return {void} No return value, modifies the displayedPokemons property instead.
   */
  private filterPokemons(searchTerm: string): void {
    this.displayedPokemons =
      searchTerm.length >= 3
        ? this.pokemons.filter(({ name }) => name.includes(searchTerm))
        : this.pokemons;
  }

  /**
   * Displays the overview of a selected Pokémon.
   *
   * @param {Pokemon} pokemon - The Pokémon to display the overview for.
   * @return {void}
   */
  showPokemonOverview(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
    const overviewElement = document.getElementById('overview');
    if (overviewElement) {
      overviewElement.classList.remove('d_none');
    }
    document.body.classList.add('no-scroll');
  }

  /**
   *  Navigates to the previous Pokémon in the list of displayed Pokémon.
   *
   *  If the currently selected Pokémon is found in the list of displayed Pokémon,
   *  it moves to the previous Pokémon in the list, wrapping around to the end if necessary.
   *
   *  @return {void}
   */
  onPrevClick(): void {
    const currentIndex = this.pokemons.findIndex(
      (pokemon) => pokemon.id === this.selectedPokemon?.id
    );

    const prevIndex =
      (currentIndex - 1 + this.pokemons.length) % this.pokemons.length;

    this.selectedPokemon = this.pokemons[prevIndex];
  }

  /**
   *  Navigates to the next Pokémon in the list of displayed Pokémon.
   *
   *  If the currently selected Pokémon is not found in the list of displayed Pokémon,
   *  it defaults to the first Pokémon in the list. Otherwise, it moves to the next
   *  Pokémon in the list, wrapping around to the start if necessary.
   *
   *  @return {void}
   */
  onNextClick(): void {
    const currentIndex = this.pokemons.findIndex(
      (pokemon) => pokemon.id === this.selectedPokemon?.id
    );

    if (currentIndex === -1) {
      this.selectedPokemon = this.pokemons[0];
    } else {
      const nextIndex = (currentIndex + 1) % this.pokemons.length;
      this.selectedPokemon = this.pokemons[nextIndex];
    }
  }
}
