import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';
import { SearchService } from '../../services/search.service';
import { PokemonPopupComponent } from './pokemon-popup/pokemon-popup.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent, PokemonPopupComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  displayedPokemons!: Pokemon[];
  pokemons!: Pokemon[];
  filteredPokemons!: Pokemon[];

  selectedPokemon: Pokemon | null = null;

  /**
   * Initializes the PokemonListComponent with the necessary services.
   *
   * @param {PokemonService} pokemonService - The service used to fetch Pokémon data.
   * @param {SearchService} searchService - The service used to handle search functionality.
   */
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly searchService: SearchService
  ) {}

  /**
   * Initializes the component by fetching the list of pokemons and setting up the search subscription.
   *
   * @return {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async ngOnInit(): Promise<void> {
    this.pokemons = await this.pokemonService.getPokemons();

    this.searchService.currentSearch.subscribe((searchTerm) => {
      this.displayedPokemons = searchTerm
        ? this.pokemons.filter(({ name }) => name.includes(searchTerm))
        : this.pokemons;
    });
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
    const currentIndex = this.displayedPokemons.findIndex(
      (pokemon) => pokemon.id === this.selectedPokemon?.id
    );

    const prevIndex =
      (currentIndex - 1 + this.displayedPokemons.length) %
      this.displayedPokemons.length;

    this.selectedPokemon = this.displayedPokemons[prevIndex];
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
    const currentIndex = this.displayedPokemons.findIndex(
      (pokemon) => pokemon.id === this.selectedPokemon?.id
    );

    if (currentIndex === -1) {
      this.selectedPokemon = this.displayedPokemons[0];
    } else {
      const nextIndex = (currentIndex + 1) % this.displayedPokemons.length;
      this.selectedPokemon = this.displayedPokemons[nextIndex];
    }
  }
}
