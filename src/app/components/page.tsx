import Navbar from "@/components/navbar";
import ScrollReveal from "@/components/scroll-reveal";

export default function ComponentsPage() {
  const components = [
    { name: "Button", description: "Pill-shaped buttons with hover states" },
    { name: "ProjectCard", description: "Image + title + description, 2-col grid" },
    { name: "GrindLog", description: "Daily log entry with calendar heatmap" },
    { name: "Navbar", description: "Sticky top nav with mobile menu" },
    { name: "ScrollReveal", description: "Fade-in on scroll using Motion" },
    { name: "SocialLinks", description: "Icon row for X, GitHub, etc." },
  ];

  return (
    <>
      <Navbar />
      <main id="main" className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16">
        <ScrollReveal>
          <h1 className="text-3xl tx-main mb-8 font-serif-display">
            Components
          </h1>
          <div className="flex flex-col divide-y bd-cute">
            {components.map((c) => (
              <div key={c.name} className="py-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-sm tx-main font-medium">{c.name}</h3>
                  <p className="text-xs tx-muted mt-1">{c.description}</p>
                </div>
                <span className="text-xs tx-muted-darker">→</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
