import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/types/project";

export default function ProjectGrid({
  projects,
}: {
  projects: Project[];
}) {
  if (projects.length === 0) {
    return (
      <p className="text-[12px] text-neutral-400">
        No projects yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-[30px] gap-y-[52px] md:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}