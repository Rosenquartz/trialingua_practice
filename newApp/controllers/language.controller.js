class Language {
    constructor(alphabet, greetings, vocab_easy, vocab_hard) {
        this.alphabet = alphabet,
        this.greetings = greetings,
        this.vocab_easy = vocab_easy,
        this.vocab_hard = vocab_hard
        //this.grammar = grammar
    }
}

var languageList = {};

const controller = {
    getLanguageList: function(req, res) {
        res.status(200)
        res.end(JSON.stringify({
            language: languageList
        }))
    }
}

koreanAlphabet = {
    "ka": "가",
    "na": "나",
    "da": "다",
    "ra": "라",
    "ma": "마",
    "ba": "바",
    "sa": "사"
}
koreanGreetings = {
    "hello": "안녕",
    "bye": "안녕"
}
koreanVocabEasy = {
    "dog": "개",
    "human": "사람",
    "cat": "고야이",
    "cow": "소",
    "apple": "사과",
    "country": "나라"
}
koreanVocabHard = {
    "government": "정부",
    "society": "사회",
    "education": "교육"
}

koreanLang = new Language(koreanAlphabet, koreanGreetings, koreanVocabEasy, koreanVocabHard);
languageList["korean"] = koreanLang;

module.exports = controller;