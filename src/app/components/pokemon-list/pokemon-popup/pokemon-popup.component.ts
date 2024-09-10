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
  playCry() {
    if (this.cries) {
      if (this.cries.latest) {
        const audio = new Audio(this.cries.latest);
        audio.play();
      } else {
        const audio = new Audio(this.cries.legacy);
        audio.play();
      }
    } else {
      alert('Cry not found');
    }
  }
  closePopup() {
    document.getElementById('overview')?.classList.add('d_none');
  }
  @Input() selectedPokemon: Pokemon | null = null;

  id!: number;
  name!: string;
  imgSrc!: string | null;
  types!: string[];
  description!: string;
  cries?: {
    latest: string;
    legacy: string;
  };

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
          cries,
        } = this.selectedPokemon;
        this.id = id;
        this.name = name;
        this.imgSrc =
          sprites.other.dream_world.front_default ??
          sprites.other['official-artwork'].front_default;
        this.types = types.map(({ type }) => type.name);
        const filteredDescription = flavor_text_entries.filter(
          ({ language }) => language.name === 'en'
        );
        const randomDescription =
          filteredDescription[
            Math.floor(Math.random() * filteredDescription.length)
          ];
        this.description = randomDescription.flavor_text;
        this.cries = cries;
      }
    }
  }
}
