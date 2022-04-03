import { Denomander } from "./src/deps.ts";
import { parse } from "./src/parse.ts";
import { runWasm } from "./src/run.ts";
import { parseBrainfuck, translate } from "./src/translate.ts";
import { CodeGenerator } from "./src/wasmgen.ts";
import { substituteExtension } from "./src/path.ts";

const program = new Denomander({
  app_name: "trnsfck",
});

program
  .command("compile [files...]", "compile given input files")
  .action(({ files }: { files: string[] }) => {
    for (const file of files) {
      const fileText = Deno.readTextFileSync(file);
      const generator = new CodeGenerator();
      generator.addOperations(parse(fileText));
      const outName = substituteExtension(file, "wasm");
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
  const outPath = substituteExtension(file, "trans");

  Deno.writeTextFileSync(outPath, outText);
});

if (import.meta.main) {
  program.parse(Deno.args);
}
