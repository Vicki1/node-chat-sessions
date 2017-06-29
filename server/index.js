const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const session= require('express-session');
const app = express();
const createInitialSession=require(`${__dirname}/middlewares/session.js`)
const filter=require(`${__dirname}/middlewares/filter.js`);
app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use(session({
    secret: 'asd;flasdflsjlf',
    resave: false,
    saveUnitialized: false,
    cookie: {maxAge: 1000}
}));
app.use((req,res,next)=>createInitialSession(req,res,next));
app.use((req,res,next)=>{
    const {method}= req;
    if (method === "POST" || method === "PUT"){
        filter(req,res,next);
    }
    else {
        next();
    }
});

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(`${messagesBaseUrl}/history`, mc.history );
const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
