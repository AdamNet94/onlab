import { Answer } from "./answer";

export class Question {
  id: number;
  name: string;
  text: string;
  studiorumId:number;
  answers: Array<Answer> = []

  constructor(id:number=0,studiorumId:number=0,name:string ="",text:string ="") {
    this.id=id;
    this.name=name;
    this.text = text;
    this.studiorumId = 0;
    for(let i =0; i<4; i++){
      this.answers.push(new Answer())
    }
  }
}
