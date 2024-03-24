import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import productsData from 'src/data/products.json';
import { ProductsList } from 'src/types/product';

const getProductsList: APIGatewayProxyHandler = async (event) => {
  console.info(`getProductsList. Incoming event: ${JSON.stringify(event)}`);

  try {
    const productList = productsData as ProductsList;
    return formatJSONResponse(productList);
  }
  catch (e) {
    return formatJSONResponse({
      error: e.stack
    });
  }
};

export const main = middyfy(getProductsList);