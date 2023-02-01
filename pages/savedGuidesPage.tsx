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
      <Image
        priority
        src="/images/logo_.jpg"
        height={153}
        width={431}
        alt="Gift Guide logo"
        className="flex text-5xl font-bold mt-10 md:mx-10"
      ></Image>
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
          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 px-8 max-w-xl mx-auto mt-5">
            <Link href="/" type="button" className="btn btn-primary btn-sm">
              Go to Homepage
            </Link>
            <Link
              href="/newGuidePage"
              type="button"
              className="btn btn-primary btn-sm"
            >
              Create a New Gift Guide
            </Link>
          </div>
          {/* Gift Guides Display */}
          <div className="md:flex gap-8 max-w-4xl mx-auto px-5 mt-10 mb-20">
            {/* Inquiries List Display */}
            <Inquiries setInquiry={setInquiryID} />
            {/* Inquiry (inputs/gifts) Details Display */}
            {!inquiryID && (
              <h3 className="mt-10 md:mt-0 flex flex-none basis-2/4 text-2xl items-center">
                Select a guide to see it&apos;s details!{" "}
              </h3>
            )}
            {inquiryID && (
              <div className="grid mt-14">
                <UserInputs inquiryID={inquiryID} />
                <GiftIdeas inquiryID={inquiryID} giftedFunctionality={true} />
              </div>
            )}
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
