// src/templates/blogPostTemplate.tsx
import React from "react";
import { graphql, PageProps } from "gatsby";

// Define the query result data structure
interface BlogPostTemplateQueryData {
    markdownRemark: {
        html: string;
        frontmatter: {
            title: string;
            date: string;
        };
    };
}

// Define the page context data structure
interface BlogPostTemplatePageContext {
    slug: string;
}

const BlogPostTemplate: React.FC<
    PageProps<BlogPostTemplateQueryData, BlogPostTemplatePageContext>
> = ({ data }) => {
    const post = data.markdownRemark;
    return (
        <article>
            <header>
                <h1>{post.frontmatter.title}</h1>
                <p>{post.frontmatter.date}</p>
            </header>
            <section dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
    );
};

export default BlogPostTemplate;

// GraphQL query to fetch the blog post data
export const query = graphql`
    query BlogPostBySlug($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
            }
        }
    }
`;
