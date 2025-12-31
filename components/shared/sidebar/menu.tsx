"use client";

import { dashboardNavigation } from "@/config/dashboard-navigation";
import { useAuth } from "@/hooks/use-auth";
import { canAccessRoute } from "@/lib/permissions";
import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";

const SidebarMenu = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="grow space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </nav>
    );
  }

  const filteredNavigation = dashboardNavigation
    .map((group) => {
      const filteredItems = group.items.filter((item) =>
        canAccessRoute(user, item.requiredRoles, item.requiredPermissions),
      );

      if (filteredItems.length === 0) return null;

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group !== null);

  return (
    <nav className="grow space-y-6 overflow-y-auto px-3 py-4">
      {filteredNavigation.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-1">
          <h3 className="px-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-500">
            {group.title}
          </h3>
          <div className="mt-2 space-y-1">
            {group.items.map((item) => {
              if (item.submenu) {
                return (
                  <MenuCollapsible key={item.id} {...item}>
                    {item.submenu.map((sub, subIdx) => (
                      <MenuCollapsibleItem key={sub.id || subIdx} {...sub} />
                    ))}
                  </MenuCollapsible>
                );
              }

              return <MenuItem key={item.id} {...item} />;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
