import type { Profile } from "@/types/project";

export default function Hero({
  profile,
}: {
  profile?: Profile | null;
}) {
  return (
    <div className="ndc-fade mb-[120px] max-w-[720px]">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt="avatar"
          className="h-[150px] w-[150px] rounded-full object-cover"
        />
      ) : (
        <div className="h-[150px] w-[150px] rounded-full bg-neutral-200" />
      )}

      <p className="hero-label mt-[42px]">
        {profile?.title || "Landscape Architecture"}
      </p>

      <h1 className="hero-en mt-[28px]">
        {profile?.name_en || "JOEY"}
      </h1>

      <p className="hero-cn mt-[14px]">
        {profile?.name_zh || "刘康"}
      </p>

      <p className="hero-intro mt-[36px]">
        {profile?.intro ||
          "Research, design and visual practice in landscape architecture, urban aesthetics, knowledge graph and spatial media."}
      </p>
    </div>
  );
}