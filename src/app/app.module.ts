import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCyJMWOu6SInEhJfuJNfBP3CGYqLSDY52g",
    authDomain: "moo-flashcard.firebaseapp.com",
    databaseURL: "https://moo-flashcard.firebaseio.com",
    projectId: "moo-flashcard",
    storageBucket: "moo-flashcard.appspot.com",
    messagingSenderId: "617891036670",
    appId: "1:617891036670:web:dcf2f3a4493a4ecb5ad4af",
    measurementId: "G-3N4JGNK7T7"
};

firebase.initializeApp(firebaseConfig);

import "firebase/auth";
import "firebase/firestore";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
       AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
