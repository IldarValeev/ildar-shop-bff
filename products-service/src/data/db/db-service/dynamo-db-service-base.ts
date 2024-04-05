import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DeleteCommandInput, DeleteCommandOutput, DynamoDBDocumentClient, GetCommand, GetCommandInput, GetCommandOutput, PutCommand, PutCommandInput, PutCommandOutput, ScanCommand, ScanCommandOutput, TransactWriteCommand, UpdateCommand, UpdateCommandInput, UpdateCommandOutput, } from '@aws-sdk/lib-dynamodb';
import { ScanCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/ScanCommand';
import { TransactWriteCommandInput, TransactWriteCommandOutput, } from '@aws-sdk/lib-dynamodb/dist-types/commands/TransactWriteCommand';

const DEFAULT_REGION = 'eu-west-1';

export abstract class DynamoDbService {
    private dynamoDBDocumentClient: DynamoDBDocumentClient;

    public constructor(region: string = DEFAULT_REGION) {
        const dynamodbClient: DynamoDBClient = new DynamoDBClient({
            region,
        });

        this.dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamodbClient);
    }

    public async get(params: GetCommandInput): Promise<GetCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new GetCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public async create(params: PutCommandInput): Promise<PutCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new PutCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public async update(params: UpdateCommandInput): Promise<UpdateCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new UpdateCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public async scan(params: ScanCommandInput): Promise<ScanCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new ScanCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public async delete(params: DeleteCommandInput): Promise<DeleteCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new DeleteCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public async transactionWrite(params: TransactWriteCommandInput): Promise<TransactWriteCommandOutput> {
        try {
            return await this.dynamoDBDocumentClient.send(new TransactWriteCommand(params));
        } catch (error) {
            throw new Error(error);
        }
    };

    public destroy():void{
        this.dynamoDBDocumentClient?.destroy();
    }
}