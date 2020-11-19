import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import firebase from 'firebase/app';

export interface RawTopicData {
    topic: string;
    notes?: string;
    timestamp: firebase.firestore.FieldValue;
    hidden: boolean;
}

export interface TopicData extends RawTopicData {
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    public discardAllCardsObserver: Observable<void>;
    private discardAllCardsSubject: Subject<void>;

    constructor(private firestore: AngularFirestore) {
        this.discardAllCardsSubject = new Subject<void>();
        this.discardAllCardsObserver = this.discardAllCardsSubject.asObservable();
    }

    public discardAllCards(): void {
        this.discardAllCardsSubject.next();
    }

    public getTopics(): Observable<TopicData[]> {
        return this.firestore.collection<RawTopicData>('topics', ref => ref.orderBy('timestamp')).valueChanges({idField: 'id'}).pipe(map(collection => {
            const topics: TopicData[] = [];

            for (const doc of collection) {
                topics.push({
                    id: doc.id,
                    topic: doc.topic || '',
                    notes: doc.notes || '',
                    timestamp: doc.timestamp,
                    hidden: !!doc.hidden,
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
            hidden: false,
        }).then(() => {
            console.log("Add topic successful");
        }).catch(error => {
            console.error(error);
        });
    }
    
    public updateTopic(topicID: string, topic: string, notes: string, hidden: boolean): Promise<void> {
        return this.firestore.collection<RawTopicData>('topics').doc(topicID).update({
            topic: topic || '',
            notes: notes || '',
            hidden: hidden || false,
        }).then(() => {
            console.log("Update topic successful");
        }).catch(error => {
            console.error(error);
        });
    }
    
    public deleteTopic(topicID: string): Promise<void> {
        return this.firestore.collection<RawTopicData>('topics').doc(topicID).delete().then(() => {
            console.log("Delete topic successful");
        }).catch(error => {
            console.error(error);
        });
    }
}
