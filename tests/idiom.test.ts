import {IdiomRecord} from "../records/idiom.record";

let idiom : IdiomRecord;

beforeAll(()=>{
    idiom = new IdiomRecord({
        idiom:"Testowy"
    })
})

test ('created idiom should has defined id',()=>{
    expect(idiom.id).toBeDefined();
})