const singin = (req, res, db, bcrypt) => {
    const { email, password } = req.body
    db('login')
        .select('email', 'hash')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return db('users')
                    .select('*')
                    .where('email', '=', email)
                    .then(user => {
                        db('dict').select('*')
                            .where('userid', '=', user[0].id)
                            .orderBy('id', 'asc')
                            .then(data => {
                                res.json({
                                    dict: data,
                                    ...user[0]
                                })
                            })
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

const register = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return db('users')
                .returning('*')
                .join('dict', 'users.id', 'dict.userid')
                .insert({
                    email: loginEmail[0],
                    name: name
                })
                .then(user => {
                    db('dict').select('*')
                            .where('userid', '=', user[0].id)
                            .then(data => {
                                res.json({
                                    dict: data,
                                    ...user[0]
                                })
                            })
                })
        })
        .then(trx.commit)
        .catch(err => {
            console.log("rollback: \n", err)
            trx.rollback
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).json("User with this email already exists!")
    })
}

const updateUser = (req, res, db, bcrypt) => {
    const { id, name, password } = req.body
    const hash = password.length > 0 && bcrypt.hashSync(password)
    db('users')
    .where('id', '=', id)
    .update({
        name: name
    }, ['*'])
    .then(data => {
        if (hash) {
            db('login')
                .where('email', '=', data[0].email)
                .update({
                    hash: hash
                })
                .then(d => {
                    res.json(data[0].name)
                })
                .catch(err => console.log(err))
        } else {
            res.json(data[0].name)
        }
    })
    .catch(err => res.status(400).json("Failed to update user"))
}

const deleteUser = (req, res, db) => {
    const { id } = req.body
    db.transaction(trx => {
        trx('users')
            .where('id', '=', id)
            .returning('email')
            .del()
            .then(email => {
                return db('login')
                    .where('email', '=', email[0])
                    .del()
                    .then(result => {
                        res.status(200).json("User was deleted successfully")
                    })
                    .catch(err => console.log(err))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("Failed to delete user"))
}

module.exports = {
    singin,
    register,
    updateUser,
    deleteUser
}