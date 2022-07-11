import express from "express";

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
//const knex = require('knex');

/*
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'loginformytvideo'
    }
})
**/

const PORT = 8080

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
})

app.get('/auth/', (req, res) => {
    res.sendFile(path.join(intialPath, "signup.html"));
})

app.get('/auth/signup_verification?email=<email-id>&token=token', (req, res) => {
    res.sendFile(path.join(intialPath, "signup-verification.html"));
})

app.post('/auth/signup-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        /*
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
        **/
    }
})

app.post('/signin-user', (req, res) => {
    const { email, password } = req.body;

    /*
    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
    **/
})

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});