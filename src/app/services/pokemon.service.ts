import { Injectable } from '@angular/core';
import { Pokedex, PokemonSpecies } from 'pokeapi-js-wrapper';
import { Pokemon } from '../../types/pokedex';

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

  /**
   * Retrieves a list of Pokémon with their corresponding species and items.
   *
   * @return {Promise<Pokemon[]>} A promise that resolves to an array of Pokémon objects.
   */
  async getPokemons(): Promise<Pokemon[]> {
    const listResponse = await this.pokedex.getPokemonsList(this.interval);
    const pokemonNames = listResponse.results;

    const pokemons = await Promise.all(
      pokemonNames.map(async (pokemon) => {
        const species = await this.getPokemonSpeciesByNameWithFallback(
          pokemon.name
        );

        const data = await this.pokedex.getPokemonByName(pokemon.name);

        const itemNames = data.held_items.map((item) => item.item.name);
        const items = await this.pokedex.getItemByName(itemNames);

        return { ...data, ...species, items };
      })
    );

    return pokemons;
  }

  /**
   * Retrieves a Pokémon species by name, falling back to the base name if the original name fails.
   *
   * @param {string} name - The name of the Pokémon species to retrieve.
   * @return {Promise<PokemonSpecies>} A promise that resolves to the Pokémon species object.
   */
  private async getPokemonSpeciesByNameWithFallback(
    name: string
  ): Promise<PokemonSpecies> {
    let species: PokemonSpecies;

    try {
      species = await this.pokedex.getPokemonSpeciesByName(name);
    } catch (error) {
      const baseName = name.split('-')[0];
      species = await this.pokedex.getPokemonSpeciesByName(baseName);
    }

    return species;
  }
}
