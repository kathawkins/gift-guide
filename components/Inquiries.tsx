import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Inquiries({
  setInquiry,
}: {
  setInquiry: (id: number) => void;
}) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

  async function deleteInquiryAndGifts(inquiry: Inquiry) {
    if (!inquiries) {
      console.error("Tried to update inquiries when gifts were null");
      return;
    }
    try {
      let { error } = await supabase
        .from("gifts")
        .delete()
        .eq("inquiry_id", inquiry.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert("Error deleting gifts!");
      console.log(error);
    }
    try {
      let { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", inquiry.id);
      const updatedInquiries = inquiries.filter(
        (inquiryRecord) => inquiryRecord.id != inquiry.id
      );
      setInquiries(updatedInquiries);
      setInquiry(inquiry.id);
      if (error) {
        throw error;
      }
    } catch (error) {
      alert("Error deleting inquiry!");
      console.log(error);
    }
  }

  useEffect(() => {
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

        let { data, error, status } = await supabase.from("inquiries").select();

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
    getInquiries();
    getUsername();
  }, [supabase, user]);

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
            {username ? username : "User"}&apos;s Previous Gift Guides:
          </h1>
          {inquiries &&
            inquiries.map((inquiry) => {
              return (
                <div key={inquiry.id}>
                  {/* Add onClick so that titles are selectable */}
                  <h2 onClick={() => setInquiry(inquiry.id)}>
                    Title: {inquiry.title}
                    <button onClick={() => deleteInquiryAndGifts(inquiry)}>
                      Delete from Profile
                    </button>
                  </h2>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
