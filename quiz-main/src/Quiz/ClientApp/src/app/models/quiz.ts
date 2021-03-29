import { Answer } from "./answer";
import { Player } from "./player";
import { Question } from "./question";
import { QuizState } from "./quiz-state";

export class Quiz {
    state:QuizState;
    currentQuestion:Question;
    quizId:number;
    correctAnswer:Answer;
    answerScore:number = 0;
    answerFromServer:Answer;
    topPlayers:Array<Player>;
    
    constructor(qId:number =0, s:QuizState = QuizState.Start, q:Question = new Question()) {
        this.state=s; this.currentQuestion = q;this.quizId = qId; this.correctAnswer=new Answer();
        this.answerFromServer=new Answer();
        this.topPlayers = new Array<Player>();
    }
}