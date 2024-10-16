# ![Pokedex](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png) Pokedex-v2 [![Version](https://img.shields.io/github/v/release/mariokreitz/pokedex-v2.svg)](https://github.com/mariokreitz/pokedex-v2/releases) [![Build Status](https://github.com/mariokreitz/pokedex-v2/actions/workflows/main.yml/badge.svg)](https://github.com/mariokreitz/pokedex-v2/actions/workflows/main.yml) [![License](https://img.shields.io/github/license/mariokreitz/pokedex-v2.svg)](LICENSE)

Welcome to **Pokedex-v2**! 🎉 This project is a cutting-edge version of the classic Pokémon Pokedex, now officially released as **version 2.3.0**. It is powered by Angular 17 and the new `pokeapi-js-wrapper`, designed to provide an even more enhanced user experience with a range of exciting features.

## Demo 🎥

Check out our live demo here: [Pokedex-v2 Live Demo](https://pokedex.mario-kreitz.dev/)

## Screenshot 📸

![Pokedex Screenshot](https://raw.githubusercontent.com/mariokreitz/pokedex-v2/refs/heads/main/src/assets/screenshot.png) <!-- Replace with actual URL -->

## Features ✨

- **Caching**: 🗃️ Efficiently cache Pokémon data to reduce loading times and enhance performance.
- **On-Demand Data Fetching**: 📈 Retrieve more Pokémon data as needed, keeping the app responsive and up-to-date.
- **PokéStats Visualization**: 📊 Visualize Pokémon stats with interactive charts using ChartJS.
- **Detailed Pokémon Information**: 📜 Get comprehensive details such as held items, availability by edition, and more!
- **Angular 17**: 🚀 Built with the latest version of Angular for improved performance and developer experience.
- **pokeapi-js-wrapper**: 🔌 Seamlessly integrated with `pokeapi-js-wrapper` for more flexible and powerful API interactions.
- **Localization**: 🌐 Available in English (default), German, Portuguese, and now Spanish!

## New in Version 2.3.0 🚀

### ✨ New Features:

- 🌐 **Language Dropdown Selector**: The language switch is now a dropdown, making it easier and more intuitive to switch between languages.
- 🇪🇸 **Spanish Language Support**: Added Spanish as a supported language. If Portuguese translations are unavailable via the API, Spanish will now appear in those description fields.
- 🗣️ **Fourth Language Support**: Enhanced the language system to allow for the easy addition of a fourth language, making future language expansions seamless.

## New in Version 2.2.0 🚀

### ✨ New Features:

- 🔄 **Lazy Loading**: Implemented lazy loading to enhance performance, with a default data fetch timeout of 10,000ms.
- ⚙️ **Pokémon Limit Settings**: The `setPokemonLimit()` function now automatically closes the settings menu upon confirmation for a smoother user experience.
- ⌨️ **Keyboard Navigation**: Added keyboard support for navigation and tab control within the popup card, improving accessibility.
- 🎉 **Pokéball Secret Feature**: A hidden feature where a random Pokémon appears with an autoplay cry when the Pokéball is clicked in the popup, adding an element of surprise!
- ⚠️ **Danger Zone Confirmation**: Standard confirmation alerts replaced with a custom danger zone window for Pokémon limit changes, providing a more cohesive user interface.
- 🇩🇪 **German Localization**: Added missing German translations in the Editions tab to enhance localization.

### 🚀 Improvements:

- 📜 **Credits Page**: Created a dedicated credits page acknowledging contributors and sources, including background music.
- 🔗 **Routing System**: Refactored the routing system for more efficient navigation across the app.
- ⏳ **Loading Animation**: Improved the visibility of the loading animation at the bottom of the page for a better user experience during data fetching.
- 📝 **JSDoc Updates**: Updated JSDoc comments to reflect recent changes and improve code documentation.

### 🛠️ Bug Fixes:

- ⚠️ **Duplicate Item Names**: Resolved an issue with duplicated item names and tooltips for clarity and accuracy in the UI.
- 🌐 **English-German Translations**: Fixed incorrect translations between English and German for a consistent user experience.
- 🚫 **Overflow Bug**: Corrected a bug causing `overflow:hidden` to improperly hide content and removed leftover debug console.log entries for cleaner code.
- 🔄 **Generation 1 Limit Bug**: Fixed a bug where the Gen 1 Pokémon limit was incorrectly selected after a page refresh, ensuring accurate data loading.

## 📖 **Documentation** ![Documentation](https://img.shields.io/badge/Documentation-97%25-brightgreen)

We now have detailed documentation available to help you understand and use **Pokedex-v2** effectively. You can access it here:

➡️ [**Pokedex-v2 Documentation**](https://pokedex.mario-kreitz.dev/documentation/index.html) ⬅️

The documentation page was created with [Compodoc](https://compodoc.app/).

## Planned Features 🛠️

We are constantly working to improve **Pokedex-v2**! Here are some planned features that are in the works:
- **Complete German Localization**: 🇩🇪 Finish translating the app, aiming for 100% German localization.


## Getting Started Guide 📚

To get started with **Pokedex-v2**, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mariokreitz/pokedex-v2.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd pokedex-v2
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Run the Application**:

   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:4200` to start exploring!

## API Documentation 🌐

This project interacts with the [PokéAPI](https://pokeapi.co/) using the `pokeapi-js-wrapper`. Here’s a brief overview of the key methods available in this wrapper:

- **getPokemonByName(name)**: Retrieves Pokémon data by name.
- **getTypeByName(name)**: Retrieves Pokémon type data by name.
- **getAbilityByName(name)**: Retrieves Pokémon ability data by name.

For more details, check the [pokeapi-js-wrapper documentation](https://github.com/PokeAPI/pokeapi-js-wrapper) and the [PokéAPI documentation](https://pokeapi.co/docs/v2).

## Troubleshooting 🛠️

Having trouble? Here are some common issues and solutions:

- **Issue: Application not starting**  
  **Solution**: Ensure all dependencies are installed by running `npm install` and check the terminal for any error messages.

- **Issue: Data not loading**  
  **Solution**: Verify your internet connection and ensure the API service is up.

- **Issue: API request failures**  
  **Solution**: Check if the `pokeapi-js-wrapper` configuration is correct and that the API rate limits are not exceeded.

- **Issue: Changing Pokémon loading limit**  
  **Solution**: Be cautious with this setting, as the PokéAPI database may be incomplete. Adjust the limit carefully.

## Known Issues ⚠️

- **Localization**: English localization is 100% complete, while German localization is around 80% done. The **imprint page** is now fully translated into German.

## Changelog 📅

- **v2.3.0**: Added language dropdown selector, Spanish language support, and improved the language system for future expansions.
- **v2.2.0**: Added new features such as lazy loading, keyboard navigation, a credits page, and the Pokéball secret feature. Included several bug fixes and improvements.

## Acknowledgements 🙏

- **PokéAPI**: For providing comprehensive Pokémon data.
- **pokeapi-js-wrapper**: For simplifying and enhancing API interactions.
- **ChartJS**: For the powerful charting library used for data visualization.
- **Franziska**: For the stunning design of this project. 💖

## Contact 📬

For any questions or feedback, feel free to reach out:

- **Email**: [contact@mario-kreitz.dev](mailto:contact@mario-kreitz.dev)
- **GitHub Issues**: [Submit an issue](https://github.com/mariokreitz/pokedex-v2/issues)

Thank you for checking out **Pokedex-v2**! We hope you enjoy exploring Pokémon with our enhanced features. Happy coding! 😄

---

_Made with ❤️ by [Mario Kreitz](https://github.com/mariokreitz)_  
_Design by [Franziska](https://www.instagram.com/18ago/)_
