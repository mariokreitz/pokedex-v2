import { Injectable } from '@angular/core';
import { Pokedex, PokemonSpecies } from 'pokeapi-js-wrapper';
import { Pokemon } from '../../types/pokedex';
import { SettingsService } from './settings.service';

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
   * Initializes the PokemonService instance.
   *
   * @param {SettingsService} settingsService - The settings service instance.
   */
  constructor(private readonly settingsService: SettingsService) {
    this.setPokemonInterval();
  }

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
  private interval = {
    offset: 0,
    limit: 0,
  };

  /**
   * Sets the current Pokémon interval limit based on the provided limit. */
  private setPokemonInterval() {
    this.settingsService.currentPokemonLimit.subscribe((limit) => {
      this.interval.limit = limit;
    });
  }

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
  private async fetchPokemons(): Promise<Pokemon[]> {
    const response = await this.pokedex.getPokemonsList(this.interval);
    const pokemonList = response.results;
    const pokemonPromises = pokemonList.map(
      async (pokemonData): Promise<Pokemon> => {
        const species = await this.getPokemonSpeciesByNameWithFallback(
          pokemonData.name
        );
        const pokemon = await this.pokedex.getPokemonByName(pokemonData.name);
        const items = await this.pokedex.getItemByName(
          pokemon.held_items.map((items) => items.item.name)
        );

        return { ...pokemon, ...species, items };
      }
    );

    return await Promise.all(pokemonPromises);
  }

  /**
   * Triggers the `fetchPokemons` method and keeps track of the last fetched
   * interval.
   *
   * @returns {Promise<Pokemon[]>} A promise that resolves with an array
   * of Pokemon.
   */
  async getPokemons(): Promise<Pokemon[]> {
    const lastPokemonLimit = this.interval;

    const pokemons = await this.fetchPokemons();

    if (this.interval !== lastPokemonLimit) {
      return this.getPokemons();
    }

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

  /**
   * Retrieves the German name of a Pokémon type based on its English name.
   *
   * @param {string} type - The English name of the Pokémon type.
   *
   * @returns {{ english: string; german: string }} An object containing both the
   * English and German names of the Pokémon type.
   *
   * @example
   * const type = pokemonService.getTypeName('fire');
   * console.log(type.english); // fire
   * console.log(type.german); // Feuer
   */
  getTypeName(type: string): { english: string; german: string } {
    const types = [
      { english: 'normal', german: 'Normal' },
      { english: 'fire', german: 'Feuer' },
      { english: 'water', german: 'Wasser' },
      { english: 'electric', german: 'Elektro' },
      { english: 'grass', german: 'Pflanze' },
      { english: 'flying', german: 'Flug' },
      { english: 'bug', german: 'Käfer' },
      { english: 'poison', german: 'Gift' },
      { english: 'rock', german: 'Gestein' },
      { english: 'ground', german: 'Boden' },
      { english: 'fighting', german: 'Kämpfer' },
      { english: 'ice', german: 'Eis' },
      { english: 'psychic', german: 'Psycho' },
      { english: 'ghost', german: 'Geist' },
      { english: 'dragon', german: 'Drache' },
      { english: 'fairy', german: 'Fee' },
      { english: 'dark', german: 'Unlicht' },
      { english: 'steel', german: 'Stahl' },
    ];

    const typeObject = types.find((t) => t.english === type);

    return typeObject!;
  }
}
