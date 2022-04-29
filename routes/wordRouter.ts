import {Request, Response, Router} from "express";
import {WordRecord} from '../records/word.record';
import {checkDotsInSentences, createSentences, returnWithSentences, updateSentences} from '../utils/utils'; //dodać update sentences
import {recordType, WordObject} from "../types/type";

export const wordRouter=Router();

wordRouter
    .get('/',async (req:Request,res:Response)=>{
        const words=await WordRecord.getAll();
        const wordsWithSentences=await returnWithSentences(words) as WordRecord[];
        const finalWords=checkDotsInSentences(wordsWithSentences) as WordRecord[];

        res.render('word/words',{
            words:finalWords
        });
    })
    .get('/add',(req:Request,res:Response)=>{
        res.render('word/add');
    })
    .get('/:id',async(req:Request,res:Response)=>{
        const {id}=req.params;
        const word=await WordRecord.getOne(id);
        await  word.findSentences();
        res.render('word/edit',{
            ...word
        })
    })
    .delete('/:id',async (req:Request,res:Response)=>{
        const {id} = req.params;
        const word=await WordRecord.getOne(id);
        await word.delete();
        //if(affectedRows===0)throw new ValidationError('Nie znaleziono takiego słowa');
        res.redirect('/word');
    })
    .post('/',async(req:Request,res:Response)=>{
        let obj:WordObject=req.body;
        const sentences=obj.sentences;
        //validation of sentence

        const newObj={
            ...obj,
            sentences
        }

        const newWord=new WordRecord(newObj);

        const insertedId=await newWord.insert();

        await createSentences(sentences, insertedId,recordType.word);

        res.render('word/added',{
            word:newWord.word
        });
    })
    .put('/:id',async (req:Request,res:Response)=>{
        const obj:WordObject=req.body;
        const word=await WordRecord.getOne(req.params.id);
        await word.update(obj);
        await updateSentences(obj,word.id,recordType.word);

        res.render('word/updated',{
            word:obj.word
        });
    })
