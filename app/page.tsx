import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const { data: profile } = await supabase
    .from("site_profile")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <HomeClient
      projects={projects || []}
      profile={profile}
    />
  );
}