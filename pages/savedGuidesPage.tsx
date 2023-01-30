import { useState, useEffect } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Inquiries from "../components/Inquiries";
import UserInputs from "@/components/UserInputs";
import GiftIdeas from "@/components/GiftIdeas";
import Image from "next/image";

export default function SavedGuidesPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [inquiryID, setInquiryID] = useState<number | null>(null);

  return (
    <div>
      <h1 className="text-4xl font-bold mt-10 ml-10">GIFT GUIDE</h1>
      {!session ? (
        <div className="mx-auto max-w-xl">
          Log in here to see gift guides!
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mt-10">
            <Link href="/" type="button" className="btn btn-primary">
              Go to Homepage
            </Link>
            <Link
              href="/newGuidePage"
              type="button"
              className="btn btn-primary"
            >
              Create a New Gift Guide
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
            <div className="mb-20">
              <Inquiries setInquiry={setInquiryID} />
            </div>
            <div className="grid">
              {!inquiryID && (
                <h3 className="text-2xl grid place-content-center">
                  Select a guide to see it&apos;s details!{" "}
                </h3>
              )}
              {inquiryID && (
                <div className="mb-20">
                  <UserInputs inquiryID={inquiryID} />
                  <GiftIdeas inquiryID={inquiryID} giftedFunctionality={true} />
                </div>
              )}
            </div>
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
}
