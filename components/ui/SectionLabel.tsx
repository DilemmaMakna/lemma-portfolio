export default function SectionLabel({
  children,
  rule = false,
}: {
  children: React.ReactNode;
  rule?: boolean;
}) {
  return (
    <div className="section-label mono" data-reveal="fade">
      <span>{children}</span>
      {rule && <span className="rule" data-rule />}
    </div>
  );
}
