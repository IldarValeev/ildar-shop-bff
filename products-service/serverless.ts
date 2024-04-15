import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

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
			SQS_URL: { 'Ref': '${self:custom.sqsLogicalResource}'},
			SNS_ARN: { 'Ref': '${self:custom.snsLogicalResource}'},
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
					{
						Effect: 'Allow',
						Action: [
							'sqs:*'
						],
						Resource: [
							{ 'Fn::GetAtt': ['${self:custom.sqsLogicalResource}', 'Arn'] },
						],
					},
					{
						Effect: 'Allow',
						Action: [
							'sns:*'
						],
						Resource: [
							{ 'Ref': '${self:custom.snsLogicalResource}'},
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
		createProduct,
		catalogBatchProcess,
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
			},
			SQSQueue: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: "ildarShopCatalogItemsQueue",
				}
			},
			SNSTopic: {
				Type: 'AWS::SNS::Topic',
				Properties: {
					TopicName: '${self:custom.snsTopicName}',
				}
			},
			SNSSubscription1: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Endpoint: '${self:custom.snsEmailEndpoint1}',
					Protocol: 'email',
					TopicArn: { 'Ref': '${self:custom.snsLogicalResource}'},
					FilterPolicyScope: 'MessageBody',
					FilterPolicy: {
						"price": ["79.99"]
					}
				}
			},
			SNSSubscription2: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Endpoint: '${self:custom.snsEmailEndpoint2}',
					Protocol: 'email',
					TopicArn: { 'Ref': '${self:custom.snsLogicalResource}'},
					FilterPolicyScope: 'MessageBody',
					FilterPolicy: {
						"count": ["20"]
					}
				}
			},			
		},
		Outputs: {
			SQSUrl: {
				Value: {
					Ref:  '${self:custom.sqsLogicalResource}',
				},
				Export: {
					Name: 'SQSUrl',
				}
			},
			SQSArn: {
				Value: {
					'Fn::GetAtt': ['${self:custom.sqsLogicalResource}', 'Arn']
				},
				Export: {
					Name: 'SQSArn',
				}
			}
		}
	}, 
	package: { individually: true },
	custom: {
		sqsLogicalResource: 'SQSQueue',
		snsLogicalResource: 'SNSTopic',
		snsTopicName: 'ILDAR-eshop-product-created',
		snsEmailEndpoint1: 'ildar189@gmail.com',
		snsEmailEndpoint2: 'mail_zzz@list.ru',
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
			typefiles: [
				'src/types/create-product.ts',
				'src/types/product.ts',
				'src/types/stock.ts',
			]
		}
	},
};

module.exports = serverlessConfiguration;
