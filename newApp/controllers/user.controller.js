const controller = {
    createUser: function(req, res) {
        // Check if any of the fields are missing.
        if (!req.body.username || !req.body.password || !req.body.email || req.body.firstName || req.body.lastName) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Insufficient information."
            }));
            return;
        }

        // Check if username is in use.
        if (req.body.username in userList) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Username is already in use."
            }));
            return;
        }

        // Check if email is in use.
        if (emailList.includes(req.body.email)) {
            console.log('EMAIL IN EMAILLIST')
            res.status(400); 
            res.end(JSON.stringify({
                error: "Email is already in use."
            }));
            return;
        }

        // Check email format.
        var regexp = /\S+@\S+\.\S+/;
        if (!regexp.test(req.body.email)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Invalid email format."
            }));
            return;
        }

        // Otherwise, everything checks out; next step is to make user.
        userList[req.body.username] = new User(req.body.username, req.body.password, req.body.email);
        emailList.push(req.body.email)
        console.log(emailList)
        res.status(200);
        res.end(JSON.stringify({
            newUser: req.body
        }))
    },
    updateUser: function(req, res) {
        const user = req.params.userId;

        // Check if user exists
        if (!(user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User doesn't exist."
            }));
            return;
        }

        // Update fields but only if they are correct.
        for (var field in req.body) {
            if (field == 'username') {
                continue;
            }
            if (!(field in userList[user])) {
                continue;
            }
            console.log(field);
        }
    },
    getUserList: function(req, res) {
        // Return array of usernames
        let userArray = Object.keys(userList)
        res.status(200).json({
            users: userArray
        })
    },
    getUserProfile: function(req, res) {
        const user = req.params.userId;

        // Check if user exists
        if (!(user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User doesn't exist."
            }));
            return;
        }

        // Return username, email, pref. language, and (later) progress
        res.status(200);
        res.end(JSON.stringify({
            username: userList[user].username,
            email: userList[user].email,
            preferred_language: userList[user].preferred_language
        }))
    },
    getUserProgress: function(req, res) {
        ;
    },
    getModuleQuestions: function(req, res) {
        
    }
}



// Temporary class for testing.


module.exports = controller;