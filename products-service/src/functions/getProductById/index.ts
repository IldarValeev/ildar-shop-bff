import { handlerPath } from '@libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        responses: {
          200: {
            description: 'successfull response',
            bodyType: 'Product',
          },
          404: {
						description: 'Producut by id was not found',
						bodyType: 'String',
					}
        },
      },
    },
  ],
};
