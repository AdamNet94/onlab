export class Answer {
  id: number;
  text: string;
}

export class UserAnswer {
  answerText: string;
  isCorrect: boolean;
  answerCount: number;
}

export class UserResult {
  name: string;
  score: number;
}

export class QuestionInstance {
  question: string;
  answers: string[];

  constructor(question: string, answers: string[]) {
    this.answers = answers;
    this.question = question;
  }
}

export interface User {
  id: string;
  name: string;
}
