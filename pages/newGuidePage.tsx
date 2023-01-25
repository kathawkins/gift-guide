import { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import GiftIdeas from "../components/GiftIdeas";

export default function SavedGuidesPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  //   change to false later
  const [receivedAPIresponse, setReceivedAPIresponse] = useState(true);
  //   change to null later
//   const [selectedInquiryID, setSelectedInquiryID] = useState(1);

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
          <h1>Let&apos;s get started! Answer the questions below.</h1>~ A User
          Input form will go here ~
          <div>
            ~ After form is submitted and handled, gift list will go here ~
            {receivedAPIresponse && (
              <GiftIdeas
                session={session}
                // inqID={selectedInquiryID}
              ></GiftIdeas>
            )}
          </div>
          <div>
            <Link href="/savedGuidesPage">
              <button>Go to Saved Gift Guides</button>
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
