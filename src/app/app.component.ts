import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppHeightService } from './services/app-height.service';
import { environment } from 'src/environments/environment';
import { VoiceService } from './services/voice.service';
import { DataService, TopicData } from './services/data.service';
import { LoaderService } from './services/loader.service';

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
    public voiceForm!: FormGroup;

    private _sub?: Subscription;

    public test: boolean = false;

    public data: {
        value: TopicData[];
        isPending: boolean;
    } = { value: [], isPending: true };

    public cardDatas: CardData[] = [];

    public index: number = 0;

    public useVoice: boolean = false;

    constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private renderer: Renderer2, 
        private appHeightService: AppHeightService, private voiceService: VoiceService, 
        private dataService: DataService, public loaderService: LoaderService) {

    }

    public ngOnInit(): void {
        this.appHeightService.init(this.renderer);

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

        this.voiceForm = this.fb.group({
            voice: new FormControl({
                value: this.useVoice,
                disabled: false,
            }),
        });

        this._sub = this.createTopicForm.valueChanges.subscribe((values: any) => {
            // console.log(values);
        });

        this._sub.add(this.voiceForm.valueChanges.subscribe((values: any) => {
            // console.log(values);

            this.useVoice = values?.voice;

            if (!this.useVoice) {
                this.voiceService.silence();
            }
        }));

        this.openSnackBar();

        this._sub.add(this.dataService.getTopics().subscribe(topics => {
            this.data = {
                value: topics,
                isPending: false,
            };

            if (!this.cardDatas.length) {
                this.pushCard({from: 'left'});
            }
        }));
    }

    public pushCard(options: {from: 'left' | 'right'}): void {
        if (!this.data.value.length) {
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
            id: this.data.value[this.index].id,
            topic: this.data.value[this.index].topic,
            notes: this.data.value[this.index].notes,
            translateIn: options.from,
            timestamp: this.data.value[this.index].timestamp,
        });

        this._trimCards();
    }

    private _trimCards() {
        setTimeout(() => {
            this.cardDatas = [this.cardDatas[this.cardDatas.length - 1]];
        }, environment.globalDelay);
    }

    public openSnackBar() {
        this._snackBar.open('moo cow', undefined, {
            duration: 5000,
        });
    }

    public createTopic(): Promise<void> {
        if (!this.createTopicForm.valid) {
            console.warn("Nopes");
            // TODO: snackbar
            return Promise.resolve();
        }

        const topic: string = typeof this.createTopicForm.controls.topic.value === 'string' ? this.createTopicForm.controls.topic.value : '';
        const notes: string = typeof this.createTopicForm.controls.notes.value === 'string' ? this.createTopicForm.controls.notes.value : '';

        this.loaderService.inc();

        return this.dataService.addTopic(topic, notes).then(() => {
            this.cancel();
        }).catch(error => {
            console.error(error);
        }).then(() => {
            this.loaderService.dec();
        });
    }

    public cancel(): void {
        console.log("cancel");

        this.createTopicForm.controls.topic.patchValue('');
        this.createTopicForm.controls.notes.patchValue('');
        this.createTopicForm.controls.topic.setErrors(null);
    }

    public shuffle(): void {
        this._shuffle(this.data.value);

        this.dataService.discardAllCards();

        this.pushCard({from: 'left'});
    }

    private _shuffle<T>(array: T[]): void {
        function shuffle(array: T[]) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            
                // swap elements array[i] and array[j]
                // we use "destructuring assignment" syntax to achieve that
                // you'll find more details about that syntax in later chapters
                // same can be written as:
                // let t = array[i]; array[i] = array[j]; array[j] = t
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        return shuffle(array);
    }

    public ngOnDestroy(): void {
        this.appHeightService.detach();
        
        this._sub?.unsubscribe();
    }
}
