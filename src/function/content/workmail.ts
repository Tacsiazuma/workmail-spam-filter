import { WorkMailMessageFlow, GetRawMessageContentCommand, PutRawMessageContentCommand } from '@aws-sdk/client-workmailmessageflow'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid';
export interface ContentRetriever {
    retrieve(messageId: string): Promise<string>
}

const bucket = process.env.BUCKET_NAME
const client = new WorkMailMessageFlow();
const s3 = new S3Client()
export class WorkMailContentRetriever implements ContentRetriever {
    async retrieve(messageId: string): Promise<string> {
        const command = new GetRawMessageContentCommand({
            messageId
        });
        const result = await client.send(command)
        return await result.messageContent.transformToString("utf-8");
    }

    async update(messageId: string, content: string): Promise<void> {
        const key = await this.putToS3(content)
        const command = new PutRawMessageContentCommand({
            messageId,
            content: {
                s3Reference: {
                    key,
                    bucket
                }
            }
        });
        const result = await client.send(command)
        console.log(result)
    }
    private async putToS3(content: string): Promise<string> {
        const Key = uuidv4()
        const command = new PutObjectCommand({
            Key,
            Bucket: bucket,
            Body: content
        });
        await s3.send(command)
        return Key;
    }
}

