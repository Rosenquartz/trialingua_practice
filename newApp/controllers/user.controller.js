const shortid = require('shortid')

class User {
    constructor(username, password, languages) {
        this.username = username,
        this.password = password,
        this.languages = languages
    }
}

var userList = {}

const controller = {
    postUser: function(req, res) {
        res.status(200).json({
            newUser: req.body
        })
    },
    putUser: function(req, res) {
        res.status(200).json({
            print: 'yes'
        })
    },
    getUsers: function(req, res) {
        res.status(200).json({
            users: userList
        })
    }
}

userA = new User('Chocolate', 'icecream', ['German'])
userList['firstuser'] = userA

module.exports = controller;