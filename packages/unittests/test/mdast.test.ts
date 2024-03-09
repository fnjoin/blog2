import { test } from "@jest/globals";
import {
    directiveFromMarkdown,
    directiveToMarkdown,
} from "mdast-util-directive";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { directive } from "micromark-extension-directive";

test("mdast", () => {
    // read a file synchronously
    // const doc = fs.readFileSync("example.md", "utf8");
    // const doc = await fs.readF("example.md");
    const doc = `A lovely language know as :abbr[HTML]{title="HyperText Markup Language"}.`;

    const tree = fromMarkdown(doc, {
        extensions: [directive()],
        mdastExtensions: [directiveFromMarkdown()],
    });

    console.log(tree);

    const out = toMarkdown(tree, { extensions: [directiveToMarkdown()] });

    console.log(out);
});
