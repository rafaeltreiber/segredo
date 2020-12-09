import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EsconderPage } from './esconder.page';

describe('EsconderPage', () => {
  let component: EsconderPage;
  let fixture: ComponentFixture<EsconderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsconderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EsconderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
