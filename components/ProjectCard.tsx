import Link from "next/link";
import type { Project } from "@/types/project";

export default function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="group ndc-fade block"
    >
      <div className="ndc-image aspect-[4/3] overflow-hidden bg-neutral-200">
        <img
          src={project.image_url}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mt-[12px]">
        <h3 className="project-title-cn">
          {project.title}
        </h3>

        {project.title_en && (
          <p className="project-title-en">
            {project.title_en}
          </p>
        )}

        {project.year && (
          <p className="mt-[4px] text-[11px] text-neutral-500">
            {project.year}
          </p>
        )}
      </div>
    </Link>
  );
}