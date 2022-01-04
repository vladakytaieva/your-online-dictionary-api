const addFilter = (req, res, db) => {
    const { id, value, name } = req.body
    db(name)
        .returning('*')
        .insert({
            value: value,
            userId: id 
        })
        .then(ans => {
            db(name).select('*').where('userId', '=', id).orderBy('id')
            .then(data => {
                const values = data.map(el => el.value)
                res.json(values)
            })
        })
        .catch(err => res.status(400).json(`problems with updating ${name}`))
}

const getFilters = (req, res, db) => {
    const { id } = req.body
    db('tables')
        .select('value')
        .where('userId', '=', id)
        .then(tables => {
            db('categories')
                .select('value')
                .where('userId', '=', id)
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
            userId: id,
            value: value
        })
        .del(['*'])
        .then(data => {
            db(name).select('*')
                .where('userId', '=', id)
                .then(data => res.json(data.map(el => el.value)))
                .catch(err => res.json('error deleting category or table'))
        })
}

module.exports = {
    addFilter,
    getFilters,
     deleteFilter
}