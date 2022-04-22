import {WordRecord} from "../records/word.record";
import {pool} from "../utils/connection";

afterAll(async()=> {
    await pool.end()
});

beforeAll(()=>{
    //wyczysc baze danych
    //zwroc przewidywalne dane

})

test ('initialize WordRecord object id field should not be undefined and string' , () => {
    const wr = new WordRecord({
        word: "conspicuous",
        meaning: "To stand out, to be easily distinguishable"
    })
    expect(wr.id).not.toBeUndefined();
    expect(typeof wr.id).toStrictEqual("string");
})

test ('inserted WordRecord should exist in database',async () => {
    const wr = new WordRecord({
        word: "conspicuous",
        meaning: "To stand out, to be easily distinguishable"
    })
    const id = await wr.insert();
    const takenRecord = await WordRecord.getOne(id);
    expect(takenRecord).not.toBeNull();
    expect(typeof takenRecord).toStrictEqual("object");
    await takenRecord.delete();
})

test ("deleted word should not exist in database",async () => {
    const wr = new WordRecord({
        word: "test"
    })
    const id = await wr.insert();
    const takenRecord = await WordRecord.getOne(id);
    await takenRecord.delete();
    const takenDeleted = await WordRecord.getOne(id);
    expect(takenDeleted).toBeNull();
})