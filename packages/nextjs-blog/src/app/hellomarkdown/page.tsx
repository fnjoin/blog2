import Image from "next/image";
import React, { PropsWithChildren } from "react";
import { ReactNode } from "react";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Literal } from "hast";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import { myRemarkPlugin } from "@/lib/mydirective";
import imageSize from "image-size";

const projectRoot = process.cwd();

export interface MyPost {
    author: AuthorProps;
    slug: string;
    title: string;
    tags: string[];
    excerpt: string;
    content: string;
    figurens?: {
        [ns: string]: string;
    };
}

function getMarkdown() {
    const fullPath = path.join(projectRoot, `src/app/hellomarkdown/file.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return { ...data, slug: "/hellomarkdown", content } as MyPost;
}

export function Article({ children }: PropsWithChildren) {
    return (
        <div className="prose max-w-none grid grid-cols-1 md:grid-cols-12 grid-flow-row gap-1">
            {children}
        </div>
    );
}

export function Paragraph({ children }: any) {
    return (
        // TODO if this a p tag, then we can't have nested divs under it, also figures aren't allowed
        // maybe we can check the children and conditionally render as a paragraph if the children are just text, does this matter?
        <div className="m-2 col-start-3 col-end-8 col-span-6">{children}</div>
    );
}

export function MarginNote({ children }: any) {
    return (
        <div className="m-2 col-start-3 col-end-8 col-span-6 row-span-12 md:col-start-9 md:col-end-12 md:col-span-3 text-sm">
            {children}
        </div>
    );
}

export interface TagProps {
    tags: string[];
}
export function Tags({ tags }: TagProps) {
    return (
        <div className="m-2 col-start-3 col-end-8 col-span-6">
            <div className="flex gap-1 flex-wrap text-sm justify-center">
                <span>Tags:</span>
                {tags.map((tag, idx) => (
                    <span
                        key={idx}
                        className="bg-gray-100 rounded-full px-3 font-semibold text-gray-600"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function InlineCallout({ children }: any) {
    return (
        <div className="grid grid-rows-subgrid col-span-12 col-start-1 col-end-13 md:col-span-8 md:col-start-2 md:col-end-9 place-content-center">
            <div className=" m-5 text-lg">{children}</div>
        </div>
    );
}
export function Callout({ children }: any) {
    return (
        <div className="m-2 col-start-1 col-end-13 col-span-12 md:col-start-9 md:col-end-12 md:col-span-3 md:row-span-12 text-2xl">
            {children}
        </div>
    );
}

export interface AuthorProps {
    picture: string;
    name: string;
    bio: string;
}
export function Author(props: AuthorProps) {
    return (
        <div className="col-start-3 col-end-8 col-span-6 grid grid-cols-8">
            <div className="col-span-1">
                <Image
                    src={props.picture}
                    width={1168 / 4}
                    height={1063 / 4}
                    alt={props.name}
                    className="rounded-xl m-1"
                />
            </div>
            <div className="col-span-7 flex items-center">
                <div className="m-2 text-sm">
                    <div className="prose-h4 font-semibold">
                        By {props.name}
                    </div>
                    <div>{props.bio}</div>
                </div>
            </div>
        </div>
    );
}

export function Heading1({ children }: PropsWithChildren) {
    return <h1 className="m-2 col-start-3 col-end-8 col-span-6">{children}</h1>;
}

export interface ImageWithinFigureProps {
    src?: string;
    width?: number;
    height?: number;
    alt?: string;
}
export function ImageWithinFigure({
    src,
    width,
    height,
    alt,
}: ImageWithinFigureProps) {
    if (!src || !alt) {
        return <span>Missing image properties</span>;
    }
    if (!width || !height) {
        const size = imageSize(path.join(projectRoot, "public", src));
        // TODO these seem reversed
        width = size.height;
        height = size.width;
    }
    return (
        <Image
            src={src}
            width={width || 1024}
            height={height || 1024}
            alt={alt}
            className="rounded-xl shadow-2xl"
        />
    );
}

export interface FigureFenceProps {
    children?: any;
    caption?: string;
    title?: string;
    id?: string;
    refnum?: number;
    refns?: string;
    reflabels?: {
        [label: string]: string;
    };
}
export function FigureFence(props: FigureFenceProps) {
    let refLabel = "Figure";
    if (props.refns && props.reflabels && props.reflabels[props.refns]) {
        refLabel = props.reflabels[props.refns];
    }

    return (
        <>
            <figure className="col-start-3 col-end-8 col-span-6" id={props.id}>
                {props.title && (
                    <div className="col-start-3 col-end-8 col-span-6 text-center text-md">
                        {props.refnum && `${props.refnum}: `}
                        {props.title}
                    </div>
                )}
                <div className="col-start-1 col-end-13 col-span-12 ">
                    {props.children}
                </div>
                <figcaption className="m-4 col-span-4 text-sm text-center">
                    {props.refnum && `${refLabel} ${props.refnum}: `}
                    {props.caption}
                </figcaption>
            </figure>
        </>
    );
}

export interface RefLinkProps {
    refid?: string;
    refnum?: number;
    reflabels?: {
        [label: string]: string;
    };
    children?: any;
}
export function RefLink(props: RefLinkProps) {
    let refLabel = "Figure";
    let refns = props.refid?.split(":")[0];
    if (refns && props.reflabels && props.reflabels[refns]) {
        refLabel = props.reflabels[refns];
    }

    return (
        <a href={`#${props.refid}`}>
            {refLabel} {props.refnum}
        </a>
    );
}

