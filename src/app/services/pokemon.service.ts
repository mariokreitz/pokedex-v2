import { Injectable } from '@angular/core';
import { Pokedex } from 'pokeapi-js-wrapper';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor() {}

  customOptions = {
    cache: true,
    timeout: 5 * 1000,
  };

  pokedex = new Pokedex(this.customOptions);

  interval = {
    offset: 0,
    limit: 151,
  };
  async getPokemons(offset: number = 0) {
    const data = await this.pokedex.getPokemonsList(this.interval);
    const result = data.results;

    const pokemons = await Promise.all(
      result.map(async (pokemon) => {
        const pokemonData = await this.pokedex.getPokemonByName(pokemon.name);
        return pokemonData;
      })
    );

    return pokemons;
  }
}
