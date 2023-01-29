import { useState } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
  useSession,
  useUser,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import GiftIdeas from "../components/GiftIdeas";
import InputForm from "../components/InputForm";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

export default function NewGuidePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const [newInquiry, setNewInquiry] = useState<Inquiry | null>(null);
  const [showGifts, setShowGifts] = useState<boolean>(false);

  const newInquiryCreated = (response_data: Inquiry) => {
    setNewInquiry(response_data);
  };

  async function requestGiftsFromGPT(prompt: string, newInquiryID: number) {
    try {
      setLoading(true);
      setShowGifts(false);

      const GPTresponse = await fetch("/api/OpenAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await GPTresponse.json();
      const giftsResponse = data.result.choices[0].text;
      const giftList = formatGiftsResponse(giftsResponse);
      saveGifts(giftList, newInquiryID);
    } catch (error) {
      alert("Error fetching gifts!");
      console.log(error);
    }
  }

  const formatGiftsResponse = (textFromAPI: string): string[] => {
    if (!textFromAPI.includes("\n")) {
      console.error("API did not return parsable list");
      return [];
    }
    return textFromAPI
      .split("\n")
      .filter((text) => text != "")
      .map((numberedGift) =>
        numberedGift.substring(numberedGift.indexOf(". ") + 1)
      );
  };

  async function saveGifts(gifts: string[], newInquiryID: number) {
    if (!gifts) {
      console.error("No gifts to save");
    }
    for (let gift of gifts) {
      try {
        if (!user) throw new Error("No user");
        let { error } = await supabase.from("gifts").insert({
          inquiry_id: newInquiryID,
          description: gift,
          profile_id: user.id,
        });
        if (error) {
          throw error;
        }
      } catch (error) {
        alert("Error saving gift guide to profile!");
        console.log(error);
      }
    }
    setLoading(false);
    setShowGifts(true);
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
            {loading ? (
              <div>
                <h1>Loading gifts for {newInquiry?.title}!...</h1>
              </div>
            ) : (
              <div>
                {newInquiry && showGifts && (
                  <div>
                    <h2 className="text-red-500">
                      Gift Guide for {newInquiry.title}:
                    </h2>
                    <GiftIdeas
                      inquiryID={newInquiry.id}
                      giftedFunctionality={false}
                    ></GiftIdeas>
                  </div>
                )}
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
