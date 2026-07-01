export default function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="ndc-fade px-[26px] pb-[120px] md:px-[88px] md:pb-[160px]">
      <div className="border-t border-black pt-[42px]">
        <h2 className="mb-[56px] text-[22px] font-normal tracking-[0.02em] md:text-[28px]">
          Gallery
        </h2>

        <div className="ndc-gallery">
          {images.map((image, index) => (
            <figure
              key={`${image}-${index}`}
              className="ndc-gallery-item ndc-fade"
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}