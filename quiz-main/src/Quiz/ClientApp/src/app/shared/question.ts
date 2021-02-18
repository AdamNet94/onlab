import { Answer } from "./answer";

export class Question {
  id: number;
  name: string;
  text: string;
  answers: Answer[];
}
