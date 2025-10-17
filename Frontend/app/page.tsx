import AnimatedHero from "@/components/home/AnimatedHero";
import AnimatedFeatures from "@/components/home/AnimatedFeatures";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimatedHero />
      <AnimatedFeatures />

      <footer className="py-10 text-center bg-muted text-muted-foreground text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">MindVault</span>. Built with Next.js &
        ShadCN UI.
      </footer>
    </div>
  );
}
