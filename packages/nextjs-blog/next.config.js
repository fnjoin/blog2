const path = require("path");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: "export",
    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,
    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,
    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
    // this basically enables images to be served from a local static web server rather than some nextjs api
    images: {
        formats: ["image/webp"],
        loader: "custom",
        loaderFile:
            process.env.NODE_ENV === "development"
                ? "./my-image-server-loader.ts"
                : "my-simple-loader.ts",
    },
    webpack(config, constants) {
        // config.resolve.alias = {
        //     assets$: path.resolve(__dirname, "./public/assets/"),
        //     ...config.resolve.alias,
        // };
        // config.module.rules.push({
        //     test: /\.(png|jpe?g|gif|webp|jpg)$/i,
        //     use: [{ loader: "file-loader" }],
        // });
        // config.externals = {
        //     sharp: "commonjs sharp",
        // };
        // config.module.rules.push({
        //     test: /\.(png|jpe?g|jpg|webp|tiff?)/i,
        //     use: [
        //         {
        //             loader: "webpack-sharp-loader",
        //             options: {
        //                 toBuffer: true,
        //                 processFunction: (sharp) => {
        //                     return sharp.negate().webp();
        //                 },
        //                 // optional options passed to internal file-loader
        //                 fileLoaderOptions: {
        //                     name: "[name]-[contenthash].[ext]",
        //                 },
        //             },
        //         },
        //     ],
        // });

        return config; // return the modified config object
    },
};

module.exports = nextConfig;
