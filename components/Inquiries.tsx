import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Inquiries({
  setInquiry,
}: {
  setInquiry: (id: number | null) => void;
}) {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [activeModal, setActiveModal] = useState(false);

  const continueDelete = async (inquiry: Inquiry) => {
    // waiting for delete request to complete (or throw an error) before closing modal
    await deleteInquiryAndGifts(inquiry);
    setActiveModal(false);
  };

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
      setInquiry(null);
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
        if (!user) throw new Error("No user when fetching username");

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
        alert("Error getting username!");
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
          setInquiries(data);
        }
      } catch (error) {
        alert("Error loading gift guides!");
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
          <h2 className="text-2xl">
            <span className="font-bold">
              {username ? username + " " : "Your "}
            </span>
            Previous Gift Guides:
          </h2>
          {inquiries && inquiries.length === 0 && (
            <h3 className="mt-5 text-2xl">Make a new guide to see it here!</h3>
          )}
          <ul className="mt-5">
            {inquiries &&
              inquiries.map((inquiry) => {
                return (
                  <li
                    key={inquiry.id}
                    className="grid grid-cols-3 gap-2 items-center mb-1"
                  >
                    <div className="grid col-span-2">
                      <label className="flex cursor-pointer">
                        <input
                          type="radio"
                          name="radio-1"
                          className="radio radio-xs mr-2 my-auto"
                          onClick={() => setInquiry(inquiry.id)}
                        ></input>
                        <span className="flex">{inquiry.title}</span>
                      </label>
                    </div>
                    <div className="grid justify-end max-w-xs w-fit">
                      <label
                        htmlFor="my-modal-6"
                        className="btn btn-secondary btn-outline btn-sm text-xs h-fit"
                        // onClick={() => deleteInquiryAndGifts(inquiry)}
                        onClick={() => setActiveModal(true)}
                      >
                        Delete from Profile
                      </label>
                    </div>
                    {activeModal && (
                      <div>
                        <input
                          type="checkbox"
                          id="my-modal-6"
                          className="modal-toggle"
                        />
                        <div className="modal modal-bottom sm:modal-middle">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">Are you sure?</h3>
                            <p className="py-4">
                              The gift guide will be permanantly deleted from
                              your profile.
                            </p>
                            <div className="modal-action">
                              <label
                                htmlFor="my-modal-6"
                                className="btn btn-error"
                              >
                                Cancel
                              </label>
                              <button
                                className="btn"
                                onClick={() => continueDelete(inquiry)}
                              >
                                Yep!
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
