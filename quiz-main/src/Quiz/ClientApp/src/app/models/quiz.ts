import { Answer } from "./answer";
import { Question } from "./question";
import { QuizState } from "./quiz-state";

export class Quiz {
    state:QuizState;
    currentQuestion:Question;
    quizId:number;
    correctAnswer:Answer;
    answerScore:number=0;

    constructor(qId:number =0, s:QuizState = QuizState.Start, q:Question = new Question()) {
        this.state=s; this.currentQuestion = q;this.quizId = qId; this.correctAnswer=new Answer();
    }
}