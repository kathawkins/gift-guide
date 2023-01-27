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
  const [inquiryID, setInquiryID] = useState<number | null>(null);

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
          <Inquiries setInquiry={setInquiryID} />

          {!inquiryID && (
            <div>Select a guide above to see it&apos;s details! </div>
          )}
          {inquiryID && (
            <div>
              <UserInputs inquiryID={inquiryID} />
              <GiftIdeas inquiryID={inquiryID} giftedFunctionality={true} />
            </div>
          )}

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
