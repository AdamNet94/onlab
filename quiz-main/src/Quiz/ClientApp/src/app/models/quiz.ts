import { Player } from "./player";
import { Question } from "./question";
import { QuizState } from "./quiz-state";

export class Quiz {
    state:QuizState;
    currentQuestion:Question;
    quizId:number;
    answerScore:number = 0;
    topPlayers:Array<Player>;
    questionNumber:number = 1;
    answerArrived:number = 0;

    constructor(qId:number =0, s:QuizState = QuizState.Start, q:Question = new Question()) {
        this.state=s; this.currentQuestion = q;this.quizId = qId;
        this.topPlayers = new Array<Player>();
    }
}