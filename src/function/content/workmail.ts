import { WorkMailMessageFlow, GetRawMessageContentCommand } from '@aws-sdk/client-workmailmessageflow'
export interface ContentRetriever {
    retrieve(messageId: string): Promise<string>
}

const client = new WorkMailMessageFlow();
export class WorkMailContentRetriever implements ContentRetriever {
    async retrieve(messageId: string): Promise<string> {
        const command = new GetRawMessageContentCommand({
            messageId
        });
        const result = await client.send(command)
        return await result.messageContent.transformToString("utf-8");
    }
}

