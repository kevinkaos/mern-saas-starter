import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BiographyProps, profileWidth } from '.';

const Biography: React.FC<BiographyProps> = ({
  settingsPage,
  setData,
  data
}) => {
  return (
    <div className={`${profileWidth} mt-16`}>
      <h2 className="font-semibold font-mono text-2xl text-white">Bio</h2>
      {settingsPage ? (
        <>
          <TextareaAutosize
            name="description"
            onInput={(e) => {
              setData({
                ...data,
                bio: (e.target as HTMLTextAreaElement).value
              });
            }}
            className="mt-1 w-full max-w-2xl px-0 text-sm tracking-wider leading-6 text-white bg-black font-mono border-0 border-b border-gray-800 focus:border-white resize-none focus:outline-none focus:ring-0"
            placeholder="Enter a short bio about yourself... (Markdown supported)"
            value={data.bio}
          />
          <div className="flex justify-end w-full max-w-2xl">
            <p className="text-gray-400 font-mono text-sm">
              {data.bio.length}/256
            </p>
          </div>
        </>
      ) : (
        <article className="mt-3 max-w-2xl text-sm tracking-wider leading-6 text-white font-mono prose prose-headings:text-white prose-a:text-white">
          <MDXRemote {...data.bioMdx} />
        </article>
      )}
    </div>
  );
};

export default Biography;
