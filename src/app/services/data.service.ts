import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import firebase from 'firebase/app';

export interface RawTopicData {
    topic: string;
    notes?: string;
    timestamp: firebase.firestore.FieldValue;
}

export interface TopicData extends RawTopicData {
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private firestore: AngularFirestore) { }

    public getTopics(): Observable<TopicData[]> {
        return this.firestore.collection<RawTopicData>('topics', ref => ref.orderBy('timestamp')).valueChanges({idField: 'id'}).pipe(map(collection => {
            const topics: TopicData[] = [];

            for (const doc of collection) {
                console.log(doc);
                topics.push({
                    id: doc.id,
                    topic: doc.topic || '',
                    notes: doc.notes || '',
                    timestamp: doc.timestamp,
                });
            }

            return topics;
        }));
    }

    public addTopic(topic: string, notes: string): Promise<void> {
        return this.firestore.collection<RawTopicData>('topics').add({
            topic: topic,
            notes: notes,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
            console.log("did it");
        }).catch(error => {
            console.error(error);
        });
    }
    
    public updateTopic(topicID: string, topic: string, notes: string): Promise<void> {
        return this.firestore.collection<RawTopicData>('topics').doc(topicID).update({
            topic: topic || '',
            notes: notes || '',
        }).then(() => {
            console.log("did it");
        }).catch(error => {
            console.error(error);
        });
    }
    
    public deleteTopic(topicID: string): Promise<void> {
        return this.firestore.collection<RawTopicData>('topics').doc(topicID).delete().then(() => {
            console.log("did it");
        }).catch(error => {
            console.error(error);
        });
    }
}
