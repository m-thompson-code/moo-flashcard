import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { VoiceService } from '../../services/voice.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
    public updateForm!: FormGroup;
    public toggleUpdateForm!: FormGroup;

    @Input() topic?: string;
    @Input() notes?: string;

    newTopic?: string;
    newNotes?: string;

    @Input() public translateIn?: 'left' | 'right';
    public translateOut?: 'left' | 'right';

    private _sub?: Subscription;

    @Output() public nextClicked: EventEmitter<void> = new EventEmitter();
    @Output() public previousClicked: EventEmitter<void> = new EventEmitter();

    public showForm: boolean = false;

    constructor(private fb: FormBuilder, private voiceService: VoiceService) { }

    public ngOnInit(): void {
        this.newTopic = this.topic || '';
        this.newNotes = this.notes || '';

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

        this.toggleUpdateForm = this.fb.group({
            showForm: new FormControl({
                value: false,
                disabled: false,
            }),
        });

        this._sub = this.updateForm.valueChanges.subscribe((values: any) => {
            console.log(values);

            this.newTopic = values.topic;
            this.newNotes = values.notes;
        });

        this._sub.add(this.toggleUpdateForm.valueChanges.subscribe((values: any) => {
            console.log(values);

            this.showForm = values.showForm;
        }));

        setTimeout(() => {
            this.speakTopic();
        }, environment.globalDelay * 2);
    }

    public next(): void {
        this.voiceService.silence();

        this.translateOut = 'left';
        this.nextClicked.emit();
    }
    
    public previous(): void {
        this.voiceService.silence();

        this.translateOut = 'right';
        this.previousClicked.emit();
    }

    public save(): void {
        console.log("save");
    }

    public cancel(): void {
        console.log("cancel");

        this.updateForm.controls.topic.patchValue(this.topic);
        this.updateForm.controls.notes.patchValue(this.notes);
    }

    public speakTopic(): void {
        if (!this.topic) {
            return;
        }

        this.voiceService.speak(this.topic);
    }

    public ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }
}
