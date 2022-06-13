// ==============================================================================
// =================================== User Controller ==========================
// ==============================================================================
const userController = {
    createUser: function(req, res) {
        // Check if any of the fields are missing.
        if (!req.body.username || !req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName) {
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
        userList[req.body.username] = new User(req.body.username, req.body.firstName, req.body.lastName, req.body.password, req.body.email);
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
        //console.log(user)
        //console.log(userList)
        if (!(user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User doesn't exist."
            }));
            return;
        }

        // Update fields but only if they are valid.
        for (var field in req.body) {
            if (!(field in userList[user])) {
                continue;
            }
            if (field == 'username') {
                continue;
            }
            if (!(field == 'email')) {
                userList[user][field] = req.body[field];
                continue;
            }
            // If the field is email, first check if it is in use.
            if (emailList.includes(req.body.email)) {
                continue;
            }

            // Next check email format.
            var regexp = /\S+@\S+\.\S+/;
            if (!regexp.test(req.body.email)) {
                continue;
            }

            // If email is valid, change it
            userList[user][field] = req.body[field];
        }
        console.log('=--------=')
        console.log(userList[user])
        res.status(200);
        res.end(JSON.stringify({
            username: userList[user].username,
            firstName: userList[user].firstName,
            lastName: userList[user].lastName,
            email: userList[user].email,
            preferredLanguage: userList[user].preferredLanguage
        }))
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
            firstname: userList[user].firstName,
            lastname: userList[user].lastName,
            email: userList[user].email,
            preferred_language: userList[user].preferred_language
        }))
    }
}

// ==============================================================================
// =================================== Language Controller ======================
// ==============================================================================
const languageController = {
    getLanguageList: function(req, res) {
        let languageArray = [];
        Object.keys(languageList).forEach(key => {
            languageArray.push(languageList[key].englishName);
        });
        res.status(200);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            languages: languageArray
        }))
    },
    getModuleList: function(req, res) {
        let languageId = req.params.languageId;
        if (!(languageId in languageList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Language not supported."
            }));
            return;
        }
        let language = languageList[languageId]
        let moduleArray = [];
        language.modules.forEach((mod)=>{
            moduleArray.push(mod.id);
        })
        res.status(200);
        res.end(JSON.stringify({
            modules: moduleArray
        }))
    },
    getItemList: function(req, res) {
        let languageId = req.params.languageId;
        let moduleId = req.params.moduleId;
        let language = languageList[languageId];

        //console.log(language.modules)
        let found = false;
        for (let mod of language.modules) {
            if (mod.id == moduleId) {
                moduleRequested = mod
                //console.log(moduleRequested);
                found = true;
                break;
            }
        }
        if (!found) {
            res.status(400)
            res.end(JSON.stringify({
                error: "Module does not exist"
            }))
            return;
        }

        // Check input parameters
        let numberRequested = 0;
        if (!req.query.number) {
            numberRequested = 2;
        } else {
            numberRequested = parseInt(req.query.number, 10);
            if (!Number.isInteger(numberRequested)) {
                numberRequested = 2;
            }
        }

        // Shuffle items
        let tempArray = []
        for (let item of moduleRequested.items) {
            tempArray.push(item)
        }
        tempArray = tempArray.sort(()=>Math.random()-0.5)
        let returnDictionary = {};
        let i = 0;
        for (let item of tempArray) {
            returnDictionary[item.native] = item.english
            i += 1
            if (i >= numberRequested) break;
        }
        
        res.status(200);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(returnDictionary))
    }
}

// ==============================================================================
// =================================== Progress Controller ======================
// ==============================================================================

