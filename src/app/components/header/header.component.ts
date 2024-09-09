import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private searchService: SearchService) {}

  handleSearchInputChange(searchTerm: string): void {
    this.searchService.changeSearch(searchTerm);
  }

  ngOnInit(): void {}
}