export function FullBleedImage({
    src,
    width,
    height,
    alt,
}: ImageWithinFigureProps) {
    if (!src || !alt) {
        return <span>Missing image properties</span>;
    }
    if (!width || !height) {
        // TODO maybe it would be better to get this in the markdown plugin
        const size = imageSize(path.join(projectRoot, "public", src));
        // TODO height width seem to be reversed in image-size???
        width = size.height;
        height = size.width;
    }
    return (
        <div className="col-start-1 col-end-13 col-span-12">
            <div className="col-start-1 col-end-13 col-span-12 ">
                <figure>
                    <Image
                        src={src}
                        alt={alt}
                        width={height}
                        height={width}
                        className="col-start-1 col-end-13 col-span-12 w-full"
                    />
                    <figcaption className="text-center">{alt}</figcaption>
                </figure>
            </div>
        </div>
    );
}

export default function HelloMarkdownPage(): ReactNode {
    const art = getMarkdown();
    return (
        <Article>
            <Tags tags={art.tags} />
            <Heading1>{art.title}</Heading1>
            <Author {...art.author} />
            <ReactMarkdown
                remarkPlugins={[remarkParse, remarkDirective, myRemarkPlugin]}
                // rehypePlugins={[]}
                // urlTransform={(url, key, node) => {
                //     console.log("urlTransform", url, key, node);
                //     return url; // or return a new url string.
                // }}
                // default is all
                // allowedElements={["img", "div", "p"]}
                components={{
                    span: ({ node, ...rest }) => {
                        if (node?.properties["data-element"] === "ref") {
                            return (
                                // <a href={`#${node?.properties.id}`}>
                                //     Figure {node?.properties.refnum}
                                // </a>
                                <RefLink
                                    reflabels={art.figurens}
                                    refid={node?.properties.id as string}
                                    refnum={node?.properties.refnum as number}
                                />
                            );
                        }
                        return <span {...rest} />;
                    },
                    div: ({ node, ...rest }) => {
                        if (
                            node?.properties["data-element"] ===
                            "inline-callout"
                        ) {
                            // console.log("page.tsx", node, rest);
                            return <InlineCallout {...rest} />;
                        }
                        if (node?.properties["data-element"] === "callout") {
                            return <Callout {...rest} />;
                        }
                        if (
                            node?.properties["data-element"] === "figure-fence"
                        ) {
                            return (
                                <FigureFence
                                    reflabels={art.figurens}
                                    {...rest}
                                    {...node.properties}
                                />
                            );
                        }
                        if (node?.properties["data-element"] === "full-bleed") {
                            return (
                                <FullBleedImage
                                    src={(node?.properties.src as string) || ""}
                                    alt={(node?.properties.alt as string) || ""}
                                />
                            );
                        }
                        if (
                            node?.properties["data-element"] === "margin-note"
                        ) {
                            return <MarginNote {...rest} />;
                        }
                        return <div {...rest} />;
                    },
                    h1: ({ node }) => (
                        <>
                            {node?.children.map((x, idx) => (
                                <Heading1 key={idx}>
                                    {(x as Literal).value}
                                </Heading1>
                            ))}
                        </>
                    ),
                    blockquote: ({ node, ...rest }) => {
                        return (
                            <blockquote
                                {...rest}
                                className="col-start-3 col-end-8 col-span-6"
                            />
                        );
                    },
                    p: ({ node, ...rest }) => {
                        return <Paragraph {...rest} />;
                    },
                    img: ({ node, ...rest }) => {
                        return (
                            <ImageWithinFigure
                                src={node?.properties.src as string}
                                alt={node?.properties.alt as string}
                            />
                        );
                    },
                    pre: ({ node, ...rest }) => {
                        return (
                            <Paragraph>
                                <pre>{rest.children}</pre>
                            </Paragraph>
                        );
                    },
                }}
            >
                {art.content}
            </ReactMarkdown>
        </Article>
    );
}