const progressController = {
    languageProgress: function(req, res) {
        if (!req.query.user) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Empty user field"
            }));
            return;
        }
        if (!(req.query.user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User does not exist"
            }))
            return;
        }
        let language = req.params.language;
        if (!(language in languageList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Language not supported."
            }));
            return;
        }
        let lp = null;
        for (lp of userList[req.query.user]["progress"]) {
            if (lp.languageId == language) {break}
        }
        res.status(200)
        res.end(JSON.stringify({
            percentage: lp["percentage"]
        }))
    },
    moduleProgress: function(req, res) {
        if (!req.query.user) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Empty user field"
            }));
            return;
        }
        if (!(req.query.user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User does not exist"
            }))
            return;
        }
        let language = req.params.language;
        if (!(language in languageList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Language not supported."
            }));
            return;
        }
        
        let lp = null;
        for (lp of userList[req.query.user]["progress"]) {
            if (lp.languageId == language) {break}
        }
        
        let found = false;
        let mod = null
        for (mod of languageList[language].modules) {
            if (req.params.module == mod.id) {
                found = true;
                mod = req.params.module;
                break;
            }
        }
        if (!found) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Invalid module"
            }));
            return;
        }
        let modProgress = null
        for (modProgress of lp.modules) {
            if (modProgress.moduleId == req.params.module) {
                break;
            }
        }
        res.status(200)
        res.end(JSON.stringify({
            percentage: modProgress.percentage
        }));
    },
    itemProgress: function(req, res) {
        if (!req.query.user) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Empty user field"
            }));
            return;
        }
        if (!(req.query.user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User does not exist"
            }))
            return;
        }
        let language = req.params.language;
        if (!(language in languageList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Language not supported."
            }));
            return;
        }
        
        let lp = null;
        for (lp of userList[req.query.user]["progress"]) {
            if (lp.languageId == language) {break}
        }

        let found = false;
        let mod = null
        for (mod of languageList[language].modules) {
            if (req.params.module == mod.id) {
                found = true;
                mod = req.params.module;
                break;
            }
        }
        if (!found) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Invalid module"
            }));
            return;
        }
        let modProgress = null
        for (modProgress of lp.modules) {
            if (modProgress.moduleId == req.params.module) {
                break;
            }
        }
        let item = null;
        found = false;
        for (item of modProgress.items) {
            if (item.itemId == req.params.item) {
                found = true;
                break;
            }
        }
        if (!found) {
            res.status(400);
            res.end(JSON.stringify({error: "Invalid item"}));
            return;
        }
        console.log(item)
        res.status(200)
        res.end(JSON.stringify({
            user: item.userId,
            item: item.itemId,
            totalAttempts: item.totalAttempts,
            correctAttempts: item.correctAttempts,
            lastAttempt: item.lastAttempt
        }));
    },
    update: function(req, res) {
        if (!req.query.user) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Empty user field"
            }));
            return;
        }
        if (!(req.query.user in userList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "User does not exist"
            }))
            return;
        }
        let language = req.params.language;
        if (!(language in languageList)) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Language not supported."
            }));
            return;
        }

        let lp = null;
        for (lp of userList[req.query.user]["progress"]) {
            if (lp.languageId == language) {break}
        }

        let found = false;
        let mod = null;
        for (mod of languageList[language].modules) {
            if (req.params.module == mod.id) {
                found = true;
                mod = req.params.module;
                break;
            }
        }
        if (!found) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Invalid module"
            }));
            return;
        }
        let modProgress = null
        for (modProgress of lp.modules) {
            if (modProgress.moduleId == req.params.module) {
                break;
            }
        }
        let item = null;
        found = false;
        for (item of modProgress.items) {
            if (item.itemId == req.params.item) {
                found = true;
                break;
            }
        }
        if (!found) {
            res.status(400);
            res.end(JSON.stringify({error: "Invalid item"}));
            return;
        }
        item.totalAttempts += 1
        if (req.body.correct == 'true') item.correctAttempts += 1;
        item.lastAttempt = new Date();
        updateProgress(req.query.user);
        res.status(200)
        res.end(JSON.stringify({
            user: item.userId,
            item: item.itemId,
            totalAttempts: item.totalAttempts,
            correctAttempts: item.correctAttempts,
            lastAttempt: item.lastAttempt
        }));
    },
    getItems: function(req, res) {
        
    },
}

const updateProgress = function(userId) {
    user = userList[userId]
    let lp = null;
    let mp = null;
    for (lp of user.progress) {
        lp.percentage = 0;
        for (mp of lp.modules) {
            let denominator = 0;
            let numerator = 0;
            for (let item of mp.items) {
                denominator += 1;
                if (item.correctAttempts) numerator += 1;
            }
            mp.percentage = Math.round((numerator/denominator) * 1e4) / 1e2
            console.log(mp.percentage)
            lp.percentage += Math.round (mp.percentage / lp.modules.length)
            console.log(lp)
        }

    }
}

// ==============================================================================
// =================================== Values for Testing =======================
// ==============================================================================

