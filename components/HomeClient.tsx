"use client";

import PageAnimation from "@/components/PageAnimation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import ProjectGrid from "@/components/ProjectGrid";
import Footer from "@/components/Footer";

import type {
  Project,
  Profile,
} from "@/types/project";

import { byCategory } from "@/lib/categories";

function SubSection({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  return (
    <div className="mt-[40px]">
      <h3 className="sub-title mb-[32px]">
        {title}
      </h3>

      <ProjectGrid projects={projects} />
    </div>
  );
}

function MainSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ndc-fade mb-[42px]">
      <SectionTitle id={id} title={title} />
      {children}
    </section>
  );
}

export default function HomeClient({
  projects = [],
  profile,
}: {
  projects?: Project[];
  profile?: Profile | null;
}) {
  return (
    <main className="page-enter min-h-screen bg-[#f7f7f4] text-[#111]">
      <PageAnimation />
      <Navbar />

      <section className="px-[26px] pb-[96px] pt-[132px] md:px-[88px] md:pb-[80px] md:pt-[150px]">
        <Hero profile={profile} />

        <div className="ndc-fade mb-[72px]">
          <h2 className="section-title">
            Projects
          </h2>
        </div>

        <MainSection id="others" title="Others">
          <div className="mt-[88px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              新媒体宣传
            </h3>

            <div className="mt-[88px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              影像
            </h3>

            <SubSection
              title="建筑/景观摄影"
              projects={byCategory(
                projects,
                "other",
                "arch_photo"
              )}
            />

            <SubSection
              title="风光摄影"
              projects={byCategory(
                projects,
                "other",
                "landscape_photo"
              )}
            />

            <SubSection
              title="旅行摄像"
              projects={byCategory(
                projects,
                "other",
                "travel_video"
              )}
            />
          </div>

            <SubSection
              title="微信公众号"
              projects={byCategory(
                projects,
                "other",
                "wechat"
              )}
            />

            <SubSection
              title="视频网页"
              projects={byCategory(
                projects,
                "other",
                "video_web"
              )}
            />

            <SubSection
              title="小红书"
              projects={byCategory(
                projects,
                "other",
                "xiaohongshu"
              )}
            />
          </div>
          
          <div className="mt-[40px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              活动策划
            </h3>

            <ProjectGrid
              projects={byCategory(
                projects,
                "other",
                "event"
              )}
            />
          </div>
      
        </MainSection>

        <MainSection id="research" title="Research">
          <div className="mt-[40px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              研究作品
            </h3>

            <ProjectGrid
              projects={byCategory(
                projects,
                "research"
              )}
            />
          </div>

        </MainSection>

        <MainSection id="design" title="Design">
          <div className="mt-[40px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              实践项目
            </h3>

            <ProjectGrid
              projects={byCategory(
                projects,
                "design",
                "practice"
              )}
            />
          </div>

          <div className="mt-[88px]">
            <h3 className="mb-[42px] text-[18px] font-normal tracking-[0.18em] text-neutral-700">
              国际竞赛
            </h3>

            <ProjectGrid
              projects={byCategory(
                projects,
                "design",
                "competition"
              )}
            />
          </div>

        </MainSection>

        
      </section>

      <Footer />
    </main>
  );
}