import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const client = new S3Client()
export class S3Config implements Config {
    private bucketName: string
    constructor(bucketName: string) {
        this.bucketName = bucketName
    }
    async get(): Promise<string> {
        const command = new GetObjectCommand({ Bucket: this.bucketName, Key: "config.json" })
        const response = await client.send(command)
        return await response.Body.transformToString('utf-8')
    }
}
export interface Config {
    get(bucketName: string): Promise<string>
}
