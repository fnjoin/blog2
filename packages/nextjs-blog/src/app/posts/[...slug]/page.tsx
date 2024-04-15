import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { CMS_NAME } from "../../../lib/constants";
import Alert from "../../_components/alert";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostHeader } from "../../_components/post-header";
import { PostBody } from "@/app/_components/post-body";
import { BlogRepository } from "@/lib/repository";

const repository = BlogRepository.fromCwd();

export default async function Post({ params }: Params) {
    const post = repository.getPostByPath(params.slug.join("/"));

    if (!post) {
        return notFound();
    }

    return (
        <main>
            <Alert preview={post.preview} />
            <Container>
                <Header />
                <article className="mb-32">
                    <PostHeader
                        title={post.title}
                        coverImage={post.coverImage}
                        date={post.date}
                        author={post.author_detail}
                    />
                    <PostBody content={post.content} />
                </article>
            </Container>
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
