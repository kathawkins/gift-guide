import { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import GiftIdeas from "../components/GiftIdeas";
import InputForm from "../components/InputForm";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

export default function NewGuidePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  //   change to false later and add state handlers
  const [receivedAPIresponse, setReceivedAPIresponse] = useState(true);
  //   change to null later and add state handlers
  const [inquiryID, setInquiryID] = useState(1);

  const getInquiry = (response_data: Inquiry) => {
    setInquiryID(response_data.id);
  };

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
          <h1>Let&apos;s get started! Answer the questions below.</h1>
          <InputForm getInquiry={getInquiry}></InputForm>
          <div>
            ~ After form is submitted and handled, gift list will go here ~
            <h2 className="text-red-500">
              Your Gift Guide: (currently defaulted to Inquiry with ID=
              {inquiryID})
            </h2>
            {receivedAPIresponse && (
              <GiftIdeas
                session={session}
                inquiryID={inquiryID}
                giftedFunctionality={false}
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
