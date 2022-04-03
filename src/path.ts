import { path } from "./deps.ts";

export function substituteExtension(inPath: string, ext: string) {
  const pathObj = path.parse(inPath) as path.FormatInputPathObject;
  delete pathObj["base"];
  if (!ext.startsWith(".")) {
    ext = "." + ext;
  }
  pathObj.ext = ext;
  return path.format(pathObj);
}
