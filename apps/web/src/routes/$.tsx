import { createFileRoute, useRouter, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden space-y-4">
      <h1 className="text-7xl font-bold">404</h1>
      <h2 className="text-2xl font-medium text-foreground">Page not found</h2>
      <p className="leading-relaxed">
        Looks like you&apos;ve wandered into uncharted territory. The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => navigate({ to: "/" })}
          className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          Back to Home
        </Button>

        <Button
          variant="outline"
          className="px-8 border-border hover:bg-secondary"
          onClick={() => router.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Go Back
        </Button>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});
