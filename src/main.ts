import * as $FS from "fs";
import fs from "fs/promises";
import path from "path";
import { s3 } from "./aws/aws.sdk";

const folderPath = process.argv[2];

if (!folderPath) throw new Error("No folder path provided");

const finalPaths = Array<string>();

//async main function
async function main() {
  await readFiles(folderPath);
  console.log(finalPaths);

  await Promise.all(
    finalPaths.map((filePath) => {
      const fileName = filePath
        .split("/")
        .slice(folderPath.split("/").length)
        .join("/");
      const fileStream = $FS.createReadStream(filePath);
      return s3
        .upload({
          Bucket: "bucket",
          Key: fileName,
          Body: fileStream,
          ContentType: "image/jpg",
        })
        .promise();
    })
  );
}

async function readFiles(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await readFiles(path.join(dir, file.name));
    }
    if (file.isFile()) {
      finalPaths.push(path.join(dir, file.name));
    }
  }
}

main().finally(() => {
  process.exit(0);
});
