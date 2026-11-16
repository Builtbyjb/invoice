import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";

export const Route = createFileRoute("/_guest/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Hero />
      <Logos />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}
