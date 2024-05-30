import { UserProps } from '@/lib/api/user';
import { getGradient } from '@/lib/gradients';
import {
  CheckInCircleIcon,
  CheckIcon,
  EditIcon,
  GitHubIcon,
  LoadingDots,
  UploadIcon,
  XIcon
} from '@/components/icons';
import { useSession } from 'next-auth/react';
import BlurImage from '../blur-image';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Biography from '@/components/profile/biography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export const profileWidth = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8';

interface Data {
  username: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export interface BiographyProps {
  settingsPage: boolean;
  setData: Dispatch<
    SetStateAction<{
      username: string;
      image: string;
      bio: string;
      bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
    }>
  >;
  data: Data;
}

export default function Profile({
  settings,
  user
}: {
  settings?: boolean;
  user: UserProps;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Data>({
    username: user.username,
    image: user.image,
    bio: user.bio || '',
    bioMdx: user.bioMdx
  });

  if (data.username !== user.username) {
    setData(user);
  }

  const [error, setError] = useState('');
  const settingsPage =
    settings ||
    (router.query.settings === 'true' && router.asPath === '/settings');

  const handleDismiss = useCallback(() => {
    if (settingsPage) router.replace(`/${user.username}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const bioMdx = await response.json();
        setData({
          ...data,
          bioMdx
        }); // optimistically show updated state for bioMdx
        router.replace(`/${user.username}`, undefined, { shallow: true });
      } else if (response.status === 401) {
        setError('Not authorized to edit this profile.');
      } else {
        setError('Error saving profile.');
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDismiss();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      await handleSave();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div className="min-h-screen pb-20">
      <div>
        <div
          className={`h-48 w-full lg:h-64 
          ${getGradient(user.username)}`}
        />
        <div
          className={`${profileWidth} -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}
        >
          <div className="relative group h-24 w-24 rounded-full overflow-hidden sm:h-32 sm:w-32">
            {settingsPage && (
              <button
                className="absolute bg-gray-800 bg-opacity-50 hover:bg-opacity-70 w-full h-full z-10 transition-all flex items-center justify-center"
                onClick={() =>
                  alert('Image upload has been disabled for demo purposes.')
                }
              >
                <UploadIcon className="h-6 w-6 text-white" />
              </button>
            )}
            <BlurImage
              src={user.image}
              alt={user.name}
              width={300}
              height={300}
            />
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex min-w-0 flex-1 items-center space-x-2">
              <h1 className="text-2xl font-semibold text-white truncate">
                {user.name}
              </h1>
              {user.verified && (
                <CheckInCircleIcon className="w-6 h-6 text-[#0070F3]" />
              )}
            </div>
            {user.verified ? (
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a
                  href={`https://github.com/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all"
                >
                  <GitHubIcon className="mr-3 h-5 w-5 text-white" />
                  <span>View GitHub Profile</span>
                </a>
              </div>
            ) : (
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <a
                  href="https://github.com/vercel/mongodb-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all"
                >
                  <GitHubIcon className="mr-3 h-5 w-5 text-white" />
                  <span>Demo Account</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 sm:mt-2 2xl:mt-5">
        <div className="border-gray-800">
          <div className={`${profileWidth} mt-10`}>
            <Tabs defaultValue={tabs[0].name}>
              <TabsList className="grid w-full grid-cols-3 bg-dark-accent-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.name} value={tab.name}>
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={tabs[0].name}>
                <Biography
                  settingsPage={settingsPage}
                  setData={setData}
                  data={data}
                />
              </TabsContent>
              <TabsContent value={tabs[1].name}>
                <Biography
                  settingsPage={settingsPage}
                  setData={setData}
                  data={data}
                />
              </TabsContent>
              <TabsContent value={tabs[2].name}>
                <Biography
                  settingsPage={settingsPage}
                  setData={setData}
                  data={data}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

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
}

const tabs = [
  { name: 'Profile' },
  { name: 'Work History' },
  { name: 'Contact' }
];
