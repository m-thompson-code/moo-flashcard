import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material-experimental/mdc-button';
import { MatCardModule } from '@angular/material-experimental/mdc-card';
import { MatCheckboxModule } from '@angular/material-experimental/mdc-checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material-experimental/mdc-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material-experimental/mdc-input';
import { MatProgressBarModule } from '@angular/material-experimental/mdc-progress-bar';
import { MatProgressSpinnerModule } from '@angular/material-experimental/mdc-progress-spinner';
import { MatRippleModule } from '@angular/material-experimental/mdc-core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// import firebase from 'firebase/app';

// const firebaseConfig = {
//     apiKey: "AIzaSyCyJMWOu6SInEhJfuJNfBP3CGYqLSDY52g",
//     authDomain: "moo-flashcard.firebaseapp.com",
//     databaseURL: "https://moo-flashcard.firebaseio.com",
//     projectId: "moo-flashcard",
//     storageBucket: "moo-flashcard.appspot.com",
//     messagingSenderId: "617891036670",
//     appId: "1:617891036670:web:dcf2f3a4493a4ecb5ad4af",
//     measurementId: "G-3N4JGNK7T7"
// };

// firebase.initializeApp(firebaseConfig);

// import "firebase/auth";
// import "firebase/firestore";
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';

@NgModule({
    declarations: [
       AppComponent,
       CardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,

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
        TextFieldModule,
        MatSlideToggleModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
