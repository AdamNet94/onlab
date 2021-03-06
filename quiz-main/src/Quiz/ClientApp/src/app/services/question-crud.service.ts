import { Question } from '../models/question';
import { Answer } from '../models/answer';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizInstance } from '../models/quiz-instance';
import { AnswerSubmit } from '../models/answer-submit';

@Injectable({
  providedIn: 'root'
})
export class QuestionCrudService {

  questionListRefresh = new Subscription;
  invokeQuestionListRefresh = new EventEmitter();

  invokeAddedQuestion = new EventEmitter();
  addedQuestionSubscription: Subscription;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') readonly baseUrl: string, readonly router: Router) { }

  getQuestions() {
    return this.httpClient.get<Question[]>(this.baseUrl + 'api/Questions');
  }

  getQuestion(id: number) {
    return this.httpClient.get<Question>(this.baseUrl + 'api/Questions/id');
  }

  getAnswers() {
    this.httpClient.get<Answer[]>(this.baseUrl + 'api/Answers');
  }

  getAnswer(id: number) {
    return this.httpClient.get<Answer>(this.baseUrl + 'api/Answers/id'); 
  }

  postQuestion(question : Question) {
    return this.httpClient.post<Question>(this.baseUrl + 'api/Questions', question);
  }

  putQuestion(question: Question, id) {
    return this.httpClient.put<Question>(this.baseUrl + 'api/Questions/' + id, question);
  }

  putAnswer(answer: Answer, id) {
    return this.httpClient.put<Answer>(this.baseUrl + 'api/Answers/' + id, answer);
  }

  deleteQuestion(id) {
    return this.httpClient.delete<Question>(this.baseUrl + 'api/Questions/' + id);
  }

  getQuizInstanceId(){
    return this.httpClient.get<number>(this.baseUrl + 'api/Quiz');
  }

  quizNext(quizInstanceId: number){
    return this.httpClient.get<Question>(this.baseUrl + 'api/Quiz/next/'+ quizInstanceId);
  }

  submitAnswer(params: number[]){
    return this.httpClient.post<AnswerSubmit>(this.baseUrl + 'api/Quiz',params);
  }

  /*
  deleteAnswer(id) {
    return this.httpClient.delete<Answer>(this.baseUrl + 'api/Answers/' + id);
  }
  */
  refreshQuestions() {
    this.invokeQuestionListRefresh.emit();
  }
  
  parseCreatedQuestion (res : Question) {
    this.invokeAddedQuestion.emit(res);
  }

}
