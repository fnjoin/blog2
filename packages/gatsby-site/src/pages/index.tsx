// src/pages/index.tsx
import React from "react";
import { graphql, Link } from "gatsby";

const IndexPage = ({ data }: any) => {
    console.log("data", data);
    return (
        <main>
            <h1>My Blog Posts</h1>
            <ul>
                {data.allMarkdownRemark.edges.map(({ node }: any) => (
                    <li key={node.id}>
                        <Link to={node.fields.slug}>
                            {node.frontmatter.title} - {node.frontmatter.date}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export const query = graphql`
    query HomePageQuery {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
            edges {
                node {
                    id
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        date(formatString: "MMMM DD, YYYY")
                    }
                }
            }
        }
    }
`;

export default IndexPage;
