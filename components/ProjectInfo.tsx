import type { Project } from "@/types/project";
import {
  categoryLabel,
  subcategoryLabel,
} from "@/lib/categories";

export default function ProjectInfo({
  project,
}: {
  project: Project;
}) {
  const descriptionParagraphs =
    project.content
      ?.split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean) || [];

  return (
    <section className="ndc-fade px-[26px] py-[84px] md:px-[88px] md:py-[110px]">
      <div className="grid grid-cols-1 gap-[64px] border-t border-black pt-[42px] md:grid-cols-[38%_62%]">
        <div>
          <h1 className="text-[34px] font-normal leading-[1.25] tracking-[0.01em] md:text-[56px]">
            {project.title}
          </h1>

          {project.title_en && (
            <p className="mt-[14px] text-[18px] leading-[1.6] tracking-[0.04em] text-neutral-500 md:text-[24px]">
              {project.title_en}
            </p>
          )}
        </div>

        <div>
          <div className="grid grid-cols-1 gap-[28px] text-[13px] leading-[2] md:grid-cols-2">
            <div>
              <p className="mb-[6px] text-neutral-400">
                Category :
              </p>
              <p>
                {categoryLabel[project.category] ||
                  project.category}
              </p>
            </div>

            {project.subcategory && (
              <div>
                <p className="mb-[6px] text-neutral-400">
                  Type :
                </p>
                <p>
                  {subcategoryLabel[project.subcategory] ||
                    project.subcategory}
                </p>
              </div>
            )}

            {project.year && (
              <div>
                <p className="mb-[6px] text-neutral-400">
                  Year :
                </p>
                <p>{project.year}</p>
              </div>
            )}

            {project.location && (
              <div>
                <p className="mb-[6px] text-neutral-400">
                  Location :
                </p>
                <p>{project.location}</p>
              </div>
            )}
          </div>

          {descriptionParagraphs.length > 0 && (
            <div className="mt-[64px] max-w-[760px] space-y-[28px]">
              {descriptionParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[15px] font-light leading-[2.15] text-neutral-700 md:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}