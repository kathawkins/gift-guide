import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type GiftIdeas = Database["public"]["Tables"]["gifts"]["Row"];

export default function GiftIdeas({
  session,
  inquiryID,
  giftedFunctionality,
}: {
  session: Session;
  inquiryID: number;
  giftedFunctionality: boolean;
}) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [gifts, setGifts] = useState<GiftIdeas[] | null>(null);

  useEffect(() => {
    getGiftIdeas();
  }, [session]);

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
        setGifts(data);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <h1>Gifts:</h1>
          {gifts &&
            gifts.map((gift, index) => {
              return (
                <ul key={gift.id}>
                  <li>{index+1}. {gift.description}
                  {giftedFunctionality && <button>Gifted</button>}
                  </li>
                </ul>
              );
            })}
        </div>
      )}
    </div>
  );
}
