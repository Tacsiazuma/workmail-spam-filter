import { ContentRetriever } from "./workmail";

export class FakeContentRetriever implements ContentRetriever {
    async retrieve(messageId: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

