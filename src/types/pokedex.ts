/**
 * Represents a Pokémon.
 *
 * @interface Pokemon
 */
export interface Pokemon {
  /**
   * The unique identifier for this Pokémon.
   */
  id: number;
  /**
   * The name of this Pokémon.
   */
  name: string;
  /**
   * A list of names for this Pokémon in different languages.
   */
  names: {
    /**
     * The name of this Pokémon in this language.
     */
    name: string;
    /**
     * The language this name is in.
     */
    language: {
      /**
       * The name of the language.
       */
      name: string;
      /**
       * The URL of the language resource.
       */
      url: string;
    };
  }[];
  /**
   * The order in which this Pokémon is listed in the Pokédex.
   */
  order: number;
  /**
   * The height of this Pokémon in decimeters (1/10 of a meter).
   */
  height: number;
  /**
   * The sprites for this Pokémon.
   */
  sprites: {
    /**
     * The default sprite for this Pokémon.
     */
    front_default: string | null;
    /**
     * Other sprites for this Pokémon.
     */
    other: {
      /**
       * The sprite for this Pokémon in the Dream World.
       */
      dream_world: {
        front_default: string | null;
      };
      /**
       * The sprite for this Pokémon in the official artwork style.
       */
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  /**
   * The abilities this Pokémon has.
   */
  abilities: {
    /**
     * The ability this Pokémon has.
     */
    ability: {
      /**
       * The name of the ability.
       */
      name: string;
      /**
       * The URL of the ability resource.
       */
      url: string;
    };
    /**
     * Whether this ability is hidden (i.e. not obtainable through normal means).
     */
    is_hidden: boolean;
    /**
     * The slot this ability is in.
     */
    slot: number;
  }[];
  /**
   * The game indices for this Pokémon.
   */
  game_indices: {
    /**
     * The index of this Pokémon in the given game.
     */
    game_index: number;
    /**
     * The game this index is for.
     */
    version: {
      /**
       * The name of the game.
       */
      name: string;
      /**
       * The URL of the game resource.
       */
      url: string;
    };
  }[];
  /**
   * The items this Pokémon can hold.
   */
  held_items: {
    /**
     * The item this Pokémon can hold.
     */
    item: {
      /**
       * The name of the item.
       */
      name: string;
      /**
       * The URL of the item resource.
       */
      url: string;
    };
    /**
     * The version details for this item.
     */
    version_details: {
      /**
       * The rarity of this item in the given version.
       */
      rarity: number;
      /**
       * The version this item is for.
       */
      version: {
        /**
         * The name of the version.
         */
        name: string;
        /**
         * The URL of the version resource.
         */
        url: string;
      };
    }[];
  }[];
  /**
   * The flavor text entries for this Pokémon.
   */
  flavor_text_entries: {
    /**
     * The flavor text.
     */
    flavor_text: string;
    /**
     * The language this flavor text is in.
     */
    language: {
      /**
       * The name of the language.
       */
      name: string;
      /**
       * The URL of the language resource.
       */
      url: string;
    };
    /**
     * The version this flavor text is for.
     */
    version: {
      /**
       * The name of the version.
       */
      name: string;
      /**
       * The URL of the version resource.
       */
      url: string;
    };
  }[];
  /**
   * The moves this Pokémon can learn.
   */
  moves: {
    /**
     * The move this Pokémon can learn.
     */
    move: {
      /**
       * The name of the move.
       */
      name: string;
      /**
       * The URL of the move resource.
       */
      url: string;
    };
    /**
     * The version group details for this move.
     */
    version_group_details: {
      /**
       * The level this Pokémon learns the move at.
       */
      level_learned_at: number;
      /**
       * The method by which this Pokémon learns the move.
       */
      move_learn_method: {
        /**
         * The name of the method.
         */
        name: string;
        /**
         * The URL of the method resource.
         */
        url: string;
      };
      /**
       * The version group this move is for.
       */
      version_group: {
        /**
         * The name of the version group.
         */
        name: string;
        /**
         * The URL of the version group resource.
         */
        url: string;
      };
    }[];
  }[];
  /**
   * The species this Pokémon belongs to.
   */
  species: {
    /**
     * The name of the species.
     */
    name: string;
    /**
     * The URL of the species resource.
     */
    url: string;
  };
  /**
   * The stats for this Pokémon.
   */
  stats: {
    /**
     * The base stat for this stat.
     */
    base_stat: number;
    /**
     * The effort points earned for this stat when this Pokémon is defeated in battle.
     */
    effort: number;
    /**
     * The stat this is for.
     */
    stat: {
      /**
       * The name of the stat.
       */
      name: string;
      /**
       * The URL of the stat resource.
       */
      url: string;
    };
  }[];
  /**
   * The types this Pokémon has.
   */
  types: {
    /**
     * The slot this type is in.
     */
    slot: number;
    /**
     * The type this Pokémon has.
     */
    type: {
      /**
       * The name of the type.
       */
      name: string;
      /**
       * The URL of the type resource.
       */
      url: string;
    };
  }[];
  /**
   * The weight of this Pokémon in hectograms (1/10 of a kilogram).
   */
  weight: number;
  /**
   * The cries of this Pokémon.
   */
  cries?: {
    /**
     * The latest cry of this Pokémon.
     */
    latest: string;
    /**
     * The legacy cry of this Pokémon.
     */
    legacy: string;
  };
  /**
   * The items this Pokémon can have.
   */
  items?: {
    /**
     * The name of the item.
     */
    name: string;
    /**
     * The sprite for this item.
     */
    sprites: {
      /**
       * The default sprite for this item.
       */
      default: string | null;
    };
  };
}
