import { Injectable } from '@angular/core';
import { Pokedex, PokemonSpecies } from 'pokeapi-js-wrapper';
import { Pokemon } from '../../types/pokedex';

/**
 * Provides methods to fetch Pokemon data from PokeAPI.
 *
 * @remarks
 * This service is a wrapper around the PokeAPI JavaScript library.
 * It provides methods to fetch a list of Pokemon, as well as individual
 * Pokemon data. It also provides a method to fetch the species data of a
 * Pokemon, which is used to fetch the Pokemon's types.
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  /**
   * The PokeAPI client.
   *
   * @private
   */
  private readonly pokedex = new Pokedex({
    protocol: 'https',
    hostName: 'pokeapi.co',
    versionPath: '/api/v2/',
    timeout: 5 * 1000,
    cache: true,
  });

  /**
   * The interval of Pokemon to fetch.
   *
   * @remarks
   * The Pokemon are fetched in intervals of 151, starting from the
   * beginning of the Pok dex.
   *
   * @private
   */
  interval = {
    offset: 0,
    limit: 151,
  };

  /**
   * Fetches a list of Pokemon.
   *
   * @returns {Promise<Pokemon[]>} A promise that resolves with an array
   * of Pokemon.
   *
   * @example
   * const pokemons = await pokemonService.getPokemons();
   * console.log(pokemons);
   */
  async getPokemons(): Promise<Pokemon[]> {
    const response = await this.pokedex.getPokemonsList(this.interval);
    const result = response.results;
    const pokemons = await Promise.all(
      result.map(async (pokemon) => {
        const species = await this.getPokemonSpeciesByNameWithFallback(
          pokemon.name
        );
        const data = await this.pokedex.getPokemonByName(pokemon.name);
        const items = await this.pokedex.getItemByName(
          data.held_items.map((items) => items.item.name)
        );

        return { ...data, ...species, items };
      })
    );

    return pokemons;
  }

  /**
   * Fetches the species data of a Pokemon.
   *
   * @param {string} name - The name of the Pokemon.
   *
   * @returns {Promise<PokemonSpecies>} A promise that resolves with the
   * species data of the Pokemon. If the Pokemon is not found, it returns the
   * species data of the Pokemon with the same name, but without the
   * generation suffix.
   *
   * @private
   */
  private async getPokemonSpeciesByNameWithFallback(
    name: string
  ): Promise<PokemonSpecies> {
    try {
      return await this.pokedex.getPokemonSpeciesByName(name);
    } catch (error) {
      const baseName = name.split('-')[0];
      return await this.pokedex.getPokemonSpeciesByName(baseName);
    }
  }
}
