import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Pokemon } from '../../../../types/pokedex';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-popup',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe],
  templateUrl: './pokemon-popup.component.html',
  styleUrl: './pokemon-popup.component.scss',
})
export class PokemonPopupComponent implements OnInit {
  closePopup() {
    document.getElementById('overview')?.classList.add('d_none');
  }
  @Input() selectedPokemon: Pokemon | null = null;

  id!: number;
  name!: string;
  imgSrc!: string | null;
  types!: string[];
  description!: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPokemon']) {
      if (this.selectedPokemon) {
        const {
          abilities,
          flavor_text_entries,
          game_indices,
          height,
          held_items,
          id,
          moves,
          name,
          names,
          order,
          species,
          sprites,
          stats,
          types,
          weight,
        } = this.selectedPokemon;
        this.id = id;
        this.name = name;
        this.imgSrc =
          sprites.other.dream_world.front_default ??
          sprites.other['official-artwork'].front_default;
        this.types = types.map(({ type }) => type.name);
        this.description = flavor_text_entries[0].flavor_text;
      }
    }
  }
}
