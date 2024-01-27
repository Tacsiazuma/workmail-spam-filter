import { Handler } from 'aws-lambda';
import { SpamFilter } from './spamfilter';
import { S3Config } from './config/s3';
import { WorkMailContentRetriever } from './content/workmail'
import Classifier from './classifier';

const configuration = new S3Config(process.env.BUCKET_NAME)
const retriever = new WorkMailContentRetriever()
export const handler: Handler = async (event: Event) => {
    const objectContent = await configuration.get()
    const mimeText = await retriever.retrieve(event.messageId)
    const classifier = SpamFilter.create(new Classifier(objectContent))
    const junk = await classifier.isSpam(mimeText);
    console.log(event.messageId, "is", junk ? "spam" : "not spam")
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
    messageId: string
}
