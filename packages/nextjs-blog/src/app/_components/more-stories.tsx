import React from "react";
import { PostPreview } from "./post-preview";
import { MyPost } from "@/interfaces/mypost";
type Props = {
    posts: MyPost[];
};

export function MoreStories({ posts }: Props) {
    return (
        <section>
            <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                More Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
                {posts.map((post) => (
                    <PostPreview
                        key={post.slug}
                        title={post.title}
                        coverImage={post.coverImage?.imageSrc}
                        date={post.date}
                        author={post.author_detail}
                        slug={post.slug}
                        excerpt={post.excerpt || ""}
                    />
                ))}
            </div>
        </section>
    );
}
