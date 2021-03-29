export class Player {
    nickName:string ="";
    totalScore:number=0;

    constructor(name:string,score:number) {
        this.nickName=name;
        this.totalScore=score;
    }
}