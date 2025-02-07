
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabaseServer = await createClient();
  const { data: { session } } = await supabaseServer.auth.getSession()
  return (
    <div>

      <p>
        {session?.access_token ?? "No session"}
      </p>
    </div>
  );
}
