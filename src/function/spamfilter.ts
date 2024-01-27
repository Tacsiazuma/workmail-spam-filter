import { simpleParser } from 'mailparser'
import Classifier from './classifier'
export class SpamFilter {
    private classifier: Classifier
    constructor(classifier?: Classifier) {
        if (classifier) {
            this.classifier = classifier
        }
        else {
            this.classifier = new Classifier
        }
    }
    async isSpam(mimeText: string): Promise<boolean> {
        if (!mimeText) {
            throw new Error('mimeText cannot be empty')
        }
        const parsedMail = await simpleParser(mimeText)
        return !parsedMail.subject || !parsedMail.text ||
            this.classifier.isSpam(parsedMail.subject + " " + parsedMail.text)
    }
    static create(classifier?: Classifier) {
        return new SpamFilter(classifier)
    }
}
