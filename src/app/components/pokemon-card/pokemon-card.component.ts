import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../types/pokedex';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { PokemonImageComponent } from './pokemon-image/pokemon-image.component';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe, PokemonImageComponent],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  @Input() Pokemon!: Pokemon;

  /**
   * Retrieves the ID of the Pokémon.
   *
   * @return {number} The ID of the Pokémon.
   */
  get id(): number {
    return this.Pokemon.id;
  }

  /**
   * Returns the name of the Pokemon.
   *
   * @return {string} The name of the Pokemon.
   */
  get name(): string {
    return this.Pokemon.name;
  }

  /**
   * Retrieves the image source URL for the Pokémon.
   *
   * @return {string | null} The URL of the Pokémon's image, or null if no image is available.
   */
  get imgSrc(): string | null {
    return (
      this.Pokemon.sprites.other.dream_world.front_default ??
      this.Pokemon.sprites.other['official-artwork'].front_default
    );
  }

  /**
   * Returns a list of Pokémon types.
   *
   * @return {string[]} An array of Pokémon type names.
   */
  get types(): string[] {
    return this.Pokemon.types.map(({ type }) => type.name);
  }
}
