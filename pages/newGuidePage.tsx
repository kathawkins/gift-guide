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
import UserInputs from "@/components/UserInputs";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
import Image from "next/image";

export default function NewGuidePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const [newInquiry, setNewInquiry] = useState<Inquiry | null>(null);
  // For testing UI with rendered gift list:
  // const [newInquiry, setNewInquiry] = useState<Inquiry | null>({
  //   id: 49,
  //   created_at: "2023-01-29T20:36:30.203317+00:00",
  //   profile_id: "d3f216a3-255d-4540-bfb9-fa7251b23d5c",
  //   title: "Ben's 32nd Birthday",
  //   r_relationship: "spouse",
  //   r_age: "young adult",
  //   r_interests: "video games, rap music, and beer",
  //   r_hobbies: "mountain biking, skiing, and cooking",
  //   r_occupation: "software developer",
  //   g_occasion: "birthday",
  //   g_price_low: 50,
  //   g_price_high: 100,
  // });
  const [showGifts, setShowGifts] = useState<boolean>(false);

  const newInquiryCreated = (response_data: Inquiry) => {
    setNewInquiry(response_data);
  };

  const refreshPage = () => {
    setNewInquiry(null);
    setShowGifts(false);
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
      alert("Error fetching gifts from Open AI! Please try again.");
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
      <Image
        priority
        src="/images/logo_.jpg"
        height={153}
        width={431}
        alt="Gift Guide logo"
        className="flex text-5xl font-bold mt-10 mx-10"
      ></Image>
      {!session ? (
        <div className="mx-auto max-w-xl">
          Log in here to create a new gift guide!
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mt-10">
            <Link href="/" type="button" className="btn btn-primary btn-sm">
              Go to Homepage
            </Link>
            <Link
              href="/savedGuidesPage"
              type="button"
              className="btn btn-primary btn-sm"
            >
              Go to Saved Gift Guides
            </Link>
          </div>

          {!showGifts && (
            <div>
              <h2 className="text-2xl mt-10 ml-10">
                Ready to find the perfect gift? Tell us about the person
                you&apos;re shopping for.
              </h2>
              <InputForm
                newInquiryCreated={newInquiryCreated}
                requestGifts={requestGiftsFromGPT}
              ></InputForm>
            </div>
          )}

          <div>
            {loading ? (
              <div>
                <h3 className="text-2xl mt-5 mb-20 ml-10">
                  Loading gifts for {newInquiry?.title}!...
                </h3>
              </div>
            ) : (
              <div className="mb-20 ml-10">
                {newInquiry && showGifts && (
                  <div className="mt-5">
                    <div className="flex justify-center mr-10">
                      <button
                        className="btn btn-secondary mb-5 btn-lg"
                        onClick={() => refreshPage()}
                      >
                        Click here to make a new Gift Guide
                      </button>
                    </div>
                    <h2 className="flex text-2xl justify-center mr-10">
                      Gift Guide for {newInquiry.title}
                    </h2>
                    <div className="max-w-lg mx-auto">
                      <UserInputs inquiryID={newInquiry.id} />
                      <GiftIdeas
                        inquiryID={newInquiry.id}
                        giftedFunctionality={false}
                      ></GiftIdeas>
                    </div>
                    <p className="flex text-3xl mt-5 mx-auto justify-center">
                      We hope these suggestions are helpful!
                    </p>
                    <div className="flex mt-2 mx-auto justify-center max-w-sm">
                      This guide has been saved to your profile! You can go to
                      the Saved Guides page to see notes and track the status of
                      each gift.
                    </div>
                  </div>
                )}
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
