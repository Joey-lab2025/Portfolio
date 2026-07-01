


export default function BilibiliPlayer({
  bvid,
}: {
  bvid?: string | null;
}) {
  if (!bvid) {
    return (
        <section className="px-[26px] pb-[120px] md:px-[88px]">
        <p className="text-red-500">
            未读取到 BV 号
        </p>
        </section>
    );
    }

  const cleanBvid = bvid.trim();

  return (
    <section className="ndc-fade px-[26px] pb-[120px] md:px-[88px] md:pb-[160px]">
      <div className="border-t border-black pt-[42px]">
        <h2 className="mb-[56px] text-[22px] font-normal tracking-[0.02em] md:text-[28px]">
          Video
        </h2>

        <div className="relative w-full overflow-hidden bg-black aspect-video">
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${cleanBvid}&page=1&high_quality=1&danmaku=0&autoplay=0`}
            allow="fullscreen"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}