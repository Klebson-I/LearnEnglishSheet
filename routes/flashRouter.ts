import {Request, Response, Router} from 'express';
import {WordRecord} from "../records/word.record";
import {SentenceRecord} from "../records/sentence.record";
import {IdiomRecord} from "../records/idiom.record";
import {createFlashObjects} from "../utils/utils";

export const flashRouter=Router();

flashRouter
    .get('/',async (req:Request,res:Response)=>{
        const word=await WordRecord.getAllToGame();
        const idioms=await IdiomRecord.getAllToGame();
        const flashArr=createFlashObjects(word,idioms);
        res.render('flash/flash',{
            flash:flashArr
        });
    })