import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-traing',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSub: Subscription;
  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });
    this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }
}
