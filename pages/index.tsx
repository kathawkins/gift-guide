import { Auth, ThemeSupa, ThemeMinimal } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div>
      <h1 className="text-4xl font-bold">GIFT GUIDE</h1>
      <h2 className="text-3xl">
        Unwrap the Perfect Gift with Our AI-Powered Gift Suggester
      </h2>
      <p className="text-xl">
        We&apos;re here to make your gift-giving experience as easy as possible.
        Begin by sharing a few details about the recipient and the occasion for
        the gift. We will generate a list of personalized gift options for you
        to choose from. It&apos;s that easy!
      </p>
      {!session ? (
        <div className="mx-auto max-w-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div>
            <Link href="/newGuidePage">
              <button className="btn btn-primary">
                Create a New Gift Guide
              </button>
            </Link>
            <Link href="/savedGuidesPage">
              <button className="btn btn-primary">
                Go to Saved Gift Guides
              </button>
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-bold">Account Details:</h3>
            <Account session={session} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
