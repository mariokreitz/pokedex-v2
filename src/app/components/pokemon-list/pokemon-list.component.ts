import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  displayedPokemons!: Pokemon[];
  pokemons!: Pokemon[];
  filteredPokemons!: Pokemon[];

  constructor(
    private pokemonService: PokemonService,
    private sharedService: SharedService
  ) {}

  async ngOnInit(): Promise<void> {
    this.pokemons = await this.pokemonService.getPokemons();
    console.log(this.pokemons);

    this.sharedService.currentSearch.subscribe((currentSearchTerm) => {
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
}
