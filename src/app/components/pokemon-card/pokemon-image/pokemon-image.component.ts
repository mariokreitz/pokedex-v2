import { Component, Input } from '@angular/core';

/**
 * Displays an image of a Pokémon.
 */
@Component({
  selector: 'app-pokemon-image',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-image.component.html',
  styleUrls: ['./pokemon-image.component.scss'],
})
export class PokemonImageComponent {
  /**
   * The URL of the Pokémon image to display.
   */
  @Input() src!: string | null;

  /**
   * The alternative text for the image.
   */
  @Input() alt!: string;

  /**
   * The URL of the image to display, or an empty string if `src` is null or undefined.
   */
  get imgSrc(): string {
    return this.src ?? '';
  }
}
