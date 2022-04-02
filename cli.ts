import { Denomander } from "./src/deps.ts";
import { parse } from "./src/parse.ts";
import { runWasm } from "./src/run.ts";
import { parseBrainfuck, translate } from "./src/translate.ts";
import { CodeGenerator } from "./src/wasmgen.ts";
import { path } from "./src/deps.ts";

const program = new Denomander({
  app_name: "trnsfck",
});

program
  .command("compile [files...]", "compile given input files")
  .action(({ files }: { files: string[] }) => {
    for (const file of files) {
      const baseName = file.replace(".trans", "");
      const fileText = Deno.readTextFileSync(file);
      const generator = new CodeGenerator();
      generator.addOperations(parse(fileText));
      const outName = baseName + ".wasm";
      Deno.writeFileSync(outName, generator.compileBinary());
    }
  });

program.command("run [file]").action(async ({ file }: { file: string }) => {
  const bin = Deno.readFileSync(file);
  await runWasm(bin);
});

program.command("translate [file?]").action(({ file }: { file: string }) => {
  const fileText = Deno.readTextFileSync(file);
  console.log("fileText");
  console.log(fileText);

  const outText = translate(parseBrainfuck(fileText));

  const filePath = path.parse(file) as path.FormatInputPathObject;
  filePath.ext = ".trans";
  delete filePath["base"];
  const outfilePath = path.format(filePath);
  Deno.writeTextFileSync(outfilePath, outText);
});

if (import.meta.main) {
  program.parse(Deno.args);
}
