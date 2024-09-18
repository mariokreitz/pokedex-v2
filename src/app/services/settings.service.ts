import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Limit } from '../../types/loadingLimits';

/**
 * Provides methods to manage the application settings, such as the audio volume and the
 * Pokémon limit.
 *
 * @remarks
 * This service is a singleton, which means that it is only instantiated once and can be
 * injected into any component or service that needs to access the application settings.
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  /**
   * The default audio volume, ranging from 0 to 1.
   */
  private readonly DEFAULT_AUDIO_VOLUME = 0.25;

  /**
   * An array of objects containing the generation and limit of Pokémon.
   */
  private readonly POKEMON_LIMITS: Limit[] = [
    { gen: 1, limit: 151, isDefault: true, isSelected: true },
    { gen: 2, limit: 251, isDefault: false, isSelected: false },
    { gen: 3, limit: 386, isDefault: false, isSelected: false },
    { gen: 4, limit: 493, isDefault: false, isSelected: false },
    { gen: 5, limit: 649, isDefault: false, isSelected: false },
    { gen: 6, limit: 721, isDefault: false, isSelected: false },
    { gen: 7, limit: 809, isDefault: false, isSelected: false },
    { gen: 8, limit: 905, isDefault: false, isSelected: false },
    { gen: 9, limit: 1025, isDefault: false, isSelected: false },
  ];

  /**
   * The default Pokémon limit, which is the limit of the first generation.
   */
  private readonly DEFAULT_POKEMON_LIMIT =
    this.getLimitByDefaultStatus()!.limit;

  /**
   * A subject that emits the current audio volume whenever it changes.
   */
  private readonly audioVolume = new BehaviorSubject<number>(
    this.DEFAULT_AUDIO_VOLUME
  );

  /**
   * A subject that emits the current Pokémon limit whenever it changes.
   */
  private readonly pokemonLimit = new BehaviorSubject<number>(
    this.DEFAULT_POKEMON_LIMIT
  );

  /**
   * A subject that emits the current language whenever it changes.
   */
  private readonly language = new BehaviorSubject<string>('en');

  /**
   * An observable that emits the current audio volume whenever it changes.
   */
  readonly currentAudioVolume = this.audioVolume.asObservable();

  /**
   * An observable that emits the current Pokémon limit whenever it changes.
   */
  readonly currentPokemonLimit = this.pokemonLimit.asObservable();

  /**
   * An observable that emits the current language whenever it changes.
   */
  readonly currentLanguage = this.language.asObservable();

  constructor() {
    const savedLimit = localStorage.getItem('pokemonLimit');
    const defaultLimit = this.getLimitByDefaultStatus();
    const initialLimit = savedLimit
      ? JSON.parse(savedLimit).limit
      : defaultLimit!.limit;
    this.pokemonLimit.next(initialLimit);

    const savedVolume = localStorage.getItem('audioVolume');
    const initialVolume = savedVolume
      ? parseFloat(savedVolume)
      : this.DEFAULT_AUDIO_VOLUME;
    this.audioVolume.next(initialVolume);

    this.subscribeToAudioVolumeChanges();
    this.subscribeToPokemonLimitChanges();
  }

  /**
   * Retrieves the default limit from the list of available limits.
   *
   * @return {Limit | undefined} The default limit, or undefined if no default limit is found.
   */
  private getLimitByDefaultStatus(): Limit | undefined {
    return this.POKEMON_LIMITS.find((limit) => limit.isDefault);
  }

  /**
   * Subscribes to changes in the audio volume and updates the local storage.
   *
   * @return {void}
   */
  private subscribeToAudioVolumeChanges(): void {
    this.audioVolume.subscribe((volume) =>
      localStorage.setItem('audioVolume', volume.toString())
    );
  }

  /**
   * Subscribes to changes in the pokemon limit and updates the selected limit.
   *
   * When the pokemon limit changes, this function finds the corresponding limit
   * in the POKEMON_LIMITS array and sets its isSelected property to true. It
   * then updates the localStorage with the new limit and its isSelected status.
   *
   * @return {void}
   */
  private subscribeToPokemonLimitChanges(): void {
    this.pokemonLimit.subscribe((limit) => {
      const selectedLimit = this.POKEMON_LIMITS.find(
        (limitItem) => limitItem.limit === limit
      );
      if (selectedLimit) {
        selectedLimit.isSelected = true;
        localStorage.setItem(
          'pokemonLimit',
          JSON.stringify({ limit, isSelected: selectedLimit.isSelected })
        );
      }
    });
  }

  /**
   * Sets the current audio volume.
   *
   * @param {number} volume - The new audio volume, ranging from 0 to 1.
   * @return {void} No return value.
   */
  setAudioVolume(volume: number): void {
    this.audioVolume.next(volume);
  }

  /**
   * Retrieves the current audio volume.
   *
   * @return {number} The current audio volume, ranging from 0 to 1.
   */
  getAudioVolume(): number {
    return this.audioVolume.getValue();
  }

  /**
   * Sets the current Pokémon limit.
   *
   * @param {Limit} limit - The new Pokémon limit, which contains the generation and limit of Pokémon.
   * @return {void} No return value.
   */
  setPokemonLimit(limit: Limit): void {
    this.POKEMON_LIMITS.forEach(
      (l) => (l.isSelected = l.limit === limit.limit)
    );
    this.pokemonLimit.next(limit.limit);
  }

  /**
   * Retrieves the current Pokémon limit.
   *
   * @return {number} The current Pokémon limit.
   */
  getPokemonLimit(): number {
    return this.pokemonLimit.getValue();
  }

  /**
   * Retrieves a list of Pokémon limits.
   *
   * @return {Limit[]} An array of objects containing the generation and limit of Pokémon.
   */
  getLimits(): Limit[] {
    return this.POKEMON_LIMITS;
  }

  /**
   * Sets the current language.
   *
   * @param {string} language - The new language to be set.
   * @return {void} No return value.
   */
  setLanguage(language: string) {
    this.language.next(language);
  }
}
