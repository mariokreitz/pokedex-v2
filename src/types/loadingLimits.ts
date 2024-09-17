/**
 * Represents a limit of Pokémon that can be loaded.
 *
 * @interface Limit
 *
 * @property {number} gen - The generation of the limit.
 * @property {number} limit - The number of Pokémon to load.
 * @property {boolean} isDefault - Whether this limit is the default limit.
 * @property {boolean} isSelected - Whether this limit is currently selected.
 */
export interface Limit {
  /**
   * The generation of the limit.
   */
  gen: number;
  /**
   * The number of Pokémon to load.
   */
  limit: number;
  /**
   * Whether this limit is the default limit.
   */
  isDefault: boolean;
  /**
   * Whether this limit is currently selected.
   */
  isSelected: boolean;
}
