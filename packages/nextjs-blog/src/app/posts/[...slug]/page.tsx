import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { CMS_NAME } from "../../../lib/constants";
import Header from "../../_components/header";
import { PostBody } from "@/app/_components/post-body";
import { BlogRepository } from "@/lib/repository";
import { Article, Author, Heading1, Tags } from "@/lib/markdowncomponents";

const repository = BlogRepository.fromCwd();

export default async function Post({ params }: Params) {
    const post = repository.getPostByPath(params.slug.join("/"));

    if (!post) {
        return notFound();
    }

    return (
        <main>
            <Header />
            <Article>
                <Tags tags={post.tags} />
                <Heading1>{post.title}</Heading1>
                <Author {...post.author_detail} />
                <PostBody content={post} />
            </Article>
        </main>
    );
}

type Params = {
    params: {
        slug: string[];
    };
};

export function generateMetadata({ params }: Params): Metadata {
    const post = repository.getPostByPath(params.slug.join("/"));

    if (!post) {
        return notFound();
    }

    const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

    if (post.ogImage?.url) {
        return {
            openGraph: {
                title,
                images: [post.ogImage?.url],
            },
        };
    }

    return {
        openGraph: {
            title,
        },
    };
}

export async function generateStaticParams() {
    const posts = repository.getAllPosts();

    return posts.map((post) => ({
        slug: post.slug.split("/"),
    }));
}
