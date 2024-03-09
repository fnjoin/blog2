import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `my-site-name`,
        siteUrl: `https://www.yourdomain.tld`,
    },
    // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
    // If you use VSCode you can also use the GraphQL plugin
    // Learn more at: https://gatsby.dev/graphql-typegen
    graphqlTypegen: true,
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/../../content`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `@archieco/gatsby-remark-purple`,
                        // Specify options here
                        options: {
                            // Options for `gatsby-remark-tufte` can be specified here.
                            // For example, you might specify custom components or settings.
                        },
                    },
                    // Include other remark plugins here, as needed.
                ],
            },
        },
    ],
};

export default config;
