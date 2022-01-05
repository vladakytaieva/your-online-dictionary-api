const addFilter = (req, res, db) => {
    const { id, value, name } = req.body
    db(name)
        .returning('*')
        .insert({
            value: value,
            userid: id 
        })
        .then(ans => {
            return db(name).select('*').where('userid', '=', id).orderBy('id')
            .then(data => {
                const values = data.map(el => el.value)
                res.json(values)
            })
            .catch(console.log)
        })
        .catch(err => res.status(400).json(`problems with updating ${name}`))
}

const getFilters = (req, res, db) => {
    const { id } = req.body
    db('tables')
        .select('value')
        .where('userid', '=', id)
        .then(tables => {
            return db('categories')
                .select('value')
                .where('userid', '=', id)
                .then(categories => {
                    res.json({
                        tables: tables.map(el => el.value),
                        categories: categories.map(el => el.value)
                    })
                })
                .catch(err => res.json('error getting categories'))
        })
        .catch(err => res.json('error getting tables'))
}

const deleteFilter = (req, res, db) => {
    const { id, value, name } = req.body
    db(name)
        .where({
            userid: id,
            value: value
        })
        .del(['*'])
        .then(data => {
            return db(name).select('*')
                .where('userid', '=', id)
                .then(data => res.json(data.map(el => el.value)))
                .catch(err => res.json('error deleting category or table'))
        })
        .catch(console.log)
}

module.exports = {
    addFilter,
    getFilters,
     deleteFilter
}