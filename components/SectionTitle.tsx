export default function SectionTitle({
  id,
  title,
}: {
  id?: string;
  title: string;
}) {
  return (
    <div
      id={id}
      className="mb-[18px] border-t border-black pt-[32px]"
    >
      <h2 className="section-title">
        {title}
      </h2>
    </div>
  );
}