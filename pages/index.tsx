import { Auth, ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account";
import Image from "next/image";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div>
      <div className="grid grid-cols-3 mt-5 mx-2 md:mx-10 gap-4">
        <Image
          priority
          src="/images/logo_.jpg"
          height={153 * 1.5}
          width={431 * 1.5}
          alt="Gift Guide logo"
          className="col-span-2 text-5xl font-bold"
        ></Image>
        {session && (
          <div className="dropdown dropdown-bottom dropdown-end justify-self-end">
            <label tabIndex={0} className="btn btn-circle mt-5">
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
            </label>
            <div
              tabIndex={0}
              className="dropdown-content card card-compact w-fit p-2 shadow bg-base-300 text-primary-content"
            >
              <div className="card-body">
                <h3 className="card-title text-xl font-bold">
                  Account Details
                </h3>
                <Account session={session} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1.5 my-2 mx-auto px-5 max-w-4xl content-center">
        <h2 className="text-3xl">
          Unwrap the Perfect Gift with Our AI-Powered Gift Suggester
        </h2>
        <p>
          We&apos;re here to make your gift-giving experience as easy as
          possible. Begin by sharing a few details about the recipient and the
          occasion for the gift. We will generate a list of personalized gift
          options for you to choose from. It&apos;s that easy!
        </p>
      </div>
      {!session ? (
        <div className="mx-auto max-w-xl mt-10 font-bold">
          Log in now to get started!
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 px-8 max-w-xl mx-auto mt-10">
            <Link
              href="/newGuidePage"
              type="button"
              className="btn btn-primary btn-lg"
            >
              Create a New Gift Guide
            </Link>
            <Link
              href="/savedGuidesPage"
              type="button"
              className="btn btn-primary btn-lg"
            >
              Go to Saved Gift Guides
            </Link>
          </div>
        </div>
      )}
      <div className="grid justify-center max-w-5xl mx-auto my-20">
        <Image
          priority
          src="/images/gift.png"
          height={108}
          width={108}
          alt="gift logo"
        />
      </div>
    </div>
  );
};

export default Home;
