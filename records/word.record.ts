import {v4 as uuid} from 'uuid';
import {pool} from "../utils/connection";
import {FieldPacket} from "mysql2";
import {SentenceRecord, SentenceResult} from "./sentence.record";
import {WordObject} from "../types/type";


type WordResult=[WordRecord[], FieldPacket[]];

export class WordRecord implements WordObject{
    id?:string;
    word:string;
    noun?:string;
    verb?:string;
    adjective?:string;
    meaning?:string;
    sentences?:string[]|null;

    constructor(obj:WordObject) {
        this.id=obj.id??uuid();
        this.word=obj.word;
        this.noun=obj.noun??null;
        this.verb=obj.verb??null;
        this.adjective=obj.adjective??null;
        this.meaning=obj.meaning??null;
        this.sentences=null??null;
    }
    async insert():Promise<string>{
        try{
            await pool.execute('insert into `word` Values(:id,:word,:verb,:noun,:adjective,:meaning)',{
                id:this.id,
                word:this.word,
                verb:this.verb,
                noun:this.noun,
                adjective:this.adjective,
                meaning:this.meaning
            });
            return this.id;
        }
        catch(e){
            console.log(e);
        }
    }
    async delete():Promise<void>{
        try{
            await pool.execute('Delete from `word` where `id`=:id',{
                id:this.id,
            });
        }
        catch (e){
            console.log(e);
        }
    }
    async update(obj:WordObject):Promise<void>{
        try{
            //check sentences
            await pool.execute('Update `word` set `word`.`word`=:word, `word`.`verb`=:verb, `word`.`noun`=:noun, `word`.`adjective`=:adjective, `word`.`meaning`=:meaning where `word`.`id`=:id',{
                word:obj.word,
                verb:obj.verb,
                noun:obj.noun,
                adjective:obj.adjective,
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
            const [results]=await pool.execute('Select `sentence` from `sentence` where `word_id`=:id', {
                id:this.id,
            }) as SentenceResult;
            this.sentences=results.map(obj=>obj.sentence);
        }
        catch(e){
            console.log(e);
        }
    }

    static async getOne(id:string):Promise<WordRecord|null>{
        try{
            const [results]=await pool.execute('select * from `word` where `id`=:id',{id}) as WordResult;
            return results.length>0? new WordRecord(results[0]):null;
        }
        catch(e){
            console.log(e);
        }
    }
    static async getAll():Promise<WordRecord[]>{
        try{
            const [results]=await pool.execute('select * from `word`') as WordResult;
            return results.map(obj=>new WordRecord(obj));
        }
        catch(e){
            console.log(e);
        }
    }
    static async getAllToGame():Promise<WordRecord[]>{
        const [results] = await pool.execute("Select * from `word` where `word`.`meaning` IS NOT NULL and `word`.meaning!=''") as WordResult;
        return results.map(obj=>new WordRecord(obj));
    }
}
