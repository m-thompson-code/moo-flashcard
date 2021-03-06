import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';
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

    @Input() prefix?: string;
    @Input() topic?: string;
    @Input() notes?: string;
    @Input() topicID?: string;
    @Input() hidden?: boolean;
    @Input() hideNavigation?: boolean;

    @Input() public translateIn?: 'left' | 'right';
    public translateOut?: 'left' | 'right';

    private _sub?: Subscription;

    @Output() public nextClicked: EventEmitter<void> = new EventEmitter();
    @Output() public previousClicked: EventEmitter<void> = new EventEmitter();
    @Output() public replaceMe: EventEmitter<void> = new EventEmitter();

    public showForm: boolean = false;

    @Input() useVoice?: boolean;

    constructor(private fb: FormBuilder, private voiceService: VoiceService, private _snackBar: MatSnackBar, 
        private dataService: DataService, private loaderService: LoaderService) { }

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
            hidden: new FormControl({
                value: this.hidden || false,
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
            // console.log(values);

            // this.newTopic = values.topic;
            // this.newNotes = values.notes;
        });

        this._sub.add(this.toggleUpdateForm.valueChanges.subscribe((values: any) => {
            // console.log(values);

            this.showForm = values.showForm;
        }));

        this._sub.add(this.dataService.discardAllCardsObserver.subscribe(_ => {
            this.voiceService.silence();

            this.translateOut = 'left';
        }));

        if (this.useVoice) {
            setTimeout(() => {
                this.speakTopic();
            }, environment.globalDelay * 2);
        }
    }

    public next(): void {
        this.voiceService.silence();

        this.translateOut = 'left';
        this.nextClicked.emit();
    }

    public handleReplacingCard(): void {
        this.voiceService.silence();
        this.translateOut = 'left';

        this.replaceMe.emit();
    }
    
    public previous(): void {
        this.voiceService.silence();

        this.translateOut = 'right';
        this.previousClicked.emit();
    }

    public update(): Promise<void> {
        if (!this.updateForm.valid || !this.topicID) {
            return Promise.resolve();
        }

        this.loaderService.inc();

        const topic: string = typeof this.updateForm.controls.topic.value === 'string' ? this.updateForm.controls.topic.value : '';
        const notes: string = typeof this.updateForm.controls.notes.value === 'string' ? this.updateForm.controls.notes.value : '';
        const hidden: boolean = !!this.updateForm.controls.hidden.value;

        return this.dataService.updateTopic(this.topicID, topic, notes, hidden).then(() => {
            this.topic = topic;
            this.notes = notes;
            this.hidden = hidden;

            if (this.hidden) {
                this.handleReplacingCard();
            }

            this._openSnackBar('Topic updated', 'primary');
        }).catch(error => {
            console.error(error);

            this._openSnackBar(error?.message || 'Unknown error', 'warn');
        }).then(() => {
            this.loaderService.dec();
        });
    }

    public cancel(): void {
        this.updateForm.controls.topic.patchValue(this.topic);
        this.updateForm.controls.notes.patchValue(this.notes);
        this.updateForm.controls.hidden.patchValue(this.hidden);
        this.updateForm.controls.topic.setErrors(null);
    }

    public deleteTopic(): Promise<void> {
        if (!confirm("Are you sure?") || !this.topicID) {
            return Promise.resolve();
        }

        this.loaderService.inc();

        return this.dataService.deleteTopic(this.topicID).then(() => {
            this.handleReplacingCard();

            this._openSnackBar('Topic deleted', 'primary');
        }).catch(error => {
            console.error(error);

            this._openSnackBar(error?.message || 'Unknown error', 'warn');
        }).then(() => {
            this.loaderService.dec();
        });
    }

    public speakTopic(): void {
        if (!this.topic) {
            return;
        }

        this.voiceService.speak(this.topic);
    }

    private _openSnackBar(text: string, color?: 'primary' | 'warn') {
        // TODO: move to a service
        
        let snackBarClass = "";

        if (color === 'primary') {
            snackBarClass = "primary-snack-bar";
        } else if (color === 'warn') {
            snackBarClass = "warn-snack-bar";
        }

        this._snackBar.open(text, undefined, {
            duration: color === 'warn' ? 5000 : 2000,
            panelClass: snackBarClass,
        });
    }

    public ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }
}
