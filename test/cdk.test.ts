import * as cdk from 'aws-cdk-lib';
const app = new cdk.App()
import { WorkmailSpamFilterStack } from '../src/index'

describe('CDK', () => {
    it('should demonstrate usage', async () => {
        new WorkmailSpamFilterStack(app, 'WorkmailSpamFilterStack', {
            env: { account: '1234567890', region: 'eu-west-1' },
            organization: "m-123456789",
            accountId: "1234567890"
        });
    })

})
