import { formatJSONErrorResponse, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDbService } from 'src/data/db/db-service/products-dynamo-db-service';
import schema from './schema';

const SOURCE = `Lambda [getProductsList] -`

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const productsDbService = new ProductsDbService();

  try {
    const productList = await productsDbService.getProductsList();

    return formatJSONResponse(productList);
  }
  catch (e) {
    return formatJSONErrorResponse(e, SOURCE);
  }
  finally {
    productsDbService?.delete;
    console.log(`${SOURCE} finished`);
  }
};

export const main = middyfy(getProductsList);