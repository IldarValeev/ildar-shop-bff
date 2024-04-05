import { handlerPath } from '@libs/handler-resolver'
import schema from './schema';

export default {
	handler: `${ handlerPath(__dirname) }/handler.main`,
	events: [
		{	
			http: {
				method: 'POST',
				cors: true,
				path: '/products',
				request: {
					schemas: {
						'application/json': schema,
					},
				},
				bodyType: 'ICreateProduct',
				responses: {
					default: {},
					200: {
						description: 'Created product',
						bodyType: 'IProduct',
					},
					400: 'Bad Request',
					500: 'Backend Error',
				},
			},
		},
	],
};