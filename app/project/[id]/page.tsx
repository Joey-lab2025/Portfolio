import { supabase } from "@/lib/supabase";
import Link from "next/link";

import PageAnimation from "@/components/PageAnimation";
import Navbar from "@/components/Navbar";
import ProjectInfo from "@/components/ProjectInfo";
import Gallery from "@/components/Gallery";

import type { Project } from "@/types/project";
import BilibiliPlayer from "@/components/BilibiliPlayer";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();
  console.log(project);

  if (!project) {
    return (
      <main className="page-enter min-h-screen bg-[#f7f7f4] px-8 py-24 text-[#111]">
        Project Not Found
      </main>
    );
  }

  const galleryImages =
    project.gallery_urls && project.gallery_urls.length > 0
      ? project.gallery_urls
      : [];

  return (
    <main className="page-enter min-h-screen bg-[#f7f7f4] text-[#111]">
      <PageAnimation />
      <Navbar />

      <section className="relative h-screen min-h-[720px] overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            scale-[1.03]
            animate-[coverReveal_1.2s_ease_forwards]
          "
        />
      </section>

      <ProjectInfo project={project} />

      {project.bilibili_bvid && project.bilibili_bvid.trim() !== "" ? (
        <BilibiliPlayer bvid={project.bilibili_bvid} />
      ) : (
        <Gallery
          images={galleryImages}
          title={project.title}
        />
      )}

      <section className="ndc-fade border-t border-neutral-300 px-[26px] py-[80px] md:px-[88px]">
        <Link
          href="/"
          className="inline-block border-b border-black pb-[3px] text-[12px] tracking-[0.22em]"
        >
          BACK TO PROJECTS
        </Link>
      </section>
    </main>
  );
}