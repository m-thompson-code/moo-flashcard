import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';

import firebase from 'firebase/app';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // @ViewChild(MatAccordion) accordion!: MatAccordion;

    public checked: boolean = true;

    public myForm!: FormGroup;
    public newTopicForm!: FormGroup;

    constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {

    }

    public ngOnInit(): void {
        console.log(firebase);

        this.myForm = this.fb.group({
            notes: new FormControl({
                value: 'default value',
                disabled: false,
            }),
        });

        this.newTopicForm = this.fb.group({
            topicText: new FormControl({
                value: '',
                disabled: false,
            }),
        });

        this.openSnackBar();

        setTimeout(() => {
            this.openSnackBar();
        }, 1000 * 10);
    }

    public updateChecked(event: any): void {
        console.log(event);
        this.checked = event.checked;
    }

    public openSnackBar() {
        this._snackBar.open('moo cow', undefined, {
            duration: 5000,
        });
    }
}
