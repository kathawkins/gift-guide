import { useState, useEffect } from "react";
import {  useUser,  useSupabaseClient,  Session,} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Inquiries = Database["public"]["Tables"]["inquiries"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Inquiries({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [inquiries, setInquiries] = useState<Inquiries[] | null>(null);

  useEffect(() => {
    getInquiries();
    getUsername();
  }, [session]);

  async function getUsername() {
    try {
        if (!user) throw new Error("No user");

        let { data, error, status } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", user.id)
        .single();

        if (error && status !== 406) {
        throw error;
        }

        if (data) {
        setUsername(data.username);
        }
    } catch (error) {
        alert("Error loading user data!");
        console.log(error);
    }
    }

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
        // console.log(data)
        setInquiries(data);
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
            {/* <Username session={session}></Username>  */}
            {username ? (username) : ('User')}&apos;s Saved Gift Guides:
          </h1>
          {inquiries && inquiries.map((inquiry) => {
            return (
              <div key={inquiry.id}>
                {/* Add onClick so that titles are selectable */}
                <h2>Title: {inquiry.title}</h2>
              </div>
            )
          })
          }
        </div>
      )}
    </div>
  );
}
