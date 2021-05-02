import { Player } from "./player";
import { Question } from "./question";
import { QuizState } from "./quiz-state";

export class Quiz {
    state:QuizState;
    currentQuestion:Question;
    quizId:number;
    answerScore:number = 0;
    topPlayers:Array<Player>;
    questionNumber:number = 0;
    answerArrived:number = 0;
    nameIsTaken:boolean = false;
    quetionTime:number = 10;
    timeRemained:number = 10;
    
    constructor(qId:number =0, s:QuizState = QuizState.Start, q:Question = new Question()) {
        this.state=s; this.currentQuestion = q;this.quizId = qId;
        this.topPlayers = new Array<Player>();
    }
}