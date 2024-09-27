import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';
import { SearchService } from '../../services/search.service';
import { PokemonPopupComponent } from './pokemon-popup/pokemon-popup.component';
import { SettingsService } from '../../services/settings.service';
import { LoadingComponent } from './loading/loading.component';
import { LoadingBigComponent } from './loading-big/loading-big.component';

/**
 * A component that displays a list of Pokémon and provides functionality to
 * navigate between them.
 */
@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    PokemonCardComponent,
    PokemonPopupComponent,
    LoadingComponent,
    LoadingBigComponent,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  /**
   * Whether the Pokémon's cry is currently playing.
   */
  private isAudioPlaying = false;

  /**
   * Returns the current language setting.
   *
   * @return {string} The current language setting.
   */

  get language(): string {
    return this.settingsService.getLanguage();
  }

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
   * @param {SettingsService} settingsService - The service used to handle settings.
   *
   */
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly searchService: SearchService,
    private readonly settingsService: SettingsService
  ) {
    document.addEventListener('keydown', (event) => this.handleKeydown(event));
  }

  /**
   * Initializes the component by setting up subscriptions to the Pokémon limit and search term.
   * When the Pokémon limit changes, it fetches the list of Pokémon and filters them.
   * When the search term changes, it filters the list of Pokémon based on the search term.
   *
   * @return {Promise<void>} No return value, initializes the component instead.
   */
  async ngOnInit(): Promise<void> {
    document.body.classList.remove('no-scroll');
    this.settingsService.currentPokemonLimit.subscribe(() => {
      this.pokemonService.getPokemons().then((fetchedPokemons) => {
        this.pokemons = fetchedPokemons;
        this.searchService.currentRandomID.subscribe((id) => {
          if (id !== null) this.getRandomPokemon(id);
        });

        this.filterPokemonsBySearchTerm('');
      });
    });

    this.searchService.currentSearch.subscribe((searchTerm) => {
      this.filterPokemonsBySearchTerm(searchTerm);
    });
  }

  /**
   * Filters the list of Pokémon based on the provided search term.
   *
   * If the search term is at least 3 characters long, it filters the Pokémon by name
   * and then by the name in the selected language. Otherwise, it displays all Pokémon.
   *
   * @param {string} searchTerm - The term to search for in the Pokémon names.
   * @return {void} No return value, modifies the displayedPokemons property instead.
   */
  private filterPokemonsBySearchTerm(searchTerm: string): void {
    const minSearchTermLength = 3;
    const shouldFilterBySearchTerm = searchTerm.length >= minSearchTermLength;

    const selectedLanguage = this.settingsService.getLanguage();

    if (shouldFilterBySearchTerm) {
      this.displayedPokemons = this.pokemons.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const germanPokemons = this.pokemons.filter(({ names }) =>
        names.some(
          ({ language: { name: languageName }, name: pokemonName }) =>
            languageName === selectedLanguage &&
            pokemonName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      this.displayedPokemons = germanPokemons;
    } else {
      this.displayedPokemons = this.pokemons;
    }
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
   * Retrieves a random Pokémon from the list of Pokémon and plays its cry and reveals it.
   *
   * @param {number} id - The index of the random Pokémon to retrieve.
   * @return {void} No return value, plays the Pokémon's cry and reveals it instead.
   */
  getRandomPokemon(id: number): void {
    const randomPokemon = this.pokemons[id];
    this.playCryFromRandomPokemon(randomPokemon);
    this.revealRandomPokemon(randomPokemon);
  }

  /**
   * Plays the cry of a random Pokémon.
   *
   * @param {Pokemon} randomPokemon - The Pokémon whose cry will be played.
   * @return {void}
   */
  private playCryFromRandomPokemon(randomPokemon: Pokemon): void {
    const pokeball = './assets/pokeball.png';
    const pokeballImg = document.querySelector<HTMLImageElement>('.pokeball');
    if (!pokeballImg) return;

    const isIos = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

    const { latest: latestCry, legacy: legacyCry } = randomPokemon.cries || {};
    const cryUrl = latestCry || legacyCry;

    if (!cryUrl) return;
    if (cryUrl.includes('.ogg') && isIos) {
      alert(
        this.language === 'en'
          ? 'Cry not available on iOS'
          : 'Audio nicht verfügbar auf iOS'
      );
    }

    const audio = new Audio(cryUrl);
    audio.volume = this.settingsService.getAudioVolume();

    if (!this.isAudioPlaying) {
      this.isAudioPlaying = true;
      pokeballImg.style.cursor = 'not-allowed';
      audio.play();
    }

    audio.addEventListener('ended', () => {
      this.isAudioPlaying = false;
      pokeballImg.style.cursor = 'pointer';
      pokeballImg.src = pokeball;
      this.showPokemonOverview(randomPokemon);
    });
  }

  /**
   * Reveals a random Pokémon by updating the pokeball image source to the Pokémon's sprite.
   *
   * @param {Pokemon} randomPokemon - The Pokémon to be revealed.
   * @return {void} No return value.
   */
  revealRandomPokemon(randomPokemon: Pokemon): void {
    const pokeballImg = document.querySelector<HTMLImageElement>('.pokeball');
    if (!pokeballImg) return;

    const sprite = randomPokemon.sprites.other.dream_world.front_default;
    pokeballImg.src = sprite!;
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

  /**
   * Returns the value of the isLoading property from the settings service.
   *
   * @return {boolean} The value of the isLoading property.
   */
  get isLoading(): boolean {
    return this.settingsService.getIsLoading();
  }

  /**
   * Handles keyboard events to navigate through Pokémon.
   *
   *  This function checks if the 'overview' element is present and visible on the page.
   *  If it is, the function listens for 'ArrowLeft' and 'ArrowRight' key presses to navigate to the previous or next Pokémon respectively.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by the user.
   * @return {void}
   */
  handleKeydown(event: KeyboardEvent): void {
    const overviewElement = document.getElementById('overview');

    if (!overviewElement) return;
    if (overviewElement.classList.contains('d_none')) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.onPrevClick();
        break;
      case 'ArrowRight':
        this.onNextClick();
        break;
    }
  }
}
