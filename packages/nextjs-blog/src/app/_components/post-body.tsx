import React from "react";
import ReactMarkdown from "react-markdown";
import markdownStyles from "./markdown-styles.module.css";
export type Props = {
    content: string;
};

export function PostBody({ content }: Props) {
    return (
        <div className="max-w-2xl mx-auto">
            <ReactMarkdown
                className={markdownStyles.markdown}
                remarkPlugins={[]}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
