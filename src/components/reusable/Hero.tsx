import { Button } from "./Button";

export function Hero() {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-hero-gradient">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                Unlock the Future of Content with Insight Weave
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our AI-powered platform provides predictive analytics and intelligent insights to help you create content that resonates.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
          <img
            src="/placeholder.svg"
            width="600"
            height="600"
            alt="Hero"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square opacity-75"
          />
        </div>
      </div>
    </section>
  );
}
