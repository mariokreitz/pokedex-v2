import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Limit } from '../../types/loadingLimits';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly DEFAULT_AUDIO_VOLUME = 0.25;
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
  private readonly DEFAULT_POKEMON_LIMIT =
    this.getLimitByDefaultStatus()!.limit;

  private readonly audioVolume = new BehaviorSubject<number>(
    this.DEFAULT_AUDIO_VOLUME
  );
  private readonly pokemonLimit = new BehaviorSubject<number>(
    this.DEFAULT_POKEMON_LIMIT
  );

  readonly currentAudioVolume = this.audioVolume.asObservable();
  readonly currentPokemonLimit = this.pokemonLimit.asObservable();

  /**
   * Initializes the SettingsService by retrieving the saved values for audio volume and pokemon limit from local storage.
   * If no saved values are found, it uses the default values. It then subscribes to changes in audio volume and pokemon limit.
   */
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
}
