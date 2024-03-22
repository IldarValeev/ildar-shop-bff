import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import productsData from 'src/data/products.json';
import { ProductsList } from 'src/types/product';


const getProducts:  APIGatewayProxyHandler  = async (event) => {
  console.info(`getProducts. Incoming event: ${JSON.stringify(event)}`);

  try{
    const productList = productsData as ProductsList;
    return formatJSONResponse(productList);
  }
  catch(e) {
    return formatJSONResponse({
      error: e.stack
    });  
  }
};

export const main = middyfy(getProducts);
export const getProductsHandler = getProducts;