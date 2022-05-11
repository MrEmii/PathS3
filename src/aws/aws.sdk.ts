import awsS3 from "aws-sdk/clients/s3";

const region = "sa-east-1";

export const s3 = new awsS3({
  region,
});
