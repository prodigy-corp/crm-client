import MenuCollapsible from "./menu-collapsible";
import MenuCollapsibleItem from "./menu-collapsible-item";
import MenuItem from "./menu-item";
import { menuList } from "./menu-list";
import { useAuth } from "@/hooks/use-auth";

const SidebarMenu = () => {
  const { user, isLoading } = useAuth();
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");

  const filteredMenus = menuList
    .map((menu) => {
      // Filter submenus based on permissions
      if (menu.submenu) {
        const filteredSubmenu = menu.submenu.filter((submenu) => {
          // Check CMS-specific permissions
          const isCmsItem = submenu.url.startsWith("/admin/dashboard/cms");
          if (isCmsItem && !canViewCmsSettings && !isLoading) {
            return false;
          }

          // Check required permissions
          if (
            submenu.requiredPermission &&
            !user?.permissions?.includes(submenu.requiredPermission) &&
            !isLoading
          ) {
            return false;
          }

          return true;
        });

        // Only return the menu if it has visible submenu items
        if (filteredSubmenu.length > 0) {
          return { ...menu, submenu: filteredSubmenu } as typeof menu;
        }
        return null;
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
