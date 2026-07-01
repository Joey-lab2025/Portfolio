import { supabase } from "@/lib/supabase";
import ProjectCard from "@/components/ProjectCard";

export default async function PhotographyPage() {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("category", "photography")
    .order("created_at", {
      ascending: false,
    });

  return (
    <main className="max-w-7xl mx-auto px-10 py-24">

      <h1 className="text-5xl mb-20">
        Photography
      </h1>

      <div className="grid md:grid-cols-2 gap-12">

        {data?.map((project) => (

          <ProjectCard
            key={project.id}
            project={project}
          />

        ))}

      </div>

    </main>
  );
}