import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type GiftIdea = Database["public"]["Tables"]["gifts"]["Row"];

export default function GiftIdeas({
  inquiryID,
  giftedFunctionality,
}: {
  inquiryID: number;
  giftedFunctionality: boolean;
}) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [gifts, setGifts] = useState<GiftIdea[] | null>(null);

  async function updateGiftedStatus(gift: GiftIdea) {
    if (!gifts) {
      console.error("Tried to update gifts when gifts were null");
      return;
    }
    try {
      let { error } = await supabase
        .from("gifts")
        .update({ gifted: !gift.gifted })
        .eq("id", gift.id);
      const updatedGifts = gifts.map((giftRecord) => {
        if (giftRecord.id === gift.id) {
          return { ...giftRecord, gifted: !giftRecord.gifted };
        } else {
          return giftRecord;
        }
      });
      setGifts(updatedGifts);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert("Error updating gift status!");
      console.log(error);
    }
  }

  useEffect(() => {
    async function getGiftIdeas() {
      try {
        setLoading(true);
        if (!user) throw new Error("No user");

        let { data, error, status } = await supabase
          .from("gifts")
          .select()
          .eq("inquiry_id", inquiryID);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setGifts(
            data.sort((giftA, giftB) => {
              return giftA.id - giftB.id;
            })
          );
        }
      } catch (error) {
        alert("Error loading gifts!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getGiftIdeas();
  }, [inquiryID, user, supabase]);

  return (
    <div>
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <ul>
            {gifts &&
              !giftedFunctionality &&
              gifts.map((gift) => {
                return (
                  <li key={gift.id} className="flex my-1 gap-2">
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
                    {gift.description}
                  </li>
                );
              })}
            {gifts &&
              giftedFunctionality &&
              gifts.map((gift, index) => {
                return (
                  <li key={gift.id} className="grid my-1 grid-cols-2 gap-2">
                    <div className="grid content-center p-2">
                      {index + 1}. {gift.description}
                    </div>
                    <div className="grid form-control">
                      <label className="flex cursor-pointer my-auto justify-end mr-5">
                        <span className="label-text text-xs text-secondary mr-1">
                          {gift.gifted ? (
                            <span className="flex">
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
                              <span className="my-auto">Gifted</span>
                            </span>
                          ) : (
                            <span className="my-auto">Not Gifted</span>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-secondary toggle-xs my-auto"
                          onClick={() => updateGiftedStatus(gift)}
                          checked={gift.gifted}
                        />
                      </label>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
