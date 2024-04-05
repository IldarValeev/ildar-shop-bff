import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        responses: {
          default: {},
          200: {
            description: 'List of all products',
            bodyType: 'ProductsList',
          },
          500: 'Backend Error',
        },
      },
    },
  ],
};
