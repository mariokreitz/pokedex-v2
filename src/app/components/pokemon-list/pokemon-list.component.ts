import { Component, OnInit } from '@angular/core';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../../types/pokedex';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit {
  pokemons!: Pokemon[];
  constructor(private pokemonService: PokemonService) {}

  async ngOnInit() {
    this.pokemons = await this.pokemonService.getPokemons();
  }
}
