import { usePathname } from "next/navigation";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type SubmenuItem = {
  id: number | string;
  title: string;
  url: string;
};

type MenuCollapsibleProps = {
  icon: React.ReactNode;
  title: string;
  baseUrl: string;
  children: React.ReactNode;
  submenu?: SubmenuItem[];
};

const MenuCollapsible = ({
  icon,
  title,
  baseUrl,
  submenu = [],
  children,
}: MenuCollapsibleProps) => {
  const pathName = usePathname();
  const matchesSubmenu = submenu.some((item) =>
    pathName === item.url || pathName.startsWith(`${item.url}/`)
  );
  const matchesBase = pathName === baseUrl;
  const active = matchesBase || matchesSubmenu;
  const [open, setOpen] = useState(active);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 transition-colors focus-visible:outline-hidden",
            {
              "bg-primary text-primary-foreground": active,
              "text-secondary-foreground/70 hover:bg-secondary focus-visible:bg-secondary":
                !active,
            },
          )}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <LuChevronDown
            className={`icon transition ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="my-1.5 ml-[22px] space-y-1.5 border-l">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MenuCollapsible;
