import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const BACK_END_ERROR = "Backend Error"

const corsHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*"
};

export const formatJSONResponse = (response: any, statusCode: number = 200) => {
  return {
    statusCode,
    headers: {
      ...corsHeaders
    },
    body: JSON.stringify(response)
  }
}

export const formatJSONErrorResponse = (error: any, errorMessage: string = BACK_END_ERROR, statusCode: number = 500) => {
  return formatJSONResponse(
    {
      errorMessage,
      error,
    },
    statusCode
  );
}
