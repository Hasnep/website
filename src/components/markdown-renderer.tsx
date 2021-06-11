import ReactMarkdown from "react-markdown";
// import * as gfm from "remark-gfm";
import gfm from "remark-gfm";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

const codeComponent = ({
  node,
  inline,
  className,
  children,
  ...props
}: {
  node: any;
  inline: boolean;
  className: string;
  children: JSX.Element;
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      useInlineStyles={false}
      language={match[1]}
      codeTagProps={{}}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props} />
  );
};
const components = { code: codeComponent };

const MarkdownRenderer = (props: { markdownString: string }): JSX.Element => {
  return (
    <ReactMarkdown
      // remarkPlugins={[remarkMath]}
      // rehypePlugins={[rehypeKatex]}
      components={components}
      // plugins={[gfm]} // Use GitHub Flavoured Markdown plugin for tables support
    >
      {props.markdownString}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
