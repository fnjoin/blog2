import { javascript } from "projen";
import { monorepo } from "@aws/pdk";
import { GatsbyTypescriptAppProject } from "./blueprints/GatsbyTypescriptAppProject";
import { NextJsBlogTypescriptAppProject } from "./blueprints/NextjsBlogStarter";
import { TypeScriptAppProject } from "projen/lib/typescript";
import { TypeScriptModuleResolution } from "projen/lib/javascript";

const packageManager = javascript.NodePackageManager.PNPM;
const defaultReleaseBranch = "main";
const prettier = {
    prettier: true,
    prettierOptions: {
        settings: {
            tabWidth: 4,
            singleQuote: false,
        },
    },
};
const parent = new monorepo.MonorepoTsProject({
    devDeps: ["@aws/pdk"],
    name: "trypandocandgatsby",
    packageManager,
    projenrcTs: true,
    defaultReleaseBranch,
    ...prettier,
});
parent.gitignore.addPatterns("packages/gatsby-remark-tufte");

new TypeScriptAppProject({
    name: "@archieco/gatsby-remark-tufte",
    outdir: "packages/gatsby-remark-tufte",
    authorName: "Jeff Rafter",
    authorEmail: "jeffrafter@gmail.com",
    packageManager,
    defaultReleaseBranch,
    sampleCode: false,
    parent,
    ...prettier,
    tsconfig: {
        compilerOptions: {
            allowJs: true,
            target: "esnext",
            skipLibCheck: true,
        },
        include: ["src/**/*.js"],
    },
    deps: Object.entries({
        "html-parse-stringify": "^1.0.3",
        "remark-parse": "^4.0.0",
        unified: "^6.1.6",
        retext: "^5.0.0",
        speakingurl: "^14.0.1",
        "unist-builder": "^1.0.2",
        "hast-util-to-html": "^3.1.0",
        "mdast-util-to-hast": "^2.5.0",
        "unist-util-select": "^1.5.0",
        "unist-util-visit": "^1.2.0",
    }).map(([name, version]) => `${name}@${version}`),
});

const purple = new TypeScriptAppProject({
    name: "@archieco/gatsby-remark-purple",
    outdir: "packages/gatsby-remark-purple",
    packageManager,
    defaultReleaseBranch,
    sampleCode: false,
    parent,
    ...prettier,
    tsconfig: {
        compilerOptions: {
            allowJs: true,
            target: "esnext",
            skipLibCheck: true,
        },
        include: ["src/**/*.js"],
    },
    deps: Object.entries({
        "html-parse-stringify": "^1.0.3",
        "remark-parse": "^4.0.0",
        unified: "^6.1.6",
        retext: "^5.0.0",
        speakingurl: "^14.0.1",
        "unist-builder": "^1.0.2",
        "hast-util-to-html": "^3.1.0",
        "mdast-util-to-hast": "^2.5.0",
        "unist-util-select": "^1.5.0",
        "unist-util-visit": "^1.2.0",
    }).map(([name, version]) => `${name}@${version}`),
});
purple.package.addField("main", "lib/index.js");

new GatsbyTypescriptAppProject({
    name: "gatsby-site",
    outdir: "packages/gatsby-site",
    packageManager,
    defaultReleaseBranch,
    parent,
    ...prettier,
    deps: [
        "@archieco/gatsby-remark-purple@workspace:*",
        "gatsby-transformer-remark",
        "gatsby-source-filesystem",
    ],
});

new NextJsBlogTypescriptAppProject({
    name: "nextjs-blog",
    outdir: "packages/nextjs-blog",
    packageManager,
    defaultReleaseBranch,
    parent,
    sampleCode: true,
    ...prettier,
});

const tests = new TypeScriptAppProject({
    name: "unittests",
    outdir: "packages/unittests",
    packageManager,
    defaultReleaseBranch,
    parent,
    sampleCode: true,
    tsconfig: {
        compilerOptions: {
            target: "esnext",
            module: "esnext",
            types: ["node", "jest"],
            esModuleInterop: true,
            moduleResolution: TypeScriptModuleResolution.NODE,
            // lib: ["esnext", "es2019", "es2020", "es2018"],
        },
    },
    devDeps: ["@jest/globals", "@types/hast"],
    ...prettier,
    deps: [
        "mdast-util-directive",
        "mdast-util-to-markdown",
        "mdast-util-from-markdown",
        "mdast-util-to-hast@^13",
        "hast-util-to-html@^9",
        "micromark-extension-directive",
        "rehype-document@^7",
        "rehype-format@^5",
        "rehype-stringify@^10",
        "remark-parse@^11",
        "remark-rehype@^11",
        "unified@^11",
        "remark-directive@^3",
        "hastscript",
        "unist-util-visit@^5",
    ],
    jestOptions: {
        jestConfig: {
            extensionsToTreatAsEsm: [".ts"],
            moduleNameMapper: {
                "^(\\.{1,2}/.*)\\.js$": "$1",
            },
        },
    },
    tsJestOptions: {
        transformPattern: "^.+\\.ts$",
        transformOptions: {
            useESM: true,
        },
    },
});

tests.tsconfig?.file.addOverride("ts-node", {
    transpileOnly: true,
    files: true,
    experimentalResolver: true,
});

//  --updateSnapshot removed from default settings
tests.testTask.reset("jest --passWithNoTests", {
    receiveArgs: true,
});
tests.testTask.spawn(tests.tasks.tryFind("eslint")!);
tests.testTask.env("NODE_OPTIONS", "--inspect --experimental-vm-modules");
tests.package.file.addOverride("type", "module");
const [{ exec: projenrcCommand = "" }] = tests.defaultTask!.steps;
tests.defaultTask!.reset(projenrcCommand.replace("ts-node", "ts-node-esm"));

// https://gist.github.com/doublecompile/324afb33b6038526705dfebb3b529e42

parent.synth();
