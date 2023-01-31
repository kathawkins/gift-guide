import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

export default function UserInputs({ inquiryID }: { inquiryID: number }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  useEffect(() => {
    async function getInquiries() {
      try {
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
      }
    }
    getInquiries();
  }, [inquiryID, supabase, user]);

  return (
    <div className="mt-2">
      {inquiries &&
        inquiries.map((inquiry) => {
          return (
            <div key={inquiry.id}>
              <div className="text-xs mt-2 mb-5 bg-base-200 mr-5 p-1">
                <p>Title: {inquiry.title}</p>
                <p>Occasion: {inquiry.g_occasion}</p>
                <p>
                  Price Range: ${inquiry.g_price_low}-{inquiry.g_price_high}
                </p>
                <p>Age: {inquiry.r_age}</p>

                {inquiry.r_occupation ? (
                  <p> Occupation: {inquiry.r_occupation}</p>
                ) : (
                  <p> Occupation: (not included)</p>
                )}
                <p>Hobbies: {inquiry.r_hobbies}</p>
                <p>Interests: {inquiry.r_interests}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
