import { TitleCasePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PokemonImageComponent } from './pokemon-image/pokemon-image.component';
import { Pokemon } from '../../../types/pokedex';
import { SettingsService } from '../../services/settings.service';

/**
 * A component that displays a Pokémon card.
 *
 * @example
 * <app-pokemon-card [Pokemon]="pokemon"></app-pokemon-card>
 *
 * @prop {Pokemon} Pokemon - The Pokémon to display.
 *
 * @templateContext
 * @prop {number} id - The ID of the Pokémon.
 * @prop {string} name - The name of the Pokémon.
 * @prop {string | null} imgSrc - The URL of the Pokémon's image, or null if no image is available.
 * @prop {string[]} types - An array of Pokémon type names.
 */
@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe, PokemonImageComponent],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  constructor(private settingsService: SettingsService) {}
  /**
   * The Pokémon to display in the card.
   *
   * @prop
   * @type {Pokemon}
   */
  @Input() Pokemon!: Pokemon;

  /**
   * Retrieves the ID of the Pokémon.
   *
   * @returns {number} The ID of the Pokémon.
   */
  get id(): number {
    return this.Pokemon.id;
  }

  /**
   * Retrieves the name of the Pokémon in the current language.
   *
   * If the Pokémon has a name in the current language, that name is returned.
   * Otherwise, the Pokémon's default name is returned.
   *
   * @return {string} The name of the Pokémon in the current language, or the default name if no translation is available.
   */
  get name(): string {
    return (
      this.Pokemon.names.find(
        (name) => name.language.name === this.settingsService.getLanguage()
      )?.name || this.Pokemon.name
    );
  }

  /**
   * Retrieves the image source URL for the Pokémon.
   *
   * @returns {string | null} The URL of the Pokémon's image, or null if no image is available.
   */
  get imgSrc(): string | null {
    return (
      this.Pokemon.sprites.other?.dream_world?.front_default ||
      this.Pokemon.sprites.other?.['official-artwork']?.front_default
    );
  }

  /**
   * Retrieves the types of the Pokémon.
   *
   * @returns {string[]} An array of Pokémon type names.
   */
  get types(): string[] {
    return this.Pokemon.types.map(({ type }) => type.name);
  }
}
