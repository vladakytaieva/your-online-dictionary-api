const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex');
const { format } = require('express/lib/response');

const dictionary = require("./controllers/dictionary")
const filters = require('./controllers/filters')
const user = require("./controllers/user")

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'potato',
      database : 'wreview'
    }
})

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/", (req, res) => res.status(200).json("hellooo"))

app.get('/dictionary/:id', (req, res) => {
    const { id }  = req.params
    db('dict').select('*')
        .where('userId', '=', id)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to get dictionary data'))
})

app.put('/dictionary/manage', (req, res) => filters.addFilter(req, res, db))

app.post('/dictionary/getdata', (req, res) => filters.getFilters(req, res, db))

app.put('/dictionary/delete-data', (req, res) => filters.deleteFilter(req, res, db))

app.put('/dictionary/add', (req, res) => dictionary.addWord(req, res, db))

app.put('/dictionary/edit', (req, res) => dictionary.editWord(req, res, db))

app.put('/dictionary/delete', (req, res) => dictionary.deleteWord(req, res, db))

app.post('/signin', (req, res) => user.singin(req, res, db, bcrypt))

app.post('/register', (req, res) => user.register(req, res, db, bcrypt))

app.put("/update-user", (req, res) => user.updateUser(req, res, db, bcrypt))

app.delete('/delete-user', (req, res) => user.deleteUser(req, res, db))

app.listen(process.env.PORT || 3001)