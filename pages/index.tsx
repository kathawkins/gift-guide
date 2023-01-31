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
      {/* <div className="grid justify-center max-w-5xl mx-auto mt-5">
        <Image
          priority
          src="/images/gift.png"
          height={208}
          width={208}
          alt="gift logo"
        />
      </div> */}
      <Image
        priority
        src="/images/logo_.jpg"
        height={153 * 1.5}
        width={431 * 1.5}
        alt="Gift Guide logo"
        className="flex text-5xl font-bold mt-5 mx-10"
      ></Image>
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
        <div className="mx-auto max-w-xl mt-10">
          Log in here to get started!
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mt-10">
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
          <div className="grid grid-flow-row auto-rows-max ml-10 mb-20">
            <h3 className="text-xl font-bold mt-20">Account Details:</h3>
            <Account session={session} />
          </div>
        </div>
      )}
      <div className="grid justify-center max-w-5xl mx-auto mb-20">
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
