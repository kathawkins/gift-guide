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
      <h1 className="text-4xl font-bold">GIFT GUIDE</h1>
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
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <Inquiries setInquiry={setInquiryID} />
            </div>
            <div className="grid">
              {!inquiryID && (
                <h3 className="text-2xl grid place-content-center">
                  Select a guide to see it&apos;s details!{" "}
                </h3>
              )}
              {inquiryID && (
                <div>
                  <UserInputs inquiryID={inquiryID} />
                  <GiftIdeas inquiryID={inquiryID} giftedFunctionality={true} />
                </div>
              )}
            </div>
          </div>
          <div>
            <Link href="/newGuidePage">
              <button className="btn btn-primary">
                Create a New Gift Guide
              </button>
            </Link>
            <Link href="/">
              <button className="btn btn-primary">Go to Homepage</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
