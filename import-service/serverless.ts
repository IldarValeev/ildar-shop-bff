import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
	service: 'ildar-eshop-import-product-service',
	frameworkVersion: '3',
	plugins: ['serverless-offline', 'serverless-esbuild'],
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
			BUCKET_NAME: '${self:custom.s3.bucketName}',
			UPLOADED_FOLDER: '${self:custom.s3.uploadedFolder}',
			PARSED_FOLDER: '${self:custom.s3.parsedFolder}',
			SQS_URL: '${self:custom.SQSUrl}',
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: [
							"s3:Listbucket",
						],
						Resource: [
							'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}',
						]
					},
					{
						Effect: 'Allow',
						Action: [
							"s3:*",
						],
						Resource: [
							'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*'
						]
					},
					// {
					// 	Effect: 'Allow',
					// 	Action: [
					// 		"s3:Get*",
					// 		"s3:List*",
					// 		"s3:PutObject",
					// 		"s3:PutObjectAcl",
					// 		"s3:DeleteObject"
					// 	],
					// 	Resource: ['arn:aws:s3:::${self:custom.s3.bucketName}/${self:custom.s3.uploadedFolder}/*', 'arn:aws:s3:::${self:custom.s3.bucketName}/${self:custom.s3.parsedFolder}/*']
					// }
					{
						Effect: 'Allow',
						Action: [
							'sqs:*'
						],
						Resource: [
							'${self:custom.SQSArn}',
						],
					},
				],
			},
		},
	},
	functions: {
		importProductsFile,
		importFileParser,
	},
	package: { individually: true },
	custom: {
		// sqsURL: 'https://sqs.eu-west-1.amazonaws.com/533267437859/ildarShopCatalogItemsQueue',
		// sqsARN: 'arn:aws:sqs:eu-west-1:533267437859:ildarShopCatalogItemsQueue',
		SQSUrl: {
			'Fn::ImportValue': 'SQSUrl',
		},
		SQSArn: {
			'Fn::ImportValue': 'SQSArn',
		},
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
		s3: {
			bucketName: 'ildar-e-shop-v1-import',
			uploadedFolder: 'uploaded',
			parsedFolder: 'parsed'
		}
	},
};

module.exports = serverlessConfiguration;
