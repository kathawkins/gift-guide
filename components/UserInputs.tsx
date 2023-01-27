import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

export default function UserInputs({ inquiryID }: { inquiryID: number }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  useEffect(() => {
    async function getInquiries() {
      try {
        setLoading(true);
        if (!user) throw new Error("No user");

        let { data, error, status } = await supabase
          .from("inquiries")
          .select()
          .eq("id", inquiryID);

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setInquiries(data);
        }
      } catch (error) {
        alert("Error loading user data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getInquiries();
  }, [inquiryID, supabase, user]);

  return (
    <div>
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          {inquiries &&
            inquiries.map((inquiry) => {
              return (
                <div key={inquiry.id}>
                  <h2 className="text-red-500">
                    Your {inquiry.r_relationship}&apos;s gift guide:
                  </h2>
                  <div className="card">
                    <p>Occasion: {inquiry.g_occasion}</p>
                    <p>
                      Price Range: ${inquiry.g_price_low}-{inquiry.g_price_high}
                    </p>
                    <p>Age: {inquiry.r_age}</p>
                    <p>Occupation: {inquiry.r_occupation}</p>
                    <p>Hobbies: {inquiry.r_hobbies}</p>
                    <p>Interests: {inquiry.r_interests}</p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
