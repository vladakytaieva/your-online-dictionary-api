const addWord = (req, res, db) => {
    const { id, word, transcription, translation } = req.body
    db('dict')
        .returning('*')
        .insert({
            word: word,
            transcription: transcription,
            translation: translation,
            userId: userId
        })
        .then(dict => {
            return db('dict').select('*').where('userid', '=', id).orderBy('id')
            .then(data => res.json(data))
        })
        .catch(err => res.status(400).json("couldn't add new word"))
}

const editWord = (req, res, db) => {
    const { id, wid, word, transcription, translation, category, tableName } = req.body
    db('dict')
        .where('id', '=', wid)
        .update({
            word: word,
            transcription: transcription,
            translation: translation,
            category: category,
            tableName: tableName
        }, ['*'])
        .then(d => {
            return db('dict').select('*')
                .where('userid', '=', id)
                .orderBy('id', 'asc')
                .then(data => {
                    res.json(data)
                })
        })  
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