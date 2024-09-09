import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-image',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-image.component.html',
  styleUrl: './pokemon-image.component.scss',
})
export class PokemonImageComponent implements OnInit {
  @Input() src!: string | null;
  @Input() alt!: string;

  imgSrc!: string;

  ngOnInit(): void {
    this.imgSrc = this.src ?? '';
  }
}
