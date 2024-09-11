import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';
import { SearchService } from '../../services/search.service';
import { PokemonPopupComponent } from './pokemon-popup/pokemon-popup.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent, PokemonPopupComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  displayedPokemons!: Pokemon[];
  pokemons!: Pokemon[];
  filteredPokemons!: Pokemon[];

  selectedPokemon: Pokemon | null = null;

  constructor(
    private pokemonService: PokemonService,
    private searchService: SearchService
  ) {}

  async ngOnInit(): Promise<void> {
    this.pokemons = await this.pokemonService.getPokemons();

    this.searchService.currentSearch.subscribe((currentSearchTerm) => {
      const searchTerm = currentSearchTerm;
      if (searchTerm) {
        this.filteredPokemons = this.pokemons.filter((pokemon) =>
          pokemon.name.includes(searchTerm)
        );
        this.displayedPokemons = this.filteredPokemons;
      } else {
        this.displayedPokemons = this.pokemons;
      }
    });
  }

  onPokemonClick(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
    document.getElementById('overview')?.classList.remove('d_none');
    document.body.classList.add('no-scroll');
  }

  onPrevClick() {
    if (this.selectedPokemon) {
      const index = this.displayedPokemons.findIndex(
        (pokemon) => pokemon.id === this.selectedPokemon!.id
      );
      const prevIndex =
        (index - 1 + this.displayedPokemons.length) %
        this.displayedPokemons.length;
      this.selectedPokemon = this.displayedPokemons[prevIndex];
    } else {
      this.selectedPokemon =
        this.displayedPokemons[this.displayedPokemons.length - 1];
    }
  }

  onNextClick() {
    if (this.selectedPokemon) {
      const index = this.displayedPokemons.findIndex(
        (pokemon) => pokemon.id === this.selectedPokemon!.id
      );
      const nextIndex = (index + 1) % this.displayedPokemons.length;
      this.selectedPokemon = this.displayedPokemons[nextIndex];
    } else {
      this.selectedPokemon = this.displayedPokemons[0];
    }
  }
}
