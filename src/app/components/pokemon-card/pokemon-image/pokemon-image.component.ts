import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-image',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-image.component.html',
  styleUrl: './pokemon-image.component.scss',
})
export class PokemonImageComponent implements OnInit {
  @Input() src!: string | null;
  @Input() alt!: string;

  imgSrc!: string;

  /**
   * Initializes the component after Angular has initialized all data-bound properties of the component.
   * Sets the `imgSrc` property to the value of `src` if it is not null or undefined, otherwise sets it to an empty string.
   *
   * @return {void} This function does not return anything.
   */
  ngOnInit(): void {
    this.imgSrc = this.src ?? '';
  }
}
