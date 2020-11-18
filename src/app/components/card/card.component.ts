import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
    public updateForm!: FormGroup;

    @Input() topic?: string;
    @Input() notes?: string;

    @Input() public translateIn?: 'left' | 'right';
    public translateOut?: 'left' | 'right';

    // @Input()
    // public set visible(visible: boolean) {
    //     this._visible = visible || false;
    //     this.view__visible = this._visible;
    // };

    // public get visible(): boolean {
    //     return this._visible;
    // };

    private _sub?: Subscription;

    @Output() public nextClicked: EventEmitter<void> = new EventEmitter();
    @Output() public previousClicked: EventEmitter<void> = new EventEmitter();

    constructor(private fb: FormBuilder) { }

    public ngOnInit(): void {
      this.updateForm = this.fb.group({
        topic: new FormControl({
            value: this.topic || '',
            disabled: false,
        }, Validators.required),
        notes: new FormControl({
            value: this.notes || '',
            disabled: false,
        }),
    });

        this._sub = this.updateForm.valueChanges.subscribe((values: any) => {
            console.log(values);
        });
    }

    public next(): void {
        this.translateOut = 'left';
        this.nextClicked.emit();
    }
    
    public previous(): void {
        this.translateOut = 'right';
        this.previousClicked.emit();
    }

    public ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }
}
