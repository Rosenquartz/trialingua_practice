const shortid = require('shortid')

class User {
    constructor (username, password, languages, sid) {
        this.username = username,
        this.password = password,
        this.languages = languages,
        this.sid = sid
    }
}

var userList = {}
var shortIdList = {}

const controller = {
    postUser: function(req, res) {
        if (!req.body.username || !req.body.password || !req.body.languages) {
            console.log('Empty Username or Password');
            res.status(400);
            res.end(JSON.stringify({
                error: "Insufficient info."
            }))
        }
        if (req.body.username in userList) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Existing user."
            }))
        }
        //step 3 verify email
        newShortId = shortid.generate().toLowerCase();
        shortIdList[newShortId] = req.body.username;
        userList[req.body.username] = new User(req.body.username, req.body.password, req.body.languages,newShortId);
        res.status(200);
        res.end(JSON.stringify({
            newUser: req.body,
            sid: newShortId
        }))

    },
    putUser: function(req, res) {
        res.status(200).json({
            print: 'yes'
        })
    },
    getUsers: function(req, res) {
        let userArray = [] //populate with items of userlist
        res.status(200).json({
            users: userList // array of 
        })
    }
    //getUser
}

userA = new User('Chocolate', 'icecream', ['German'], 's7eup99')
userList['Chocolate'] = userA
shortIdList['choco'] = 'Chocolate'

module.exports = controller;