import { Handler } from 'aws-lambda';
import Classifier from './classifier';
import config from './config.json'

const classifier = new Classifier(JSON.stringify(config))
export const handler: Handler = async (event: Event) => {
    const junk = await classifier.isSpam(event.subject);
    console.log(event.subject, "is", junk ? "spam" : "not spam")
    return {
        actions: [
            {
                action: {
                    type: junk ? "MOVE_TO_JUNK" : "DEFAULT"
                },
                allRecipients: true
            }
        ]
    }
};
interface Event {
    subject: string
    messageId: string
}
