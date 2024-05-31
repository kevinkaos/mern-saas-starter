import { MDXRemote } from 'next-mdx-remote';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { BiographyProps, profileWidth } from '.';
import { CheckIcon, XIcon, EditIcon } from 'lucide-react';
import Link from 'next/link';
import { LoadingDots } from '../icons';

const Biography: React.FC<BiographyProps> = ({
  settingsPage,
  setData,
  data,
  user,
  error,
  session,
  saving,
  handleSave
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
      {/* Edit buttons */}
      {settingsPage ? (
        <div className="fixed bottom-10 right-10 flex items-center space-x-3">
          <p className="text-sm text-gray-500">{error}</p>
          <button
            className={`${
              saving ? 'cursor-not-allowed' : ''
            } rounded-full border border-[#0070F3] hover:border-2 w-12 h-12 flex justify-center items-center transition-all`}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <LoadingDots color="white" />
            ) : (
              <CheckIcon className="h-4 w-4 text-white" />
            )}
          </button>
          <Link
            href={`/${user.username}`}
            shallow
            replace
            scroll={false}
            className="rounded-full border border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all"
          >
            <XIcon className="h-4 w-4 text-white" />
          </Link>
        </div>
      ) : session?.username === user.username ? (
        <Link
          href={{ query: { settings: true } }}
          as="/settings"
          shallow
          replace
          scroll={false}
          className="fixed bottom-10 right-10 rounded-full border bg-black border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all"
        >
          <EditIcon className="h-4 w-4 text-white" />
        </Link>
      ) : null}
    </div>
  );
};

export default Biography;
