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
    public createTopicForm!: FormGroup;
    public voiceForm!: FormGroup;

    private _sub?: Subscription;

    public test: boolean = false;

    public allData: {
        value: TopicData[];
        isPending: boolean;
    } = { value: [], isPending: true };

    public data: {
        value: TopicData[];
        isPending: boolean;
    } = { value: [], isPending: true };

    public cardDatas: CardData[] = [];

    public index: number = 0;

    public useVoice: boolean = false;

    public showAllTopics: boolean = false;

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
            showAllTopics: new FormControl({
                value: this.showAllTopics,
                disabled: false,
            }),
        });

        this._sub = this.createTopicForm.valueChanges.subscribe((values: any) => {
            // console.log(values);
        });

        this._sub.add(this.voiceForm.valueChanges.subscribe((values: any) => {
            // console.log(values);

            this.useVoice = !!values.voice;
            this.showAllTopics = !!values.showAllTopics;

            if (!this.useVoice) {
                this.voiceService.silence();
            }

            if (this.showAllTopics) {
                this.handleReplacingCard();
            }
        }));

        this._sub.add(this.dataService.getTopics().subscribe(topics => {
            const _topics = [];

            const topicMap: {
                [topicID: string]: {
                    topic: TopicData;
                    found: boolean;
                };
            } = {};

            for (const existingTopic of this.allData.value) {
                topicMap[existingTopic.id] = {
                    topic: existingTopic,
                    found: false,
                };
            }

            // Keep a list of new topics
            const newTopics: TopicData[] = [];

            for (const topic of topics) {
                const topicMapEntree = topicMap[topic.id];

                // Update map if topic is found in new topic array and update topic reference to latest version
                if (topicMapEntree) {
                    topicMapEntree.found = true;
                    topicMapEntree.topic = topic;

                    continue;
                }

                // If a new topic wasn't in topic map, populate newTopics (will be used later to add to allData.value)
                newTopics.push(topic);
            }

            for (let i = 0; i < this.allData.value.length; i++) {
                const previousTopic = this.allData.value[i];

                const topicMapEntree = topicMap[previousTopic.id];

                // this.allData.value[i] = topicMapEntree.topic;
                Object.assign(previousTopic, topicMapEntree.topic);

                // If for some reason this topic is no longer defined or if this topic wasn't found in the latest list of topics, remove this topic
                if (!topicMapEntree.topic || !topicMapEntree.found) {
                    this.allData.value.splice(i, 1);
                    i -= 1;
                    continue;
                }
            }

            // Add all the new topics
            this.allData.value.push(...newTopics);

            this.allData.isPending = false;

            this.data = {
                value: topics.filter(topic => !topic.hidden),
                isPending: false,
            };

            if (!this.cardDatas.length) {
                this.index = this.data.value.length - 1;

                this.pushCard({from: 'left'});
            }
        }));
    }

    public handleReplacingCard() {
        this.index -= 1;

        this.pushCard({from: 'left'});
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
            hidden: this.data.value[this.index].hidden,
        });

        this._trimCards();
    }

    private _trimCards() {
        setTimeout(() => {
            this.cardDatas = [this.cardDatas[this.cardDatas.length - 1]];
        }, environment.globalDelay);
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

    public createTopic(): Promise<void> {
        if (!this.createTopicForm.valid) {
            return Promise.resolve();
        }

        const topic: string = typeof this.createTopicForm.controls.topic.value === 'string' ? this.createTopicForm.controls.topic.value : '';
        const notes: string = typeof this.createTopicForm.controls.notes.value === 'string' ? this.createTopicForm.controls.notes.value : '';

        this.loaderService.inc();

        return this.dataService.addTopic(topic, notes).then(() => {
            this.cancel();
            this._openSnackBar('Topic created', 'primary');
        }).catch(error => {
            console.error(error);
            this._openSnackBar(error?.message || 'Unknown error', 'warn');
        }).then(() => {
            this.loaderService.dec();
        });
    }

    public cancel(): void {
        this.createTopicForm.controls.topic.patchValue('');
        this.createTopicForm.controls.notes.patchValue('');
        this.createTopicForm.controls.topic.setErrors(null);
    }

    public shuffle(): void {
        this._shuffle(this.data.value);

        this.dataService.discardAllCards();

        this.index = this.data.value.length - 1;

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
