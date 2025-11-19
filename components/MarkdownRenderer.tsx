import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Markdown
      className="prose max-w-none text-gray-800"
      components={{
        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-iitm-red mt-6 mb-4 font-serif" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-xl font-bold text-iitm-red mt-5 mb-3 font-serif" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-lg font-bold text-iitm-red mt-4 mb-2 font-serif" {...props} />,
        p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc ml-5 my-2 space-y-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal ml-5 my-2 space-y-1" {...props} />,
        li: ({node, ...props}) => <li className="pl-1" {...props} />,
        strong: ({node, ...props}) => <strong className="font-bold text-iitm-red-dark" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-iitm-red/30 pl-4 py-1 italic bg-gray-50 my-4 rounded-r" {...props} />,
        code: ({node, ...props}) => (
            <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono text-red-900" {...props} />
        ),
        pre: ({node, ...props}) => (
            <pre className="bg-[#2d2d2d] text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm shadow-inner border border-gray-700" {...props} />
        ),
      }}
    >
      {content}
    </Markdown>
  );
};