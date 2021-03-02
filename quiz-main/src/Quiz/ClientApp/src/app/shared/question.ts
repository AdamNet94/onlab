import { Answer } from "./answer";

export class Question {
  id: number;
  name: string;
  text: string;
  answers: Array<Answer> = []

  constructor(id:number=0,name:string ="",text:string ="") {
    this.id=id;
    this.name=name;
    this.text= text;
    for(let i =0; i<4; i++){
      this.answers.push(new Answer())
    }
  }
}
