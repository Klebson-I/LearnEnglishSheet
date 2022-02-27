

export interface WordObject{
    id?:string;
    word:string;
    noun?:string;
    verb?:string;
    adjective?:string;
    meaning?:string;
    sentences?:string[]|null|string;
}

export interface SentenceObj{
    id?:string;
    sentence:string;
    word_id?:string;
    idiom_id?:string;
}

export interface IdiomObj{
    id?:string;
    idiom:string;
    sentences?:string[]|null|string;
    meaning?:string;
}

export enum recordType {
    word,
    idiom
}

export interface GameObj{
    meaning:string;
    correctAnswer:string;
    answers:string[];
    questionNo:number;
}

export interface GameChecked extends GameObj{
    correct:boolean;
}

export interface FlashObj{
    meaning:string;
    learn:string;
}