const bayes = require('bayes')

interface Bayes {
    learn(text: string, category: string): Promise<void>
    categorize(text: string): Promise<string>
    toJson(): string
    fromJson(state: string): Bayes
}
enum Categories {
    NON_SPAM = "non_spam", SPAM = "spam"
}

export default class Classifier {
    private readonly bayes: Bayes
    constructor(config?: string) {
        if (!config) {
            this.bayes = bayes()
        } else
            this.bayes = bayes.fromJson(config)
    }
    async isSpam(text: string): Promise<boolean> {
        return await this.bayes.categorize(text) === Categories.SPAM
    }
    async train(text: string[], spam: boolean): Promise<void> {
        for (const i in text) {
            await this.bayes.learn(text[i], spam ? Categories.SPAM : Categories.NON_SPAM)
        }
    }
    export(): string {
        return this.bayes.toJson()
    }
}
