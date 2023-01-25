import { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Inquiries from "../components/Inquiries";
import GiftIdeas from "@/components/GiftIdeas";

export default function SavedGuidesPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  //   change to null later
  //   const [inquiryID, setinquiryID] = useState(1)

  return (
    <div>
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
          <Inquiries session={session} />
          <GiftIdeas session={session} />
          <div>
            <Link href="/newGuidePage">
              <button>Create a New Gift Guide</button>
            </Link>
            <Link href="/">
              <button>Go to Homepage</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
