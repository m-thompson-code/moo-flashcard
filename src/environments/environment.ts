// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.interface';

export const environment: Environment = {
    production: false,
    globalDelay: 400,
    firebase: {
        apiKey: "AIzaSyCyJMWOu6SInEhJfuJNfBP3CGYqLSDY52g",
        authDomain: "moo-flashcard.firebaseapp.com",
        databaseURL: "https://moo-flashcard.firebaseio.com",
        projectId: "moo-flashcard",
        storageBucket: "moo-flashcard.appspot.com",
        messagingSenderId: "617891036670",
        appId: "1:617891036670:web:dcf2f3a4493a4ecb5ad4af",
        measurementId: "G-3N4JGNK7T7"
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
