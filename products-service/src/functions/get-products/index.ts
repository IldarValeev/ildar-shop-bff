import { handlerPath } from '@libs/handler-resolver';
// import { getProductsHandler } from "./handler";

// export { getProductsHandler as getProductsHandlerTest };

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
      },
    },
  ],
};
