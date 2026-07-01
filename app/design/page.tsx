import { supabase } from "@/lib/supabase";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types/project";

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("category", "design")
    .order("created_at", {
      ascending: false,
    });

  const projects = (data || []) as Project[];

  return (
    <main className="max-w-7xl mx-auto px-10 py-24">
      <h1 className="text-5xl mb-20">
        Design
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </main>
  );
}