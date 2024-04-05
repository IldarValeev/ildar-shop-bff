import { ValidatedEventAPIGatewayProxyEvent, formatJSONErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDbService } from 'src/data/db/db-service/products-dynamo-db-service';
import schema from './schema';

const SOURCE = `Lambda [createProduct] -`

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`${SOURCE} started`); 
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const productsDbService = new ProductsDbService();

  try {
    const createProductObj = event.body;
    const product = await productsDbService.createProduct(createProductObj);

    return formatJSONResponse({
      product: product,
    });
  }
  catch (e) {
    return formatJSONErrorResponse(e, SOURCE);
  }
  finally {
    productsDbService.destroy();
  }
};

export const main = middyfy(createProduct);