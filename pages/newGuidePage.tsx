import { useState } from "react";
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
  const [inquiryID, setInquiryID] = useState<number | null>(null);

  const newInquiryCreated = (response_data: Inquiry) => {
    setInquiryID(response_data.id);
  };

  async function requestGiftsFromGPT(prompt: string) {
    try {
      const GPTresponse = await fetch("/api/OpenAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await GPTresponse.json();
      const giftsResponse = data.result.choices[0].text;
      // Add or send to a function that processes the
      // gifts response list and posts each gift into
      // the database
    } catch (error) {
      alert("Error fetching gifts!");
      console.log(error);
    }
  }

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
          <h1>
            Let&apos;s get started! Tell us about the person you&apos;re
            shopping for.
          </h1>
          <InputForm
            newInquiryCreated={newInquiryCreated}
            requestGifts={requestGiftsFromGPT}
          ></InputForm>
          <div>
            {inquiryID && (
              <div>
                <h2 className="text-red-500">Your Gift Guide:</h2>
                <GiftIdeas
                  inquiryID={inquiryID}
                  giftedFunctionality={false}
                ></GiftIdeas>
              </div>
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
