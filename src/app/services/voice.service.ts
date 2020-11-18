import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class VoiceService {

    constructor() {

    }

    public speak(text: string): void {
        // msg.voice = voices[1]; // Note: some voices don't support altering params
        // // (msg as any).voiceURI = 'native';
        // // msg.volume = 1; // 0 to 1
        // // msg.rate = 1; // 0.1 to 10
        // // msg.pitch = 2; //0 to 2
        // msg.text = text;
        // msg.lang = 'en-US';

        // // msg.onend = function(event) {
        // //     console.log('Finished in ' + event.elapsedTime + ' seconds.');
        // // };

        // Voices I liked
        const voiceIndexes = [0, 1, 4, 5];

        const voiceSeed = voiceIndexes[Math.floor(Math.random() * voiceIndexes.length)];

        this.silence();

        const msg = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();

        (msg as any).voiceURI = 'native';

        if (voiceSeed === 4) {
            msg.rate = .8;
        } else if (voiceSeed === 1) {
            msg.rate = .9;
        }

        msg.voice = voices[voiceSeed];
        msg.text = text;
        msg.lang = 'en-US';

        window.speechSynthesis.speak(msg);
    }

    public silence() {
        window.speechSynthesis.cancel(); // utterance1 stops being spoken immediately, and both are removed from the queue
    }
}
