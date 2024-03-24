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
		},
	},
	// import the function via paths
	functions: {
		getProductsList,
		getProductById,
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
