import * as express from 'express';
import 'express-async-errors';
import {engine} from 'express-handlebars';
import * as methodOverride from 'method-override';
import {idiomRouter} from "./routes/idiomRouter";
import {wordRouter} from "./routes/wordRouter";
import {homeRouter} from "./routes/homeRouter";
import {errorHandle} from "./utils/error";
import {helpers} from "./utils/utils";
import {playRouter} from "./routes/playRouter";
import {flashRouter} from "./routes/flashRouter";
import {WordRecord} from "./records/word.record";



const app=express();

app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine({helpers:helpers}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(methodOverride("_method"));

app.use('/',homeRouter);
app.use('/word',wordRouter);
app.use('/idiom',idiomRouter);
app.use('/play',playRouter);
app.use('/flash',flashRouter);

app.use(errorHandle);
app.listen(3000);



