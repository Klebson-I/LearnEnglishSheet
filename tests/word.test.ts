import {WordRecord} from "../records/word.record";
import {pool} from "../utils/connection";


let wr:WordRecord;

beforeAll(()=>{
    wr = new WordRecord({
        word: "conspicuous",
        meaning: "To stand out, to be easily distinguishable"
    })
})

afterAll(async()=> {
    await pool.end()
});


test ('initialize WordRecord object id field should not be undefined and string' , () => {
    expect(wr.id).not.toBeUndefined();
    expect(typeof wr.id).toStrictEqual("string");
})

test ('inserted WordRecord should exist in database',async () => {
    const id = await wr.insert();
    const takenRecord = await WordRecord.getOne(id);
    expect(takenRecord).not.toBeNull();
    await takenRecord.delete();
})

test ("deleted word should not   in database",async () => {
    const id = await wr.insert();
    const takenRecord = await WordRecord.getOne(id);
    await takenRecord.delete();
    const takenDeleted = await WordRecord.getOne(id);
    expect(takenDeleted).toBeNull();
})