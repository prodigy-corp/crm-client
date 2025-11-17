import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";
import { menuList } from "./menu-list";
import { useAuth } from "@/hooks/use-auth";

const SidebarMenu = () => {
  const { user, isLoading } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");

  const filteredMenus = menuList
    .map((menu) => {
      if (menu.baseUrl === "/dashboard/admin") {
        if (!isAdmin && !isLoading) {
          return null;
        }

        if (menu.submenu) {
          const filteredSubmenu = menu.submenu.filter((submenu) => {
            const isCmsItem = submenu.url.startsWith("/dashboard/admin/cms");
            if (isCmsItem && !canViewCmsSettings && !isLoading) {
              return false;
            }
            return true;
          });

          return { ...menu, submenu: filteredSubmenu } as typeof menu;
        }
      }

      return menu;
    })
    .filter((menu): menu is (typeof menuList)[number] => menu !== null);

  return (
    <nav className="grow space-y-1.5 overflow-y-auto p-6">
      {filteredMenus.map((menu) => {
        if (menu.submenu) {
          return (
            <MenuCollapsible key={menu.id} {...menu}>
              {menu.submenu.map((submenu) => (
                <MenuCollapsibleItem key={submenu.id} {...submenu} />
              ))}
            </MenuCollapsible>
          );
        }

        return <MenuItem key={menu.id} {...menu} />;
      })}
    </nav>
  );
};

export default SidebarMenu;
