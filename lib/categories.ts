import type { Project } from "@/types/project";

export const categoryLabel: Record<string, string> = {
  design: "Design",
  research: "Research",
  other: "Others",
  photography: "Photography",
};

export const subcategoryLabel: Record<string, string> = {
  practice: "实践项目",
  competition: "国际竞赛",
  research: "研究作品",
  event: "活动策划",

  media: "新媒体宣传",
  wechat: "微信公众号",
  video_web: "视频网页",
  xiaohongshu: "小红书",

  photography: "影像",
  arch_photo: "建筑/景观摄影",
  landscape_photo: "风光摄影",
  travel_video: "旅行摄像",
};

export function byCategory(
  projects: Project[],
  category: string,
  subcategory?: string
) {
  return projects.filter((project) => {
    if (subcategory) {
      return (
        project.category === category &&
        project.subcategory === subcategory
      );
    }

    return project.category === category;
  });
}