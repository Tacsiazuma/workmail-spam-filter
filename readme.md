# Spamfilter lambda

CDK construct to create a synchronous lambda rule for workmail inbound messages.

It deploys a lambda and the permission for workmail to invoke it.

## Usage

In your project add it as a dependency:

    npm i --save workmail-spam-filter

Reference it in the code: 

    import { WorkmailSpamFilterStack } from 'workmail-spam-filter'

    new WorkmailSpamFilterStack(app, 'WorkmailSpamFilterStack', {
        env: { account: '1234567890', region: 'eu-west-1' },
        organization: "m-123456789",
        accountId: "1234567890"
    });


To create an initial empty configuration for the classifier, run 

    npx workmail-spam-filter@latest init

and it will create a `config.json` in the folder `db` which will be deployed to S3. And then deploy it:

    cdk deploy

Once deployed to the same account and region as the workmail organization, you can reference it on the UI as an synchrounous lambda inbound rule. Spam messages will be moved to the junk folder.

TODO:

- [x] Add an S3 bucket to reference naive bayes classifier config from
- [x] Add CLI to create initial config
- [ ] Check the body of the message not just the subject
- [ ] Add the ability to bounce spam messages
- [ ] Add automation to train on own data
