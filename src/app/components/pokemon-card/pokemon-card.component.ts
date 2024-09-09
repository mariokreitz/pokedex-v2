import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../types/pokedex';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
})
export class PokemonCardComponent {
  name!: string;
  imgSrc!: string | null;

  constructor() {}

  @Input()
  Pokemon!: Pokemon;

  ngOnInit() {
    this.name = this.Pokemon.name;
    this.imgSrc = this.Pokemon.sprites.other.dream_world.front_default;
  }
}
