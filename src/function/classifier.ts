const bayes = require('bayes')
const fs = require('fs')
const path = require('path')
const config = require('./config.json')
const classifier: Classifier = bayes.fromJson(JSON.stringify(config));

interface Classifier {
    learn(text: string, category: string): Promise<void>
    categorize(text: string): Promise<string>
    toJson(): string
    fromJson(state: string): Classifier
}

export async function isSpam(text: string): Promise<boolean> {
    return await classifier.categorize(text) === "spam"
}
export async function train(text: string, spam: boolean): Promise<void> {
    await classifier.learn(text, spam ? "spam" : "non_spam")
    fs.writeFileSync(path.join("config.json"), classifier.toJson())
}
