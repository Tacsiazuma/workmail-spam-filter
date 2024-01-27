import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';

const path = require("node:path")

export class WorkmailSpamFilterStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: WorkmailSpamFilterStackProps) {
        super(scope, id, props);

        const logGroup = new logs.LogGroup(this, 'SpamFilterLogs', {
            retention: logs.RetentionDays.ONE_MONTH,
        })
        const spamBucket = new s3.Bucket(this, 'SpamBucket')
        const spamFilter = new nodejs.NodejsFunction(this, 'SpamFilter', {
            entry: path.join(__dirname, '../src/function/index.ts'),
            architecture: lambda.Architecture.ARM_64,
            functionName: 'SpamFilter',
            timeout: cdk.Duration.minutes(1),
            description: 'Lambda to handle spam messages',
            logGroup: logGroup,
            environment: {
                BUCKET_NAME: spamBucket.bucketName
            }
        });
        spamFilter.addToRolePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [spamBucket.bucketArn + '/*'],
        }));
        spamFilter.role.attachInlinePolicy(
            new iam.Policy(this, 'GetRawMessageContent', {
                statements: [
                    new iam.PolicyStatement({
                        actions: ['workmailmessageflow:GetRawMessageContent'],
                        resources: ['*'],
                    }),
                ],
            })
        );
        spamFilter.addPermission("AllowWorkMail", {
            action: "lambda:InvokeFunction",
            principal: new iam.ServicePrincipal(`workmail.${props.env.region}.amazonaws.com`),
            sourceArn: `arn:aws:workmail:${props.env.region}:${props.accountId}:organization/${props.organization}`,
            sourceAccount: props.accountId
        })
    }
}

export interface WorkmailSpamFilterStackProps extends cdk.StackProps {
    organization: string,
    accountId: string
}
