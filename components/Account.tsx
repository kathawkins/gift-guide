import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [full_name, setFullName] = useState<Profiles["full_name"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        if (!user) throw new Error("No user");

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, full_name, avatar_url`)
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username);
          setFullName(data.full_name);
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        alert("Error loading user data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [session, supabase, user]);

  async function updateProfile({
    username,
    full_name,
    avatar_url,
  }: {
    username: Profiles["username"];
    full_name: Profiles["full_name"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        full_name,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <div>
        <label className="text-lg" htmlFor="email">
          Email{" "}
        </label>
        <input
          id="email"
          type="text"
          value={session.user.email}
          disabled
          className="w-80 input input-primary input-bordered"
        />
      </div>
      <div>
        <label className="text-lg" htmlFor="username">
          Username{" "}
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-secondary input-bordered w-s mt-2"
        />
      </div>
      <div>
        <label className="text-lg" htmlFor="full_name">
          Full Name{" "}
        </label>
        <input
          id="full_name"
          type="full_name"
          value={full_name || ""}
          onChange={(e) => setFullName(e.target.value)}
          className="input input-secondary input-bordered w-s mt-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mt-2">
        <button
          className="btn btn-secondary"
          onClick={() => updateProfile({ username, full_name, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
