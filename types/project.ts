export type Project = {
  id: string;
  title: string;
  title_en?: string | null;
  category: string;
  subcategory?: string | null;
  year?: string | null;
  location?: string | null;
  content?: string | null;
  image_url: string;
  gallery_urls?: string[] | null;
  bilibili_bvid?: string | null;
};

export type Profile = {
  name_zh?: string | null;
  name_en?: string | null;
  title?: string | null;
  intro?: string | null;
  avatar_url?: string | null;
};