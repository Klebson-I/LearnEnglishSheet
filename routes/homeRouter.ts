import {Request, Response, Router} from 'express';
export const homeRouter=Router();

homeRouter.get('/',(req:Request,res:Response)=>{
    res.redirect('/home');
})

homeRouter.get('/home', (req:Request,res:Response)=>{
    res.render('home/home');
})
