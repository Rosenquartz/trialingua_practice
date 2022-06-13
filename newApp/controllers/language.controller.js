const controller = {
    getLanguageList: function(req, res) {
        let languageArray = [];
        Object.keys(languageList).forEach(key => {
            languageArray.push(languageList[key].name);
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
        for (const mod of language.modules) {
            if (mod.id == moduleId) {
                moduleRequested = mod
                //console.log(moduleRequested);
                break;
            }
        }

        console.log(moduleRequested);
        if (!(language.modules.includes(moduleId))) {
            res.status(400);
            res.end(JSON.stringify({
                error: "Module does not exist."
            }))
        }
        
    }
}


// Temporary class for testing
class Language {
    constructor(id, name, modules) {
        this.id = id;
        this.name = name;
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

krLanguage = new Language("kr", "Korean", []);
jpLanguage = new Language("jp", "Japanese", []);

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

kr_vocab_2_1 = new Item("kr_vocab_2_1", "kr_vocab_2", "사람", "human");
kr_vocab_2_2 = new Item("kr_vocab_2_2", "kr_vocab_2", "강아지", "dog");
kr_vocab_2_3 = new Item("kr_vocab_2_3", "kr_vocab_2", "고양이", "cat");
kr_vocab_2_4 = new Item("kr_vocab_2_4", "kr_vocab_2", "물", "water");
kr_vocab_2_5 = new Item("kr_vocab_2_5", "kr_vocab_2", "산", "mountain");

kr_alp.items = [kr_alp_1, kr_alp_2, kr_alp_3, kr_alp_4, kr_alp_5];
kr_vocab_2.items = [kr_vocab_2_1, kr_vocab_2_2, kr_vocab_2_3, kr_vocab_2_4, kr_vocab_2_5];
kr_vocab_1.items = [kr_vocab_1_1, kr_vocab_1_2, kr_vocab_1_3, kr_vocab_1_4, kr_vocab_1_5];

krLanguage.modules = [kr_alp, kr_vocab_1, kr_vocab_2]

languageList = {
    kr: krLanguage,
    jp: jpLanguage
}

module.exports = controller;