export class Answer {
  id: number;
  text: string;
  questionID: number;
  isCorrect: boolean;

  constructor(id:number =0,t:string="",qid:number=0,iscorr:boolean=false) {
    this.id = id;
    this.text = t;
    this.questionID = qid;
    this.isCorrect = iscorr;
  }


}
