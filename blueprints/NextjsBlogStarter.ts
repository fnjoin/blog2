import { SampleDir, SampleFile } from "projen";
import {
    TypeScriptJsxMode,
    TypeScriptModuleResolution,
} from "projen/lib/javascript";
import {
    TypeScriptAppProject,
    TypeScriptProjectOptions,
} from "projen/lib/typescript";

export class NextJsBlogTypescriptAppProject extends TypeScriptAppProject {
    constructor(options: TypeScriptProjectOptions) {
        const defaultDeps = Object.entries({
            classnames: "^2.5.1",
            "date-fns": "^3.3.1",
            "gray-matter": "^4.0.3",
            next: "14.1.0",
            react: "^18",
            "react-dom": "^18",
            remark: "^15.0.1",
            "remark-html": "^16.0.1",
        }).map(([key, value]) => `${key}@${value}`);

        const defaultDevDeps = Object.entries({
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            autoprefixer: "^10.0.1",
            postcss: "^8",
            tailwindcss: "^3.3.0",
            typescript: "^5",
            "eslint-config-next": "^14",
            "@next/eslint-plugin-next": "^14",
        }).map(([key, value]) => `${key}@${value}`);

        defaultDeps.push("http-server");

        super({
            ...options,
            deps: [...defaultDeps, ...(options.deps ?? [])],
            devDeps: [...defaultDevDeps, ...(options.devDeps ?? [])],
            tsconfig: {
                compilerOptions: {
                    lib: ["dom", "dom.iterable", "esnext"],
                    allowJs: true,
                    skipLibCheck: true,
                    strict: true,
                    noEmit: true,
                    esModuleInterop: true,
                    module: "esnext",
                    moduleResolution: TypeScriptModuleResolution.BUNDLER,
                    resolveJsonModule: true,
                    isolatedModules: true,
                    jsx: TypeScriptJsxMode.PRESERVE,
                    incremental: true,
                    rootDir: ".",
                    paths: {
                        "@/*": ["./src/*"],
                    },
                },
                include: [
                    "next-env.d.ts",
                    "**/*.ts",
                    "**/*.tsx",
                    ".next/types/**/*.ts",
                ],
                exclude: ["node_modules"],
            },
            sampleCode: false,
        });
        this.eslint?.addExtends("next/core-web-vitals");

        this.tsconfig?.file.addOverride(
            "compilerOptions.plugins",

            [
                {
                    name: "next",
                },
            ],
        );

        this.addTask("serve", {
            exec: "http-server out",
        });
        this.addTask("dev", {
            exec: "next",
        });
        this.addTask("start", {
            exec: "next start",
        });
        this.removeTask("build");
        this.removeTask("package");
        this.addTask("package", {
            exec: "next build",
        });
        this.addTask("build", {
            description: "Full release build",
            steps: [
                {
                    spawn: "pre-compile",
                },
                {
                    spawn: "compile",
                },
                {
                    spawn: "post-compile",
                },
                {
                    spawn: "test",
                },
                {
                    spawn: "package",
                },
            ],
        });

        this.gitignore.addPatterns(".vercel");
        this.gitignore.addPatterns(".next");
        this.gitignore.addPatterns("out");

        if (options.sampleCode) {
            new SampleDir(this, "src", {
                sourceDir: `${__dirname}/nextjs-blog-starter-app/src`,
            });
            new SampleDir(this, "_posts", {
                sourceDir: `${__dirname}/nextjs-blog-starter-app/_posts`,
            });
            new SampleDir(this, "public", {
                sourceDir: `${__dirname}/nextjs-blog-starter-app/public`,
            });
            new SampleFile(this, "next-env.d.ts", {
                sourcePath: `${__dirname}/nextjs-blog-starter-app/next-env.d.ts`,
            });
            new SampleFile(this, "tailwind.config.ts", {
                sourcePath: `${__dirname}/nextjs-blog-starter-app/tailwind.config.ts`,
            });
            new SampleFile(this, "postcss.config.js", {
                sourcePath: `${__dirname}/nextjs-blog-starter-app/postcss.config.js`,
            });
        }
    }
}
