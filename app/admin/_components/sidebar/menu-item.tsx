import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  url: string;
};

const MenuItem = ({ icon, title, url }: MenuItemProps) => {
  const pathName = usePathname();
  // For the main dashboard item, only match exact path, not child routes
  const active = url === "/admin/dashboard"
    ? pathName === url
    : (pathName === url || pathName.startsWith(`${url}/`));

  return (
    <Link
      href={{ pathname: url }}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 transition-colors focus-visible:outline-hidden",
        {
          "bg-primary text-primary-foreground": active,
          "text-secondary-foreground/70 hover:bg-secondary focus-visible:bg-secondary":
            !active,
        },
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

export default memo(MenuItem);
