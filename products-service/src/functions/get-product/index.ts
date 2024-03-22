import { handlerPath } from '@libs/handler-resolver'
// import { getProductHandler } from "./handler";

// export {getProductHandler as getProductHandlerTest};
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
      },
    },
  ],
};
