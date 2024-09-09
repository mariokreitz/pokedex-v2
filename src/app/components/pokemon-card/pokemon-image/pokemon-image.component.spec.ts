import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonImageComponent } from './pokemon-image.component';

describe('PokemonImageComponent', () => {
  let component: PokemonImageComponent;
  let fixture: ComponentFixture<PokemonImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
