import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private pokemonService: PokemonService) {}

  handleSearchInputChange(searchTerm: string): void {
    console.log(searchTerm);
  }

  ngOnInit(): void {}
}
