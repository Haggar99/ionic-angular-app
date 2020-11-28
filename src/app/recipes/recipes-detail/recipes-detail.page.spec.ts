import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecipesDetailPage } from './recipes-detail.page';

describe('RecipesDetailPage', () => {
  let component: RecipesDetailPage;
  let fixture: ComponentFixture<RecipesDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
