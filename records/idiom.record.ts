import {pool} from "../utils/connection";
import {v4 as uuid} from 'uuid';
import {SentenceRecord, SentenceResult} from "./sentence.record";
import {FieldPacket} from "mysql2";
import {IdiomObj, WordObject} from "../types/type";



type IdiomResults=[IdiomRecord[],FieldPacket[]];



export class IdiomRecord implements IdiomObj{
    id?:string;
    idiom:string;
    sentences?:string[]|null|string;
    meaning?:string;
    constructor(obj:IdiomObj) {
        this.id=obj.id??uuid();
        this.idiom=obj.idiom;
        this.sentences=null;
        this.meaning=obj.meaning??null;
    }

    async insert():Promise<string>{
        try{
            await pool.execute('Insert into `idiom` Values(:id,:idiom,:meaning)',{
                id:this.id,
                idiom:this.idiom,
                meaning:this.meaning
            })
            return this.id;
        }
        catch (e){
            console.log(e);
        }
    }

    async delete():Promise<void>{
        try{
            await pool.execute('Delete from `idiom` where `id`=:id',{
                id:this.id,
            });
        }
        catch (e){
            console.log(e);
        }
    }
    async update(obj:IdiomObj):Promise<void>{
        try{
            //check sentences
            await pool.execute('Update `idiom` set `idiom`.`idiom`=:idiom, `idiom`.`meaning`=:meaning where `idiom`.`id`=:id',{
                idiom:obj.idiom,
                meaning:obj.meaning,
                id:this.id
            });
        }
        catch (e){
            console.log(e);
        }
    }

    async findSentences():Promise<void>{
        try{
            const [results]=await pool.execute('Select `sentence` from `sentence` where `idiom_id`=:id', {
                id:this.id,
            })as SentenceResult;
            this.sentences=results.map(obj=>obj.sentence);
        }
        catch(e){
            console.log(e);
        }
    }

    static async getOne(id:string):Promise<IdiomRecord>{
        try{
            const [results]=await pool.execute('select * from `idiom` where `id`=:id',{id}) as IdiomResults;
            return new IdiomRecord(results[0]);
        }
        catch(e){
            console.log(e);
        }
    }
    static async getAll():Promise<IdiomRecord[]>{
        try{
            const [results]=await pool.execute('select * from `idiom`') as IdiomResults;
            return results.map(obj=>new IdiomRecord(obj));
        }
        catch(e){
            console.log(e);
        }
    }
    static async getAllToGame():Promise<IdiomRecord[]>{
        const [results] = await pool.execute("Select * from `idiom` where `idiom`.`meaning` IS NOT NULL and `idiom`.meaning!=''") as IdiomResults;
        return results.map(obj=>new IdiomRecord(obj));
    }
}
