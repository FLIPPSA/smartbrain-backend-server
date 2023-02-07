import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex  from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleProfile } from './controllers/profile.js';
import { handleImage } from "./controllers/image.js";

const db = knex({
    client: 'pg',
    connection: {
      host : "{dpg-cfgnd9ta49926dvd2i5g-a.frankfurt-postgres.render.com}",
      user : "{smartbrain_e89q_user}",
      password : "{Tz75jMsblF6cyVjv9SZ5BvHqggqOtv0p}",
      database : "{smartbrain_e89q}",
      port : 5432,
      ssl: true
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('success') }) //on root route 
app.post('/signin', handleSignin(db, bcrypt));
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port 3000 ${process.env.PORT}`);
})

console.log(process.env)