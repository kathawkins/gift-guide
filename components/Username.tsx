import { useState, useEffect } from "react";
import {useUser, useSupabaseClient, Session,} from "@supabase/auth-helpers-react";
import { Database } from "../types/supabase";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Username({ session }: { session: Session }) {
    const supabase = useSupabaseClient<Database>();
    const user = useUser();
    const [username, setUsername] = useState<Profiles["username"]>(null);

    useEffect(() => {
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

    return (
    <p className="text-red-700">
        {username ? (<p>{username}&apos;s</p>):(<p>User&apos;s</p>)}
    </p>
    );
}
