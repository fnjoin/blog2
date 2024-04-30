import React from "react";
import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { BlogRepository } from "@/lib/repository";

export default function Index() {
    const repository = BlogRepository.fromCwd();
    const allPosts = repository.getAllPosts();
    const heroPost = allPosts[0];
    const morePosts = allPosts.slice(1);

    return (
        <main>
            <Container>
                <Intro />
                <HeroPost
                    title={heroPost.title}
                    coverImage={heroPost.coverImage.imageSrc}
                    date={heroPost.date}
                    author={heroPost.author_detail}
                    slug={heroPost.slug}
                    excerpt={heroPost.excerpt}
                />
                {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </Container>
        </main>
    );
}
