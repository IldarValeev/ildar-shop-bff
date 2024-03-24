import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import productsData from 'src/data/products.json';
import { ProductsList as IProductsList } from 'src/types/product';

const getProductById: APIGatewayProxyHandler = async (event) => {
  console.info(`getProductById. Incoming event: ${JSON.stringify(event)}`);

  try {
    const { productId = '' } = event.pathParameters;
    const product = (productsData as IProductsList).find(product => product.id === productId);

    if (product) {
      return formatJSONResponse({
        product: product,
      });
    }

    return formatJSONResponse({ message: `Product '${productId}' not found` }, 404);
  }
  catch (e) {
    return formatJSONResponse({
      error: e.stack
    });
  }
};

export const main = middyfy(getProductById);