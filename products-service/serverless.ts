import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';

const serverlessConfiguration: AWS = {
	service: 'ildar-eshop-products-service',
	frameworkVersion: '3',
	plugins: ['serverless-auto-swagger', 'serverless-offline', 'serverless-esbuild'],
	provider: {
		name: 'aws',
		runtime: 'nodejs18.x',
		region: 'eu-west-1',
		httpApi: {
			cors: true,
		},
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			PRODUCTS_TABLE_NAME: '${self:resources.Resources.ProductsTable.Properties.TableName}',
			STOCKS_TABLE_NAME: '${self:resources.Resources.StocksTable.Properties.TableName}',
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: [
							'dynamodb:DescribeTable',
							'dynamodb:Query',
							'dynamodb:Scan',
							'dynamodb:GetItem',
							'dynamodb:PutItem',
							'dynamodb:UpdateItem',
							'dynamodb:DeleteItem',
						],
						Resource: [
							{ 'Fn::GetAtt': ['${self:provider.environment.PRODUCTS_TABLE_NAME}', 'Arn'] },
							{ 'Fn::GetAtt': ['${self:provider.environment.STOCKS_TABLE_NAME}', 'Arn'] },
						],
					},
				],
			},
		},
	},
	
	// import the function via paths
	functions: {
		getProductsList,
		getProductById,
	},
	resources: {
		Resources: {
			ProductsTable: {
				Type: 'AWS::DynamoDB::Table',
				DeletionPolicy: 'Delete',
				Properties: {
					TableName: 'ProductsTable',
					AttributeDefinitions: [
						{ AttributeName: 'id', AttributeType: 'S' },
					],
					KeySchema: [
						{ AttributeName: 'id', KeyType: 'HASH' },
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
			StocksTable: {
				Type: 'AWS::DynamoDB::Table',
				DeletionPolicy: 'Delete',
				Properties: {
					TableName: 'StocksTable',
					AttributeDefinitions: [
						{ AttributeName: 'product_id', AttributeType: 'S' },
					],
					KeySchema: [
						{ AttributeName: 'product_id', KeyType: 'HASH' },
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			}
		}
	},
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node18',
			define: { 'require.resolve': undefined },
			platform: 'node',
			concurrency: 10,
		},
		autoswagger: {
			typefiles: ['src/types/product.ts']
		}
	},
};

module.exports = serverlessConfiguration;
