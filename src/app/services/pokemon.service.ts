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
    // limit: 1025,
  };
  async getPokemons(offset: number = 0) {
    const pokemonListResponse = await this.pokedex.getPokemonsList(
      this.interval
    );
    const pokemonNames = pokemonListResponse.results;

    const pokemons = await Promise.all(
      pokemonNames.map(async (pokemonName) => {
        const pokemonSpecies = await this.getPokemonSpeciesByNameWithFallback(
          pokemonName.name
        );

        const pokemonData = await this.pokedex.getPokemonByName(
          pokemonName.name
        );

        const pokemonItemNames = pokemonData.held_items.map(
          (item) => item.item.name
        );
        const pokemonItems = await this.pokedex.getItemByName(pokemonItemNames);

        return { ...pokemonData, ...pokemonSpecies, items: pokemonItems };
      })
    );

    return pokemons;
  }

  private async getPokemonSpeciesByNameWithFallback(pokemonName: string) {
    try {
      return await this.pokedex.getPokemonSpeciesByName(pokemonName);
    } catch {
      const pokemonBaseName = pokemonName.split('-')[0];
      return await this.pokedex.getPokemonSpeciesByName(pokemonBaseName);
    }
  }
}
