import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../types/pokedex';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { PokemonImageComponent } from '../pokemon-image/pokemon-image.component';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe, PokemonImageComponent],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
})
export class PokemonCardComponent {
  id!: number;
  name!: string;
  imgSrc!: string | null;
  types!: string[];

  constructor() {}

  @Input()
  Pokemon!: Pokemon;

  ngOnInit(): void {
    const { id, name, sprites, types } = this.Pokemon;

    this.id = id;
    this.name = name;
    this.imgSrc =
      sprites.other.dream_world.front_default ??
      sprites.other['official-artwork'].front_default;

    this.types = types.map(({ type }) => type.name);
  }
}
