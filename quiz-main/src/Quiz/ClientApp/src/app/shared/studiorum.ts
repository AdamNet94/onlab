import { Question } from '../shared/question';

export class Studiorum{
    id:number
    questions :Question[] = [];
    private title:string

    constructor(id:number=0,t:string="") {
        this.id=id;
        this.title = t;
    }
}