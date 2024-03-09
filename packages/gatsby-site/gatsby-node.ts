// gatsby-node.ts
import { GatsbyNode } from "gatsby";
import path from "path";
import { createFilePath } from "gatsby-source-filesystem";

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
    node,
    actions,
    getNode,
}) => {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `posts` });
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        });
    }
};

export const createPages: GatsbyNode["createPages"] = async ({
    graphql,
    actions,
}) => {
    const { createPage } = actions;
    const result = await graphql<{
        allMarkdownRemark: {
            edges: {
                node: {
                    fields: {
                        slug: string;
                    };
                };
            }[];
        };
    }>(`
        query AllPostsGatsbyNode {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    if (result.errors) {
        throw result.errors;
    }

    const blogPostTemplate = path.resolve(`src/templates/blogPostTemplate.tsx`);
    result.data!.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: blogPostTemplate,
            context: {
                slug: node.fields.slug,
            },
        });
    });
};
