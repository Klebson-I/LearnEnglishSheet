import {Request, Response, Router} from "express";
import {checkAnswers, createGameObjects} from "../utils/utils";
import {GameObj} from "../types/type";
import {ValidationError} from "../utils/error";

//local variable contains array to check answers when user post his answer
let GAME_ARR:GameObj[];

export const playRouter=Router();

playRouter
    .get('/',async (req:Request,res:Response)=>{
        const gameArr=await createGameObjects();
        GAME_ARR=gameArr;
        console.log(gameArr);
        res.render("play/play",{
            game:gameArr
        });
    })
    .post('/check',(req:Request,res:Response)=>{
        const answerArr=Object.values(req.body) as string[];
        if(answerArr.length!=GAME_ARR.length){
            throw new ValidationError('Answer all questions before send test');
        }
        const checkedAnswers=checkAnswers(GAME_ARR,answerArr);
        const correctCount=checkedAnswers.filter(obj=>obj.correct===true).length;
        const totalCount=6;
        console.log(checkedAnswers);
        res.render("play/results",{
            checkedAnswers,
            correctCount,
            totalCount
        })
    })