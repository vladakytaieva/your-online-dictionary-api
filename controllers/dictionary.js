const addWord = (req, res, db) => {
    const { id, word, transcription, translation, category, tableName  } = req.body
    db('dict')
        .returning('*')
        .insert({
            word: word,
            transcription: transcription,
            translation: translation,
            userid: id,
            category: category,
            tablename: tableName
        })
        .then(dict => {
            return db('dict').select('*').where('userid', '=', id).orderBy('id')
            .then(data => res.json(data))
            .catch(console.log)
        })
        .catch(err => res.status(400).json("couldn't add new word"))
}

const editWord = (req, res, db) => {
    const { id, wid, word, transcription, translation, category, tableName } = req.body
    db('dict')
        .where('id', '=', wid)
        .returning('*')
        .update({
            word: word,
            transcription: transcription,
            translation: translation,
            category: category,
            tablename: tableName
        })
        .then(d => {
            return db('dict').select('*')
                .where('userid', '=', id)
                .orderBy('id', 'asc')
                .then(data => {
                    res.json(data)
                })
                .catch(console.log)
        })  
        .catch(console.log)
}

const deleteWord = (req, res, db) => {
    const { id, wid } = req.body
    db('dict')
        .where('id', '=', wid)
        .del()
        .then(d => {
            return db('dict').select('*')
                .where('userid', '=', id)
                .orderBy('id', 'asc')
                .then(data => res.json(data))
                .catch(err => res.status(400).json('unable to get dictionary'))
        })
        .catch(err => console.log(err))
}

module.exports = {
    addWord,
    editWord,
    deleteWord
}