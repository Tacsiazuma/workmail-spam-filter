import { AddressObject, simpleParser } from 'mailparser'
import Classifier from './classifier'
export class SpamFilter {
    private classifier: Classifier
    private whitelisted: RegExp | undefined
    constructor(classifier?: Classifier, options? : SpamFilterOptions) {
        if (classifier) {
            this.classifier = classifier
        }
        else {
            this.classifier = new Classifier
        }
        if (options) {
            this.whitelisted = options.whitelisted
        }
    }
    async isSpam(mimeText: string): Promise<boolean> {
        if (!mimeText) {
            throw new Error('mimeText cannot be empty')
        }
        const parsedMail = await simpleParser(mimeText)
        const whitelistedAddress = this.whitelistedAddress(parsedMail.to as AddressObject)
        return !whitelistedAddress || !parsedMail.subject || !parsedMail.text ||
            this.classifier.isSpam(parsedMail.subject + " " + parsedMail.text)
    }
    static create(classifier?: Classifier, options?: SpamFilterOptions) {
        return new SpamFilter(classifier, options)
    }
    whitelistedAddress(to: AddressObject): boolean {
        if (!this.whitelisted) {
            return true
        }
        return to.text.match(this.whitelisted) != null;
    }
}

export interface SpamFilterOptions {
    whitelisted: RegExp
}
