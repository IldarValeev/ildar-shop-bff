import {getProductHandlerTest } from '@functions/get-product';

describe("[getProductHandler not crashed]", () => {
  it("should not crash", async () => {
    await getProductHandlerTest(null, null, null);
  });
});
