/*"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  icon: IconType | React.ReactNode;
  label: string;
  exact?: boolean;
  className?: string;
  iconSize?: number;
  showBadge?: boolean;
  badgeCount?: number;
}

export default function NavLink({
  href,
  icon: Icon,
  label,
  exact = false,
  className = "",
  iconSize = 22,
  showBadge = false,
  badgeCount = 0,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  // Import clsx utility at the top of the file
  

  return (
    <Link
      href={href}
      className={clsx(
        "nav-link position-relative d-flex flex-column align-items-center",
        "text-decoration-none p-2 mx-1 rounded-3",
        "transition-all duration-200",
        {
          "text-white bg-success bg-opacity-25": isActive,
          "text-secondary hover:text-white hover:bg-success hover:bg-opacity-10":
            !isActive,
        },
        className
      )}
    >
      <div className="position-relative">
        {typeof Icon === "function" ? <Icon size={iconSize} /> : Icon}
        {showBadge && badgeCount > 0 && (
          <span
            className={clsx(
              "position-absolute top-0 start-100 translate-middle",
              "badge rounded-pill bg-danger",
              {
                "p-1": badgeCount < 10,
                "p-1 px-2": badgeCount >= 10,
              }
            )}
          >
            {badgeCount > 9 ? "9+" : badgeCount}
            <span className="visually-hidden">notificações</span>
          </span>
        )}
      </div>
      <span className="small mt-1">{label}</span>
    </Link>
  );
}
*/