import { Handler } from 'aws-lambda';
import { isSpam } from './classifier';

export const handler: Handler = async (event: Event) => {
    const junk = await isSpam(event.subject);
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
}
