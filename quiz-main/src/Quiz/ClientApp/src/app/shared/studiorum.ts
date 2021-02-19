import { Question } from '../shared/question';

export class Studiorum{
    questions :Question[];
    private title:string

    constructor(t:string) {
        this.title = t;
    }
}