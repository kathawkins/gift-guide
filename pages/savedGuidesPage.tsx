import { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Inquiries from "../components/Inquiries";
import UserInputs from "@/components/UserInputs";
import GiftIdeas from "@/components/GiftIdeas";

export default function SavedGuidesPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  //   change to null later and add state handlers
  const [inquiryID, setinquiryID] = useState(1)
  // const giftedFunctionality = true

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
          <h2 className="text-red-500">Selected Gift Guide: (currently defaulted to Inquiry with ID=1)</h2>
          <UserInputs session={session} inquiryID={inquiryID}/>
          <GiftIdeas session={session} inquiryID={inquiryID} giftedFunctionality={true}/>
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
