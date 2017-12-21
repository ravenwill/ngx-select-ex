import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SelectModule } from './select.module';
import { SelectComponent } from './select.component';


@Component({
  selector: 'select-test',
  template: `
    <ng-select id="sel-1" #component1
               [allowClear]="select1.allowClear"
               [placeholder]="select1.placeholder"
               [idField]="select1.idField"
               [textField]="select1.textField"
               [childrenField]="select1.childrenField"
               [multiple]="select1.multiple"
               [noAutoComplete]="select1.noAutoComplete"
               [items]="select1.items"
               [disabled]="select1.disabled"
               [active]="select1.active"

               (data)="select1.data($event)"
               (selected)="select1.selected($event)"
               (removed)="select1.removed($event)"
               (typed)="select1.typed($event)"
               (opened)="select1.opened($event)"></ng-select>
    <ng-select id="sel-2" #component2
               [formControl]="select2.formControl"
               [allowClear]="select2.allowClear"
               [placeholder]="select2.placeholder"
               [idField]="select2.idField"
               [textField]="select2.textField"
               [childrenField]="select2.childrenField"
               [multiple]="select2.multiple"
               [noAutoComplete]="select2.noAutoComplete"
               [items]="select2.items"></ng-select>
    <ng-select id="sel-3" #component3
               [(ngModel)]="select3.value"
               [allowClear]="select3.allowClear"
               [placeholder]="select3.placeholder"
               [idField]="select3.idField"
               [textField]="select3.textField"
               [childrenField]="select3.childrenField"
               [multiple]="select3.multiple"
               [noAutoComplete]="select3.noAutoComplete"
               [items]="select3.items"
               [disabled]="select3.disabled"></ng-select>`
})
class TestSelectComponent {
  @ViewChild('component1') public component1: SelectComponent;
  @ViewChild('component2') public component2: SelectComponent;
  @ViewChild('component3') public component3: SelectComponent;

  public select1: any = {
    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false,
    active: [],

    data: () => null,
    selected: () => null,
    removed: () => null,
    typed: () => null,
    opened: () => null
  };

  public select2: any = {
    formControl: new FormControl(),

    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: []
  };

  public select3: any = {
    value: null,

    allowClear: false,
    placeholder: '',
    idField: 'id',
    textField: 'text',
    childrenField: 'children',
    multiple: false,
    noAutoComplete: false,
    items: [],
    disabled: false
  };
}

const items1 = [
  {id: 1, text: 'item one'},
  {id: 2, text: 'item two'},
  {id: 3, text: 'item three'},
  {id: 4, text: 'item four'},
];
const items2 = [
  {id: 1, name: 'v1'},
  {id: 2, name: 'v2'},
  {id: 4, name: 'v4'},
  {id: 5, name: 'v5'}
];
const items3 = [
  {uuid: 'uuid-6', name: 'v6'},
  {uuid: 'uuid-7', name: 'v7'},
  {uuid: 'uuid-8', name: 'v8'},
  {uuid: 'uuid-9', name: 'v9'},
  {uuid: 'uuid-10', name: 'v10'}
];

const createKeyboardEvent = (typeArg: string, keyCode: number) => {
  const customEvent = new CustomEvent(typeArg);
  customEvent['keyCode'] = keyCode;
  return customEvent;
};

