import { useState, useEffect } from "react";
import {useUser, useSupabaseClient, Session,} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type GiftIdeas = Database["public"]["Tables"]["gifts"]["Row"];

export default function GiftIdeas({ session }: { session: Session }) {
  // { inqID }
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [gifts, setGifts] = useState<GiftIdeas[] | null>(null);
  // how to pass this through props from guide pages?:
  const [selectedInquiryID, setSelectedInquiryID] = useState(1);

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
        .eq("inquiry_id", selectedInquiryID);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setGifts(data);
        console.log('gifts', gifts);
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
            gifts.map((gift) => {
                return (
                  <div key={gift.id} className="card">
                    <p>{gift.description}</p>
                  </div>
                );
            })}
        </div>
      )}
    </div>
  );
}
