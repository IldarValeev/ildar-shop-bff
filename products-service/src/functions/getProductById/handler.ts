import { ValidatedEventAPIGatewayProxyEvent, formatJSONErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDbService } from 'src/data/db/db-service/products-dynamo-db-service';
import schema from './schema';

const SOURCE = `Lambda [getProductById] -`

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const productsDbService = new ProductsDbService();

  try {
    const { productId = '' } = event.pathParameters;
    const product = await productsDbService.getProductById(productId);

    if (product) {
      return formatJSONResponse({
        product: product,
      });
    }

    return formatJSONResponse({ message: `Product '${productId}' not found` }, 404);
  }
  catch (e) {
    return formatJSONErrorResponse(e, SOURCE);
  }
  finally {
    productsDbService.destroy();
  }
};

export const main = middyfy(getProductById);