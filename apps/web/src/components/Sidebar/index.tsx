import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, LogOut } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  items?: NavItem[];
};

type SidebarProps = {
  businessname?: string;
  username?: string;
  email?: string;
  navItems: NavItem[];
  logout: () => void;
};

function BetaBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border ml-auto"
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        borderColor: "rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.60)",
      }}
    >
      <span className="w-1 h-1" style={{ backgroundColor: "rgba(255,255,255,0.60)" }} />
      Beta
    </span>
  );
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & SidebarProps) {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (url: string) => currentPath === url || (url !== "/dashboard" && currentPath.startsWith(url));

  return (
    <Sidebar variant="inset" className="bg-black border-r border-white/10" {...props}>
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem
            className="mt-3 mb-1 cursor-pointer"
            onClick={() => {
              setOpenMobile(false);
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="flex items-center gap-3 px-2 py-2 transition-colors hover:bg-white/5">
              <div className="w-8 h-8 flex items-center justify-center text-black text-sm font-bold shrink-0 bg-white">
                {props.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate font-semibold leading-tight text-white">{props.businessname}</span>
                <span className="truncate text-sm leading-tight text-white">{props.username}</span>
                <span className="truncate text-sm leading-tight text-white/50">{props.email}</span>
              </div>
            </div>
            <BetaBadge />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator className="my-2 bg-white/10" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {props.navItems.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={item.items ? isActive(item.url) : false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    className="flex gap-3 items-center w-full px-3 py-2.5 transition-all duration-200 hover:cursor-pointer hover:bg-white/5"
                    style={{
                      backgroundColor: isActive(item.url) ? "rgba(255,255,255,0.08)" : "transparent",
                      color: isActive(item.url) ? "#ffffff" : "rgba(255,255,255,0.50)",
                    }}
                    onClick={() => {
                      if (!item.items) {
                        navigate({ to: item.url });
                        setOpenMobile(false);
                      }
                    }}
                  >
                    <span style={{ color: isActive(item.url) ? "#ffffff" : "rgba(255,255,255,0.50)" }}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.badge && item.badge}
                    {item.items && (
                      <ChevronRight
                        className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.50)" }}
                      />
                    )}
                  </CollapsibleTrigger>

                  {item.items && (
                    <CollapsibleContent>
                      <div className="ml-7 mt-1 flex flex-col gap-0.5">
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.title}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all duration-200 text-left w-full cursor-pointer hover:bg-white/5"
                            style={{
                              backgroundColor: isActive(subItem.url) ? "rgba(255,255,255,0.06)" : "transparent",
                              color: isActive(subItem.url) ? "#ffffff" : "rgba(255,255,255,0.50)",
                            }}
                            onClick={() => {
                              setOpenMobile(false);
                              navigate({ to: subItem.url });
                            }}
                          >
                            <span style={{ color: isActive(subItem.url) ? "#ffffff" : "rgba(255,255,255,0.50)" }}>
                              {subItem.icon}
                            </span>
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}

            <Separator className="my-2 bg-white/10" />

            {/* Logout */}
            <SidebarMenuItem>
              <button
                className="flex gap-3 items-center w-full px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:cursor-pointer hover:bg-red-500/10 text-red-400 hover:text-red-300"
                onClick={() => props.logout()}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Log out
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
