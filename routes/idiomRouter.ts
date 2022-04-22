import {Request, Response, Router} from 'express';
import {IdiomRecord} from '../records/idiom.record';
import {checkDotsInSentences, createSentences, returnWithSentences, updateSentences} from '../utils/utils';
import {IdiomObj, recordType} from "../types/type";

export const idiomRouter=Router();

idiomRouter
    .get('/',async (req:Request,res:Response)=>{
    const idioms=await IdiomRecord.getAll();
    const idiomsWithSentences=await returnWithSentences(idioms);
    const finalIdioms=checkDotsInSentences(idiomsWithSentences);
    res.render('idiom/idiom',{
        idioms:finalIdioms
    })
    })
    .get('/add',(req:Request,res:Response)=>{
        res.render('idiom/add');
    })
    .get('/:id',async(req:Request,res:Response)=>{
        const {id}=req.params;
        const idiom=await IdiomRecord.getOne(id);
        await  idiom.findSentences();
        res.render('idiom/edit',{
            ...idiom
        })
    })
    .post('/',async(req:Request,res:Response)=>{
        const obj:IdiomObj=req.body;
        const sentences=obj.sentences;
        //validation of sentence

        const newObj={
            ...obj,
            sentences
        }

        const newIdiom=new IdiomRecord(newObj);

        const insertedId=await newIdiom.insert();

        await createSentences(sentences, insertedId,recordType.idiom);

        res.render('idiom/added',{
            idiom:newIdiom.idiom
        });
    })
    .delete("/:id",async(req:Request, res:Response) => {
        const {id} = req.params;
        const idiom=await IdiomRecord.getOne(id);
        await idiom.delete();
        res.redirect('/idiom');
    })
    .put('/:id',async(req:Request,res:Response)=>{
        const obj:IdiomObj=req.body;
        const idiom=await IdiomRecord.getOne(req.params.id);
        await idiom.update(obj);
        await updateSentences(obj,idiom.id,recordType.idiom);

        res.render('idiom/updated',{
            idiom:obj.idiom
        });
    })