describe('Component SelectComponent', () => {
  let fixture: ComponentFixture<TestSelectComponent>;
  const el = (id: number) => fixture.debugElement.nativeElement.querySelector(`#sel-${id} .ui-select-container`);
  const formControl = (id: number) => el(id).querySelector('.form-control');
  const formControlInput = (id: number) => el(id).querySelector('input');
  const selectChoices = (id: number) => el(id).querySelectorAll('.ui-select-choices-row');
  const selectChoiceActive = (id: number) => el(id).querySelector('.ui-select-choices-row.active div');
  const selectedItem = (id: number) => el(id).querySelector('.ui-select-match-text'); // select multiple = false
  const selectedItems = (id: number) => el(id).querySelectorAll('.ui-select-match-item'); // select multiple = true

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SelectModule],
      declarations: [TestSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSelectComponent);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture).toBeTruthy();
    expect(fixture.componentInstance.component1).toBeTruthy();
    expect(fixture.componentInstance.component2).toBeTruthy();
    expect(fixture.componentInstance.component3).toBeTruthy();
  });

  it('should be created with closed menu', () => {
    expect(selectChoices(1).length).toBe(0);
    expect(selectChoices(2).length).toBe(0);
    expect(selectChoices(3).length).toBe(0);
  });

  describe('default property', () => {
    it('"allowClear" should be false', () => {
      expect(fixture.componentInstance.component2.allowClear).toBeFalsy();
    });

    it('"placeholder" should be empty string', () => {
      expect(fixture.componentInstance.component2.placeholder).toEqual('');
    });

    it('"idField" should be "id"', () => {
      expect(fixture.componentInstance.component2.idField).toBe('id');
    });

    it('"textField" should be "text"', () => {
      expect(fixture.componentInstance.component2.textField).toBe('text');
    });

    it('"childrenField" should be "children"', () => {
      expect(fixture.componentInstance.component2.childrenField).toBe('children');
    });

    it('"multiple" should be false', () => {
      expect(fixture.componentInstance.component2.multiple).toBeFalsy();
    });

    it('"noAutoComplete" should be false', () => {
      expect(fixture.componentInstance.component2.noAutoComplete).toBeFalsy();
    });

    it('"disabled" should be false', () => {
      expect(fixture.componentInstance.component2.disabled).toBeFalsy();
    });

    it('"active" should be an empty array', () => {
      expect(fixture.componentInstance.component2.active).toEqual([]);
    });
  });

  describe('property noAutoComplete should', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.noAutoComplete = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
    });

    it('hide an input control', () => {
      expect(formControlInput(1)).toBeFalsy();
    });
  });

  describe('menu should be opened', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      formControl(1).click();
      fixture.detectChanges();
    });

    it('by click', () => expect(selectChoices(1).length).toBeGreaterThan(0));
  });

  describe('menu should be closed', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      fixture.componentInstance.component2.items = items1;
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('by off click', () => fixture.debugElement.nativeElement.click());

    it('by select item', () => selectChoices(1)[0].click());

    it('by press button Escape', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 27)); // key Escape
    });

    it('by open other menu', () => formControl(2).click());

    afterEach(() => {
      fixture.detectChanges();
      expect(selectChoices(1).length).toBe(0);
    });
  });

  describe('after open menu with no selected item', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('first item is active', () => {
      expect(selectChoiceActive(1).innerHTML).toBe('item one');
    });
  });

  describe('menu should be have navigation', () => {
    beforeEach(() => {
      fixture.componentInstance.component1.items = items1;
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('activate last item by press the button arrow right', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item four');
    });

    it('activate previous item by press the button arrow up', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 38)); // arrow up
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item three');
    });

    it('activate first item by press the button arrow left', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 39)); // arrow right
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 37)); // arrow left
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item one');
    });

    it('activate next item by press the button arrow down', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
      fixture.detectChanges();
      expect(selectChoiceActive(1).innerHTML).toBe('item two');
    });
  });

  describe('should select a single item', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.componentInstance.select1.multiple = false;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('by click on choice item', () => {
      selectChoices(1)[1].click();
    });

    it('by press the key Enter on a choice item', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
    });

    afterEach(() => {
      fixture.detectChanges();
      expect(selectedItem(1).innerHTML).toBe('item two');
    });
  });

  describe('should select a multiple items', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(selectChoices(1).length).toBeGreaterThan(0);
    });

    it('by clicking on choice items', () => {
      selectChoices(1)[1].click();
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      selectChoices(1)[2].click();
    });

    it('by press the key Enter on a choice item', () => {
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 40)); // arrow down
      formControlInput(1).dispatchEvent(createKeyboardEvent('keydown', 13)); // key Enter
    });

    afterEach(() => {
      fixture.detectChanges();
      expect(selectedItems(1).length).toBe(2);
      expect(selectedItems(1)[0].querySelector(' span').innerHTML).toBe('item two');
      expect(selectedItems(1)[1].querySelector(' span').innerHTML).toBe('item four');
    });
  });

  describe('should remove selected', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.componentInstance.select1.allowClear = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      selectChoices(1)[0].click();
      fixture.detectChanges();
      expect(selectedItem(1).innerHTML).toBe('item one');
    });

    it('a single item', () => {
      el(1).querySelector('.btn-link').click();
      fixture.detectChanges();
      expect(selectedItem(1)).toBeFalsy();
    });

    it('a multiple item', () => {
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      selectedItems(1)[0].querySelector('.close').click();
      fixture.detectChanges();
      expect(selectedItems(1).length).toBe(0);
    });
  });

  describe('after click', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
    });

    it('single select should focus the input field', () => {
      fixture.componentInstance.select1.multiple = false;
    });

    it('multiple select should focus the input field', () => {
      fixture.componentInstance.select1.multiple = true;
    });

    afterEach(() => {
      formControl(1).click();
      fixture.detectChanges();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeTruthy();
      expect(formControlInput(1)).toBe(document.activeElement);
    });
  });

  describe('choice items should be filtered', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.items = items1;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      formControlInput(1).value = 'o';
      formControlInput(1).dispatchEvent(new KeyboardEvent('keyup'));
      fixture.detectChanges();
    });

    it('by input text', () => {
      expect(selectChoices(1).length).toBe(3);
    });
  });

  describe('should be disabled', () => {
    beforeEach(() => {
      fixture.componentInstance.select1.disabled = true;
      fixture.detectChanges();
    });

    it('single select', () => {
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeFalsy();
      expect(selectChoices(1).length).toBe(0);
    });

    it('multiple select', () => {
      fixture.componentInstance.select1.multiple = true;
      fixture.detectChanges();
      formControl(1).click();
      fixture.detectChanges();
      expect(formControlInput(1)).toBeTruthy();
      expect(formControlInput(1).disabled).toBeTruthy();
      expect(selectChoices(1).length).toBe(0);
    });
  });

  describe('FormControl should be', () => {
    let tmpFixture: ComponentFixture<TestSelectComponent>;

    beforeEach(() => {
      tmpFixture = TestBed.createComponent(TestSelectComponent);
      tmpFixture.componentInstance.select2.items = items1;
    });

    it('valid when select is: single, empty and allowClear', () => {
      tmpFixture.componentInstance.select2.multiple = false;
      tmpFixture.componentInstance.select2.allowClear = true;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });

    it('invalid when select is: single, empty and not allowClear', () => {
      tmpFixture.componentInstance.select2.multiple = false;
      tmpFixture.componentInstance.select2.allowClear = false;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeFalsy();
    });

    it('valid when select is: multiple and empty', () => {
      tmpFixture.componentInstance.select2.multiple = true;
      tmpFixture.detectChanges();
      expect(tmpFixture.componentInstance.select2.formControl.valid).toBeTruthy();
    });
  });
});