class User {
    constructor (username, firstName, lastName, password, email) {
        this.username = username,
        this.firstName = firstName,
        this.lastName = lastName,
        this.password = password,
        this.email = email,
        this.preferredLanguage = null,
        this.progress = null
    }
}

class Language {
    constructor(id, nativeName, englishName, modules) {
        this.id = id;
        this.nativeName = nativeName;
        this.englishName = englishName;
        this.modules = modules;
    }
}

class Module {
    constructor(id, languageId, type, items) {
        this.id = id;
        this.languageId = languageId;
        this.type = type;
        this.items = items;
    }
}

class Item{
    constructor(id, moduleId, native, english) {
        this.id = id;
        this.moduleId = moduleId;
        this.native = native;
        this.english = english;
    }
}

class LanguageProgress {
    constructor(id, languageId, userId) {
        this.id = id,
        this.languageId = languageId,
        this.userId = userId,
        this.percentage = 0,
        this.modules = []
    }
}

class ModuleProgress {
    constructor(id, languageProgressId, moduleId, userId) {
        this.id = id,
        this.languageProgressId = languageProgressId,
        this.moduleId = moduleId,
        this.userId = userId,
        this.percentage = 0,
        this.items = []
    }
}

class ItemProgress {
    constructor(id, moduleProgressId, itemId, userId) {
        this.id = id,
        this.moduleProgressId = moduleProgressId,
        this.itemId = itemId,
        this.userId = userId,
        this.totalAttempts = 0,
        this.correctAttempts = 0,
        this.lastAttempt = null,
        this.weight = 0
    }
}

// ==============================================================================

var userList = {}
var emailList = []

userA = new User("marck27", "Ma", "Rck", "password1", "m27@gmail.com")
userB = new User("benJ", "Ben", "Jamin", "password2", "jamin@hotmail.com")
userList["marck27"] = userA
userList["benJ"] = userB
emailList.push("m27@gmail.com")
emailList.push("jamin@hotmail.com")

// ==============================================================================

krLanguage = new Language("kr", "한글", "Korean", []);
jpLanguage = new Language("jp", "日本語", "Japanese", []);

languageList = {
    kr: krLanguage,
    jp: jpLanguage
}

kr_alp = new Module("kr_alp", "kr", "alphabet", []);
kr_vocab_1 = new Module("kr_vocab_1", "kr", "vocabulary", []);
kr_vocab_2 = new Module("kr_vocab_2", "kr", "vocabulary", []);

kr_alp_1 = new Item("kr_alp_1", "kr_alp", "가", "ka");
kr_alp_2 = new Item("kr_alp_2", "kr_alp", "나", "na");
kr_alp_3 = new Item("kr_alp_3", "kr_alp", "다", "da");
kr_alp_4 = new Item("kr_alp_4", "kr_alp", "라", "ra");
kr_alp_5 = new Item("kr_alp_5", "kr_alp", "마", "ma");

kr_vocab_1_1 = new Item("kr_vocab_1_1", "kr_vocab_1", "사람", "human");
kr_vocab_1_2 = new Item("kr_vocab_1_2", "kr_vocab_1", "강아지", "dog");
kr_vocab_1_3 = new Item("kr_vocab_1_3", "kr_vocab_1", "고양이", "cat");
kr_vocab_1_4 = new Item("kr_vocab_1_4", "kr_vocab_1", "물", "water");
kr_vocab_1_5 = new Item("kr_vocab_1_5", "kr_vocab_1", "산", "mountain");

kr_vocab_2_1 = new Item("kr_vocab_2_1", "kr_vocab_2", "정부", "government");
kr_vocab_2_2 = new Item("kr_vocab_2_2", "kr_vocab_2", "사회", "society");
kr_vocab_2_3 = new Item("kr_vocab_2_3", "kr_vocab_2", "열정", "passion");
kr_vocab_2_4 = new Item("kr_vocab_2_4", "kr_vocab_2", "교육", "education");
kr_vocab_2_5 = new Item("kr_vocab_2_5", "kr_vocab_2", "복리후생", "wellbeing");

kr_alp.items = [kr_alp_1, kr_alp_2, kr_alp_3, kr_alp_4, kr_alp_5];
kr_vocab_1.items = [kr_vocab_1_1, kr_vocab_1_2, kr_vocab_1_3, kr_vocab_1_4, kr_vocab_1_5];
kr_vocab_2.items = [kr_vocab_2_1, kr_vocab_2_2, kr_vocab_2_3, kr_vocab_2_4, kr_vocab_2_5];

