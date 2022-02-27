import {pool} from '../utils/connection';
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {SentenceObj} from "../types/type";



export type SentenceResult=[SentenceRecord[],FieldPacket[]];

export class SentenceRecord implements SentenceObj{
    id?:string;
    sentence:string;
    word_id?:string;
    idiom_id?:string;

    constructor(obj:SentenceObj) {
        this.id=obj.id??uuid();
        this.sentence=obj.sentence;
        this.word_id=obj.word_id??null;
        this.idiom_id=obj.idiom_id??null;
    }

    async insert():Promise<string>{
        try{
            await pool.execute('Insert into `sentence` values(:id,:word_id,:idiom_id,:sentence)',{
                id:this.id,
                word_id:this.word_id,
                idiom_id:this.idiom_id,
                sentence:this.sentence
            })
            return this.id;
        }
        catch(e){
            console.log(e)
        }
    }
    async delete():Promise<void>{
        try{
            await pool.execute('Delete from `sentence` where `id`=:id',{
                id:this.id,
            })
        }
        catch (e){
            console.log(e);
        }
    }
    static async getOne(id:string):Promise<SentenceRecord>{
        try{
            const [result]=await pool.execute('select * from `sentence` where `id`=:id',{
                id
            }) as SentenceResult;
            return new SentenceRecord(result[0]);
        }
        catch (e){
            console.log(e);
        }
    }
    static async getAllByWord(word_id:string):Promise<SentenceRecord[]>{
        try{
            const [result]=await pool.execute('select * from `sentence` where `word_id`=:word_id',{
                word_id
            }) as SentenceResult;
            return result.length===1?[new SentenceRecord(result[0])]:result.map(elem=>new SentenceRecord(elem));
        }
        catch (e){
            console.log(e);
        }
    }
    static async getAllByIdiom(idiom_id:string):Promise<SentenceRecord[]>{
        try{
            const [result]=await pool.execute('select * from `sentence` where `idiom_id`=:idiom_id',{
                idiom_id
            }) as SentenceResult;
            return result.length===1?[new SentenceRecord(result[0])]:result.map(elem=>new SentenceRecord(elem));
        }
        catch (e){
            console.log(e);
        }
    }
}
