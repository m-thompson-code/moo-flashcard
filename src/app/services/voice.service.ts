import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class VoiceService {

    constructor() {

    }

    public speak(text: string): void {
        // Voices I liked
        const voiceIndexes = [1, 2, 3, 4, 5];

        const voiceSeed = voiceIndexes[Math.floor(Math.random() * voiceIndexes.length)];

        this.silence();

        const synth =  window.speechSynthesis;

        const msg = new SpeechSynthesisUtterance();
        const voices = synth.getVoices();

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

        msg.voice = voices[voiceSeed];
        msg.text = text;
        msg.lang = 'en-US';

        synth.speak(msg);
    }

    public silence() {
        const synth =  window.speechSynthesis;

        synth.cancel(); // utterance1 stops being spoken immediately, and both are removed from the queue
    }
}