krLanguage.modules = [kr_alp, kr_vocab_1, kr_vocab_2];

// ==============================================================================

marck27LanguageProgress = new LanguageProgress("marck27_kr", "kr", "marck27");
marck27ModuleProgress1 = new ModuleProgress("marck27_kr_alp", "marck27_kr", "kr_alp", "marck27");
marck27UserProgress1_1 = new ItemProgress("mark_27_kr_alp_1", "mark27_kr_alp", "kr_alp_1", "marck27");
marck27UserProgress1_2 = new ItemProgress("mark_27_kr_alp_2", "mark27_kr_alp", "kr_alp_2", "marck27");
marck27UserProgress1_3 = new ItemProgress("mark_27_kr_alp_3", "mark27_kr_alp", "kr_alp_3", "marck27");
marck27UserProgress1_4 = new ItemProgress("mark_27_kr_alp_4", "mark27_kr_alp", "kr_alp_4", "marck27");
marck27UserProgress1_5 = new ItemProgress("mark_27_kr_alp_5", "mark27_kr_alp", "kr_alp_5", "marck27");
marck27ModuleProgress1.items = [marck27UserProgress1_1,marck27UserProgress1_2,marck27UserProgress1_3,marck27UserProgress1_4,marck27UserProgress1_5];
marck27ModuleProgress2 = new ModuleProgress("marck27_kr_vocab_1", "marck27_kr", "kr_vocab_1", "marck27");
marck27UserProgress2_1 = new ItemProgress("mark_27_kr_vocab_1_1", "mark_27_kr_vocab_1", "mark_27_kr_vocab_1_1", "marck27");
marck27UserProgress2_2 = new ItemProgress("mark_27_kr_vocab_1_2", "mark_27_kr_vocab_1", "mark_27_kr_vocab_1_2", "marck27");
marck27UserProgress2_3 = new ItemProgress("mark_27_kr_vocab_1_3", "mark_27_kr_vocab_1", "mark_27_kr_vocab_1_3", "marck27");
marck27UserProgress2_4 = new ItemProgress("mark_27_kr_vocab_1_4", "mark_27_kr_vocab_1", "mark_27_kr_vocab_1_4", "marck27");
marck27UserProgress2_5 = new ItemProgress("mark_27_kr_vocab_1_5", "mark_27_kr_vocab_1", "mark_27_kr_vocab_1_5", "marck27");
marck27ModuleProgress2.items = [marck27UserProgress2_1,marck27UserProgress2_2,marck27UserProgress2_3,marck27UserProgress2_4,marck27UserProgress2_5];
marck27ModuleProgress3 = new ModuleProgress("marck27_kr_vocab_2", "marck27_kr", "kr_vocab_2", "marck27");
marck27UserProgress3_1 = new ItemProgress("mark_27_kr_vocab_2_1", "mark_27_kr_vocab_2", "mark_27_kr_vocab_2_1", "marck27");
marck27UserProgress3_2 = new ItemProgress("mark_27_kr_vocab_2_2", "mark_27_kr_vocab_2", "mark_27_kr_vocab_2_2", "marck27");
marck27UserProgress3_3 = new ItemProgress("mark_27_kr_vocab_2_3", "mark_27_kr_vocab_2", "mark_27_kr_vocab_2_3", "marck27");
marck27UserProgress3_4 = new ItemProgress("mark_27_kr_vocab_2_4", "mark_27_kr_vocab_2", "mark_27_kr_vocab_2_4", "marck27");
marck27UserProgress3_5 = new ItemProgress("mark_27_kr_vocab_2_5", "mark_27_kr_vocab_2", "mark_27_kr_vocab_2_5", "marck27");
marck27ModuleProgress3.items = [marck27UserProgress3_1,marck27UserProgress3_2,marck27UserProgress3_3,marck27UserProgress3_4,marck27UserProgress3_5];
marck27LanguageProgress.modules.push(marck27ModuleProgress1);
marck27LanguageProgress.modules.push(marck27ModuleProgress2);
marck27LanguageProgress.modules.push(marck27ModuleProgress3);
userA.progress = [marck27LanguageProgress];


// ==============================================================================
// =================================== Exports ==================================
// ==============================================================================

module.exports = {
    userController: userController,
    languageController: languageController,
    progressController: progressController
}