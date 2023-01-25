import { useState, useEffect } from "react";
import {  useUser,  useSupabaseClient,  Session,} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
import Username from "../components/Username";
type Inquiries = Database["public"]["Tables"]["inquiries"]["Row"];

export default function Inquiries({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [inquiries, setInquiries] = useState<Inquiries[] | null>(null);

  useEffect(() => {
    getInquiries();
  }, [session]);

  async function getInquiries() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("inquiries")
        .select();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setInquiries(data);
        console.log('inqs', inquiries)
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
          <h1 className="text-blue-400">
            <Username session={session}></Username> 
            Saved Gift Guides
          </h1>
          {inquiries && inquiries.map((inquiry) => {
            return (
              <div key={inquiry.id} className="card">
                {/* Add onClick so that titles are selectable */}
                <h2>Title: {inquiry.title}</h2>
                {/* Create/Move to UserInputs component */}
                <p>Recipient&apos;s Hobbies: {inquiry.r_hobbies}</p>
                <p>Recipient&apos;s Age: {inquiry.r_age}</p>
                <p>Relationship: {inquiry.r_relationship}</p>
              </div>
            )
          })
          }
        </div>
      )}
    </div>
  );
}
