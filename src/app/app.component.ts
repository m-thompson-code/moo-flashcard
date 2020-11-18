import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import firebase from 'firebase/app';

import { AppHeightService } from './services/app-height.service';
import { environment } from 'src/environments/environment';

export interface TopicData {
    topic: string;
    notes?: string;
}

export interface CardData extends TopicData {
    translateIn?: 'left' | 'right';
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public checked: boolean = true;

    public createTopicForm!: FormGroup;

    private _sub?: Subscription;

    public test: boolean = false;

    public data: {
        value: TopicData[];
        isPending: boolean;
    } = { value: [], isPending: true };

    public cardDatas: CardData[] = [];

    public index: number = 0;

    constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private appHeightService: AppHeightService, private renderer: Renderer2) {

    }

    public ngOnInit(): void {
        this.appHeightService.init(this.renderer);

        console.log(firebase);
        
        this.createTopicForm = this.fb.group({
            topic: new FormControl({
                value: '',
                disabled: false,
            }, Validators.required),
            notes: new FormControl({
                value: '',
                disabled: false,
            }),
        });

        this.data = {value: [
            {
                topic: 'topic 1',
                notes: 'topic 1 notes',
            },
            {
                topic: 'topic 2',
                notes: 'topic 2 notes\nnewline text',
            },
            {
                topic: 'topic 3',
            },
        ], isPending: false};

        this.cardDatas.push({
            topic: this.data.value[0].topic,
            notes: this.data.value[0].notes,
            translateIn: 'left',
        });

        this._sub = this.createTopicForm.valueChanges.subscribe((values: any) => {
            console.log(values);
        });

        this.openSnackBar();

        this.data = {
            value: [
                {
                    topic: 'one',
                    notes: 'notes on one',
                },
                {
                    topic: 'two',
                    notes: 'notes on two\nnewline test',
                },
                {
                    topic: 'three',
                },
            ],
            isPending: false,
        };
    }

    public pushCard(options: {from: 'left' | 'right'}): void {
        if (!this.data) {
            return;
        }

        if (options.from === 'left') {
            this.index += 1;
        } else {
            this.index -= 1;
        }

        if (this.index >= this.data.value.length) {
            this.index = 0;
        }

        if (this.index < 0) {
            this.index = this.data.value.length - 1;
        }

        this.cardDatas.push({
            topic: this.data.value[this.index].topic,
            notes: this.data.value[this.index].notes,
            translateIn: options.from,
        });

        this._trimCards();
    }

    private _trimCards() {
        setTimeout(() => {
            this.cardDatas = [this.cardDatas[this.cardDatas.length - 1]];
        }, environment.globalDelay);
    }

    public updateChecked(event: any): void {
        const checkBoxEventChange = event as MatCheckboxChange;
        console.log(checkBoxEventChange);
        this.checked = checkBoxEventChange.checked;
    }

    public openSnackBar() {
        this._snackBar.open('moo cow', undefined, {
            duration: 5000,
        });
    }

    public cancel(): void {
        console.log("cancel");

        this.createTopicForm.controls.topic.patchValue('');
        this.createTopicForm.controls.notes.patchValue('');
    }

    public ngOnDestroy(): void {
        this.appHeightService.detach();
        
        this._sub?.unsubscribe();
    }
}
