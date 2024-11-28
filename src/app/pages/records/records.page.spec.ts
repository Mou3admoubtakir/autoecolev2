import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsPage } from './records.page';

describe('RecordsPage', () => {
  let component: RecordsPage;
  let fixture: ComponentFixture<RecordsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function async(arg0: () => void): jasmine.ImplementationCallback {
  throw new Error('Function not implemented.');
}

