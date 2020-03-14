import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UiService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private UiService: UiService,
    private store: Store<fromTraining.State>
  ) {}
  fetchAvailableExercises() {
    this.UiService.loadingStateChange.next(true);
    this.fbSubs.push(
      this.firestore
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration: doc.payload.doc.data()['duration'],
                calories: doc.payload.doc.data()['calories']
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.UiService.loadingStateChange.next(false);
            // this.availableExercises = exercises;
            // this.exercisesChanged.next([...this.availableExercises]);
            this.store.dispatch(new Training.SetAvailableTraining(exercises));
          },
          error => {
            this.UiService.loadingStateChange.next(false);
            this.UiService.showSnackBar('fetching exercises failed', null, 3000);
            this.exercisesChanged.next(null);
          }
        )
    );
  }
  startExercise(selectedId: string) {
    // this.firestore.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.store.dispatch(new Training.StartTraining(selectedId));
  }
  completeExercise() {
    this.store
      .select(fromTraining.getActiveExercises)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }
  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveExercises)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          state: 'cancelled',
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100)
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.firestore
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            //this.finishedExercisesChanged.next(exercises);
            this.store.dispatch(new Training.SetAvailableTraining(exercises));
          },
          error => {
            console.log(error);
          }
        )
    );
  }
  cancelSubscription() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
  private addDataToDatabase(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
  }
}
