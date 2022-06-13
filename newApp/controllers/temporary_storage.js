class User {
    constructor (username, password, email) {
        this.username = username,
        this.password = password,
        this.email = email,
        this.preferred_language = null
    }
}

var userList = {}
var emailList = []

userA = new User("marck27", "password1", "m27@gmail.com")
userB = new User("benJ", "password2", "jamin@hotmail.com")
userList["marck27"] = userA
userList["benJ"] = userB
emailList.push("m27@gmail.com")
emailList.push("jamin@hotmail.com")