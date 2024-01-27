import { Handler } from 'aws-lambda';
import Classifier from './classifier';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const bucketName = process.env.BUCKET_NAME

const client = new S3Client()
export const handler: Handler = async (event: Event) => {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: "config.json" })
    const response = await client.send(command)
    const objectContent = await response.Body.transformToString('utf-8')
    const classifier = new Classifier(objectContent)
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
