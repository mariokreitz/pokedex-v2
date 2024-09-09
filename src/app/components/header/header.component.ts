import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  handleSearchInputChange(searchTerm: string): void {
    this.sharedService.changeSearch(searchTerm);
  }

  ngOnInit(): void {}
}
