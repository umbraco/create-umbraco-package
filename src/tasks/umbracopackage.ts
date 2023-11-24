import chalk from "chalk";
import fs from "fs";
import path from "path";

export async function umbracoPackageManifest(
  answers: any,
  folderName: string,
  folderPath: string
) {
  // Copy the file from the template folder
  const packageFolderPath = path.join(process.cwd(), folderName);

  console.log(
    `Creating umbraco package file: ${chalk.green(packageFolderPath)}`
  );

  // Use import.meta Module to help get the correct path
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#getting_current_modules_file_path
  const umbracoPackageJsonPath = new URL(
    path.join("..", "scaffolds", "umbracopackagejson", "umbraco-package.json"),
    import.meta.url
  );

  // Copy the entire vite folder
  //fs.cpSync(packageFolderPath, packageFolderPath, { recursive: true });

  const rawData = fs.readFileSync(umbracoPackageJsonPath);
  let jsonStr = rawData.toString();

  jsonStr = jsonStr.replace("##folderName##", folderName);
  jsonStr = jsonStr.replace("##packageName##", answers.packageName);
  jsonStr = jsonStr.replace(
    "##packageAlias##",
    "alias-yes-to-me-defined-or-generated"
  );

  fs.writeFile(
    path.join(packageFolderPath, "umbraco-package.json"),
    jsonStr,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}
