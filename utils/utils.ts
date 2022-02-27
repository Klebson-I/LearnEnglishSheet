import {SentenceRecord} from '../records/sentence.record';
import {WordRecord} from '../records/word.record';
import {IdiomRecord} from "../records/idiom.record";
import {FlashObj, GameChecked, GameObj, IdiomObj, recordType, WordObject} from "../types/type";

export const returnWithSentences=async(arr:IdiomRecord[]|WordRecord[]):Promise<IdiomRecord[]|WordRecord[]>=>{
    for await(const elem of arr){
        await elem.findSentences();
    }
    return arr;
}

export const checkDotsInSentences=(arr:WordRecord[]|IdiomRecord[])=>{
    for(const elem of arr){
        if(elem.sentences.length>0){
            const newSentences=(elem.sentences as string[]).map(sentence=>{
                if(sentence[sentence.length-1]!=="."){
                    return sentence + ".";
                }else{
                    return sentence;
                }
            })
            elem.sentences=newSentences;
        }
    }
    return arr;
}

export const createSentences=async(sentences:string|string[],insertedId:string,objType:recordType)=>{
    if(objType===recordType.word){
        if(typeof sentences==='object'){
            for await(const sentence of sentences){
                const newSentence=new SentenceRecord({
                    word_id:insertedId,
                    idiom_id:null,
                    sentence
                })
                await newSentence.insert();
            }
        }else if(typeof sentences==='string'){
            const newSentence=new SentenceRecord({
                word_id:insertedId,
                idiom_id:null,
                sentence:sentences
            })
            await newSentence.insert();
        }
    }
    if(objType===recordType.idiom){
        if(typeof sentences==='object'){
            for await(const sentence of sentences){
                const newSentence=new SentenceRecord({
                    word_id:null,
                    idiom_id:insertedId,
                    sentence
                })
                await newSentence.insert();
            }
        }else if(typeof sentences==='string'){
            const newSentence=new SentenceRecord({
                word_id:null,
                idiom_id:insertedId,
                sentence:sentences
            })
            await newSentence.insert();
        }
    }
}


export const updateSentences=async(obj:WordObject|IdiomObj,id:string,objType:recordType)=>{


    let sentencesFromClient:string[];
    let sentences:SentenceRecord[];
    let sentencesExist:string[];

    if(objType===recordType.word){
        sentences=await SentenceRecord.getAllByWord(id);
        sentencesExist=sentences.map(elem=>elem.sentence);
    }

    if(objType===recordType.idiom){
        sentences=await SentenceRecord.getAllByIdiom(id);
        sentencesExist=sentences.map(elem=>elem.sentence);
    }

    if(typeof obj.sentences==='string'){
        sentencesFromClient=[obj.sentences];
    }
    else if(typeof obj.sentences==='object'){
        sentencesFromClient=[...obj.sentences];
    }
    else if(typeof obj.sentences==='undefined'){
        sentencesFromClient=[];
    }

    const addedSentences=sentencesFromClient.filter(elem=>!sentencesExist.includes(elem));
    const deletedSentences=sentencesExist.filter(elem=>!sentencesFromClient.includes(elem));


    if(addedSentences.length&&objType===recordType.word){
        for await(const addedSentence of addedSentences){
            const newSentence=new SentenceRecord({
                word_id:id,
                sentence:addedSentence
            })
            await newSentence.insert();
        }
    }

    if(addedSentences.length&&objType===recordType.idiom){
        for await(const addedSentence of addedSentences){
            const newSentence=new SentenceRecord({
                idiom_id:id,
                sentence:addedSentence
            })
            await newSentence.insert();
        }
    }

    if(deletedSentences.length){
        for await(const deletedSentence of deletedSentences){
            const foundSentence=sentences.find(elem=>elem.sentence===deletedSentence);
            await foundSentence.delete();
        }
    }
}

export const helpers={
    isnull:(elem:any)=>elem===null||elem==="",
    checkArrLength:(arr:any)=>arr.length===0,
}


export const createGameObjects=async():Promise<GameObj[]>=>{
    const arrayLength=6;

    const words=await WordRecord.getAllToGame();
    const idioms=await IdiomRecord.getAllToGame();

    const allWords=(await WordRecord.getAll()).map(elem=>elem.word);
    const allIdioms=(await IdiomRecord.getAll()).map(elem=>elem.idiom);
    const allData=[...allIdioms,...allWords];

    const dataArr=[...words,...idioms];
    let chosenData:(WordRecord|IdiomRecord)[]=[];

    if(dataArr.length<=arrayLength){
        chosenData=dataArr;
    }
    else{
        for(let i=0;i<arrayLength;i++) {
            const random = Math.floor(Math.random() * dataArr.length);
            chosenData.push(dataArr[random]);
            dataArr.splice(random,1);
        }
    }

    //array to return
    let arrToGame:GameObj[]=[];
    let questionNo=1;

    //create 6 objects or less to arrToGame
    for(const element of chosenData){
        const answerCount=4;
        const meaning=element.meaning;
        const answersArr:string[]=[];
        let correctAnswer:string;

        //set correct answer depends on record type
        if(element instanceof WordRecord){
            correctAnswer=element.word;
            answersArr.push(element.word);
        }
        if(element instanceof IdiomRecord){
            correctAnswer=element.idiom;
            answersArr.push(element.idiom);
        }

        //arr without correct answer
        const arrToLottery=allData.filter(elem=>elem!=correctAnswer);
        //choose random answers from database
        for(let i=0;i<answerCount-1;i++){
            const index=Math.floor(Math.random()*arrToLottery.length);
            answersArr.push(arrToLottery[index]);
            arrToLottery.splice(index,1);
        }
        //mixing arr because correct answer is a first element of table
        const finalAnswersArr:string[]=[];

        for(let i=0;i<answerCount;i++){
            const index=Math.floor(Math.random()*answersArr.length);
            finalAnswersArr.push(answersArr[index]);
            answersArr.splice(index,1);
        }

        arrToGame.push({
            meaning,
            correctAnswer,
            answers:finalAnswersArr,
            questionNo
        })
        questionNo++;
    }
    return arrToGame;
}



export const checkAnswers=(gameArr:GameObj[],answers:string[]):GameChecked[]=>{
    const checkedArr:GameChecked[]=[];
    for(let i=0;i<gameArr.length;i++){
        if(gameArr[i].correctAnswer===answers[i]){
            checkedArr.push({
                ...gameArr[i],
                correct:true
            })
        }
        else{
            checkedArr.push({
                ...gameArr[i],
                correct:false
            })
        }
    }
    return checkedArr;
}

export const createFlashObjects=(words:WordRecord[],idioms:IdiomRecord[]):FlashObj[]=> {

    const flashNumber=20;

    const newWords = words.map(word => {
        return {
            learn: word.word,
            meaning: word.meaning
        }
    })
    const newIdioms = idioms.map(idiom=>{
        return{
            learn:idiom.idiom,
            meaning:idiom.meaning
        }
    })

    const newArr=newWords.concat(newIdioms);

    if(newArr.length<=flashNumber){
        return newArr;
    }
    else{
        const randomArr:FlashObj[]=[];
        const randomNumber=Math.floor(Math.random()*newArr.length);
        for(let i=0;i<newArr.length;i++){
            randomArr.push(newArr[randomNumber]);
            newArr.splice(randomNumber,1);
        }
        return randomArr;
    }
}
