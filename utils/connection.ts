import {createPool} from 'mysql2/promise';

export const pool=createPool({
    user:"root",
    database:"english_word",
    host:"localhost",
    namedPlaceholders:true,
    decimalNumbers:true
})

