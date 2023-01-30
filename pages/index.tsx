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
      <div className="grid justify-center max-w-5xl mx-auto">
        <Image
          priority
          src="/images/gift.png"
          height={208}
          width={208}
          alt="gift logo"
        />
      </div>
      <h1 className="grid grid-cols-2 text-5xl font-bold mt-10 max-w-5xl mx-auto">
        <div className="grid content-center">GIFT GUIDE</div>
      </h1>
      <div className="grid grid-cols-2 my-10 mx-auto max-w-4xl content-center">
        <h2 className="grid text-3xl">
          Unwrap the Perfect Gift with Our AI-Powered Gift Suggester
        </h2>
        <p className="grid text-m">
          We&apos;re here to make your gift-giving experience as easy as
          possible. Begin by sharing a few details about the recipient and the
          occasion for the gift. We will generate a list of personalized gift
          options for you to choose from. It&apos;s that easy!
        </p>
      </div>
      {!session ? (
        <div className="mx-auto max-w-xl">
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
