export class QuizInstance{

    id: number;
    state: QuizState;
    questionId: number;
}

enum QuizState{
    Start,
    Showquestion,
    Showanswer,
    Questionresult,
    Quizresult
}