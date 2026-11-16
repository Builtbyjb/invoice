import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { type Context } from "@/lib/types";
// import { LayoutProvider } from "@/hooks/useLayout";
import { BadgeAlert, BadgeCheck, BadgeInfo } from "lucide-react";

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>
        <Outlet />
        {/*<Suspense fallback={null}>
            <TanStackRouterDevtools />
          </Suspense>*/}
        <Toaster
          position="top-center"
          icons={{
            error: <BadgeAlert className="h-5 w-5 text-red-500" />,
            success: <BadgeCheck className="h-5 w-5 text-green-500" />,
            info: <BadgeInfo className="h-5 w-5 text-blue-500" />,
          }}
          toastOptions={{
            classNames: {
              content: "flex flex-col gap-2",
              toast: "bg-background text-foreground border-border shadow-lg",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
              success: "text-green-500",
              closeButton: "!bg-muted !hover:bg-accent !border-gray-900",
            },
            style: {
              borderRadius: "calc(var(--radius)  + 4px)",
              backgroundColor: "hsl(from var(--background) h s l / 1)",
            },
          }}
          closeButton={true}
        />
      </div>
    </>
  );
}
