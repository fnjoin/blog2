import React from "react";
import { ArticleBodyFromMarkdown } from "@/lib/markdowncomponents";
import { MyPost } from "@/interfaces/mypost";
export type Props = {
    content: MyPost;
};

export function PostBody({ content }: Props) {
    return <ArticleBodyFromMarkdown art={content} />;
}
