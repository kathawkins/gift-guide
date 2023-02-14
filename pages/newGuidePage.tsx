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
import Head from "next/head";

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
      <Head>
        <title>New - Gift Guide</title>
        <meta name="description" content="Gift Guide new page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/gifticon.ico" />
      </Head>
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
          Log in here to create a new gift guide!
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 px-8 max-w-xl mx-auto mt-5">
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
            <InputForm
              newInquiryCreated={newInquiryCreated}
              requestGifts={requestGiftsFromGPT}
            ></InputForm>
          )}

          <div>
            {loading ? (
              <div className="mx-10 mb-20">
                <h3 className="text-2xl font-bold mt-10 flex justify-center">
                  Loading gifts for {newInquiry?.title}!...
                </h3>
                {/* User Inputs skeleton */}
                <div className="w-96 h-32 mx-auto mt-5 bg-base-300 rounded-md">
                  <div className="flex animate-pulse flex-row items-center h-full py-2 px-5">
                    <div className="space-y-2">
                      <p className="w-48 bg-primary-content h-2 rounded-md"></p>
                      <p className="w-36 bg-primary-content h-2 rounded-md "></p>
                      <p className="w-36 bg-primary-content h-2 rounded-md"></p>
                      <p className="w-24 bg-primary-content h-2 rounded-md "></p>
                      <p className="w-24 bg-primary-content h-2 rounded-md"></p>
                      <p className="w-56 bg-primary-content h-2 rounded-md "></p>
                      <p className="w-56 bg-primary-content h-2 rounded-md"></p>
                    </div>
                  </div>
                </div>
                {/* Gift Ideas skeleton */}
                <div className="w-96 mx-auto mt-2 animate-pulse py-2 px-1 space-y-2">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="w-80 bg-primary-content h-4 rounded-md "></p>
                  </li>
                </div>
              </div>
            ) : (
              <div className="mb-20 mx-10">
                {newInquiry && showGifts && (
                  <div className="mt-5">
                    <div className="flex justify-center">
                      <button
                        className="btn btn-secondary mb-5 btn-lg"
                        onClick={() => refreshPage()}
                      >
                        Click here to make a new Gift Guide
                      </button>
                    </div>
                    <h2 className="flex text-2xl justify-center">
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
                      This guide has been saved to your account! You can go to
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
