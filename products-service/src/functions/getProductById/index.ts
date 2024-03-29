import { handlerPath } from '@libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        responses: {
          default: {},
          200: {
            description: 'Product returned by id',
            bodyType: 'Product',
          },
          404: {
						description: 'Product by id was not found',
						bodyType: 'String',
					},
          500: 'Backend Error',
        },
      },
    },
  ],
};
