import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonOverviewComponent } from './pokemon-overview.component';

describe('PokemonOverviewComponent', () => {
  let component: PokemonOverviewComponent;
  let fixture: ComponentFixture<PokemonOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
