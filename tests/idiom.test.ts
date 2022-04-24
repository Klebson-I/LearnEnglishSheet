import {IdiomRecord} from "../records/idiom.record";
import {pool} from "../utils/connection";


let idiom : IdiomRecord;

beforeAll(()=>{
    idiom = new IdiomRecord({
        idiom:"Testing"
    })
})

afterAll(async()=>{
    await pool.end();
})

test ('created idiom should has defined id',()=>{
    expect(idiom.id).toBeDefined();
})

test('inserted idiom should exist in database',async()=>{
    const id =await idiom.insert();
    const record = await IdiomRecord.getOne(id);
    expect(record).toBeDefined();
    await record.delete();
})

test('deleted idiom shouldnt exist in database',async()=>{
    const id =await idiom.insert();
    const record = await IdiomRecord.getOne(id);
    await record.delete();
    const deletedRecord = await IdiomRecord.getOne(id);
    expect(deletedRecord).toBeNull();
})

test('updated record should be different than before updating',async ()=>{
    const id =await idiom.insert();
    const record = await IdiomRecord.getOne(id);
    const oldRecord = {...record};
    await record.update({
        idiom:"Updated Testing"
    })
    const newRecord = await IdiomRecord.getOne(id);
    expect(newRecord).not.toBe(oldRecord);
    await newRecord.delete();
})