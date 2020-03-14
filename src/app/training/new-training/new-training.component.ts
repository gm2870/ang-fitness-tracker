import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import 'firebase/firestore';
import { Subscription, Observable } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-traing',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises$: Observable<Exercise[]>;
  constructor(
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}
  isLoading: boolean = false;
  private loadingSub: Subscription;
  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChange.subscribe(
      isLoading => (this.isLoading = isLoading)
    );
    // this.exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => {
    //   this.exercises = exercises;
    // });
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }
  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
  ngOnDestroy() {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    // if (this.exerciseSub) {
    //   this.exerciseSub.unsubscribe();
    // }
  }
}
