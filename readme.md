# Spamfilter lambda

CDK construct to create a synchronous lambda rule for workmail inbound messages.

It deploys a lambda and the permission for workmail to invoke it.

## Usage

Add it as a dependency:

    npm i workmail-spam-filter

Reference it: 

        import { WorkmailSpamFilterStack } from 'workmail-spam-filter'

        new WorkmailSpamFilterStack(app, 'WorkmailSpamFilterStack', {
            env: { account: '1234567890', region: 'eu-west-1' },
            organization: "m-123456789",
            accountId: "1234567890"
        });

Once deployed to the same account and region as the workmail organization, you can reference it on the UI as an synchrounous lambda inbound rule. Spam messages will be moved to the junk folder.

TODO:

- [ ] Add the ability to bounce spam messages
- [ ] Add automation to train on own data
- [ ] Add an S3 bucket to reference naive bayes classifier config from
