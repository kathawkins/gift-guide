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
          <h1>Suggested Gifts:</h1>
          {gifts &&
            gifts.map((gift, index) => {
              return (
                <ul key={gift.id}>
                  <li>
                    {index + 1}. {gift.description}
                    {giftedFunctionality && (
                      <button onClick={() => updateGiftedStatus(gift)}>
                        {gift.gifted ? "🎂 Gifted 🎂" : "Not Gifted"}
                      </button>
                    )}
                  </li>
                </ul>
              );
            })}
        </div>
      )}
    </div>
  );
}
