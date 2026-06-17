/** Anticipated questions from frontline teams, produced by the EXPERIMENT run. */
const FrontlineFaq = ({ faq }: { faq: { q: string; a: string }[] }) => {
  if (!faq.length) return null;
  return (
    <div className="space-y-4">
      {faq.map((item, i) => (
        <div key={i} className="border-l-2 border-primary/30 pl-4">
          <p className="font-semibold text-sm">{item.q}</p>
          <p className="text-sm text-foreground/70 mt-1">{item.a}</p>
        </div>
      ))}
    </div>
  );
};

export default FrontlineFaq;
