"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChatIcon,
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  MailIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import Last20Logo from "@/components/_content/Last20Logo";
import { SearchIcon, TicketIcon } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  for?: "viber" | "coder" | "admin";
  isMenuOpen?: boolean;
};

const navItems: NavItem[] = [
  {
    for: "viber",
    icon: <TicketIcon />,
    name: "Tasks / Jobs",
    isMenuOpen: true,
    subItems: [
      // { name: "Open", path: "/dashboard/tasks/open", pro: false },
      { name: "Claimed", path: "/dashboard/tasks/claimed", pro: false },
      { name: "In Progress", path: "/dashboard/tasks/inprogress", pro: false },
      { name: "Delivered", path: "/dashboard/tasks/delivered", pro: false },
      { name: "Completed", path: "/dashboard/tasks/completed", pro: false },
      { name: "Disputed", path: "/dashboard/tasks/disputed", pro: false },
      { name: "Cancelled", path: "/dashboard/tasks/cancelled", pro: false },
    ],
  },
  {
    for: "coder",
    isMenuOpen: true,
    icon: <SearchIcon />,
    name: "Task Search",
    subItems: [{ name: "Search", path: "/dashboard/search", pro: false }],
  },
  {
    for: "coder",
    isMenuOpen: true,
    icon: <TicketIcon />,
    name: "Your Tasks / Jobs",
    subItems: [
      {
        name: "Claimed",
        path: "/dashboard/tasks/claimed",
        pro: false,
      },
      { name: "In progress", path: "/dashboard/tasks/inprogress", pro: false },
      { name: "Delivered", path: "/dashboard/tasks/delivered", pro: false },
      { name: "Completed", path: "/dashboard/tasks/completed", pro: false },
      { name: "Disputed", path: "/dashboard/tasks/disputed", pro: false },
      { name: "Cancelled", path: "/dashboard/tasks/cancelled", pro: false },
    ],
  },

  {
    for: "admin",
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Ecommerce", path: "/", pro: false },
      { name: "Analytics", path: "/analytics", pro: true },
      { name: "Marketing", path: "/marketing", pro: true },
      { name: "CRM", path: "/crm", pro: true },
      { name: "Stocks", path: "/stocks", new: true, pro: true },
      { name: "SaaS", path: "/saas", new: true, pro: true },
    ],
  },
  {
    for: "admin",
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    for: "admin",
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    for: "admin",
    name: "Task",
    icon: <TaskIcon />,
    subItems: [
      { name: "List", path: "/task-list", pro: true },
      { name: "Kanban", path: "/task-kanban", pro: true },
    ],
  },
  {
    for: "admin",
    name: "Forms",
    icon: <ListIcon />,
    subItems: [
      { name: "Form Elements", path: "/form-elements", pro: false },
      { name: "Form Layout", path: "/form-layout", pro: true },
    ],
  },
  {
    for: "admin",
    name: "Tables",
    icon: <TableIcon />,
    subItems: [
      { name: "Basic Tables", path: "/basic-tables", pro: false },
      { name: "Data Tables", path: "/data-tables", pro: true },
    ],
  },
  {
    for: "admin",
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "File Manager", path: "/file-manager", pro: true },
      { name: "Pricing Tables", path: "/pricing-tables", pro: true },
      { name: "Faqs", path: "/faq", pro: true },
      { name: "Blank Page", path: "/blank", pro: true },
      { name: "404 Error", path: "/error-404", pro: true },
      { name: "500 Error", path: "/error-500", pro: true },
      { name: "503 Error", path: "/error-503", pro: true },
      { name: "Coming Soon", path: "/coming-soon", pro: true },
      { name: "Maintenance", path: "/maintenance", pro: true },
      { name: "Success", path: "/success", pro: true },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: true },
      { name: "Bar Chart", path: "/bar-chart", pro: true },
      { name: "Pie Chart", path: "/pie-chart", pro: true },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: true },
      { name: "Avatar", path: "/avatars", pro: true },
      { name: "Badge", path: "/badge", pro: true },
      { name: "Breadcrumb", path: "/breadcrumb", pro: true },
      { name: "Buttons", path: "/buttons", pro: true },
      { name: "Buttons Group", path: "/buttons-group", pro: true },
      { name: "Cards", path: "/cards", pro: true },
      { name: "Carousel", path: "/carousel", pro: true },
      { name: "Dropdowns", path: "/dropdowns", pro: true },
      { name: "Images", path: "/images", pro: true },
      { name: "Links", path: "/links", pro: true },
      { name: "List", path: "/list", pro: true },
      { name: "Modals", path: "/modals", pro: true },
      { name: "Notification", path: "/notifications", pro: true },
      { name: "Pagination", path: "/pagination", pro: true },
      { name: "Popovers", path: "/popovers", pro: true },
      { name: "Progressbar", path: "/progress-bar", pro: true },
      { name: "Ribbons", path: "/ribbons", pro: true },
      { name: "Spinners", path: "/spinners", pro: true },
      { name: "Tabs", path: "/tabs", pro: true },
      { name: "Tooltips", path: "/tooltips", pro: true },
      { name: "Videos", path: "/videos", pro: true },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
      { name: "Reset Password", path: "/reset-password", pro: true },
      {
        name: "Two Step Verification",
        path: "/two-step-verification",
        pro: true,
      },
    ],
  },
];

const supportItems: NavItem[] = [
  {
    for: "admin",
    icon: <ChatIcon />,
    name: "Chat",
    path: "/chat",
  },
  {
    for: "admin",
    icon: <MailIcon />,
    name: "Email",
    subItems: [
      { name: "Inbox", path: "/inbox" },
      { name: "Details", path: "/inbox-details" },
    ],
  },
  {
    for: "admin",
    icon: <DocsIcon />,
    name: "Invoice",
    path: "/invoice",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { isViber, isCoder, isAdmin } = useUserContext();

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "support" | "others") => {
    // Filter items based on user role
    const filteredItems = navItems.filter((nav) => {
      if (!nav.for) return true; // Show items without role restriction
      if (nav.for === "viber" && isViber) return true;
      if (nav.for === "coder" && isCoder) return true;
      if (nav.for === "admin" && isAdmin) return true;
      return false;
    });

    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${
                  openSubmenus.has(`${menuType}-${index}`)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
              >
                <span
                  className={` ${
                    openSubmenus.has(`${menuType}-${index}`)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                      openSubmenus.has(`${menuType}-${index}`) ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenus.has(`${menuType}-${index}`)
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                            >
                              new
                            </span>
                          )}
                          {/* {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                            >
                              pro
                            </span>
                          )} */}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    const newOpenSubmenus = new Set<string>();

    ["main", "support", "others"].forEach((menuType) => {
      const items =
        menuType === "main" ? navItems : menuType === "support" ? supportItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          // Check if this menu should be open by default
          if (nav.isMenuOpen) {
            newOpenSubmenus.add(`${menuType}-${index}`);
          } else {
            nav.subItems.forEach((subItem) => {
              if (isActive(subItem.path)) {
                newOpenSubmenus.add(`${menuType}-${index}`);
              }
            });
          }
        }
      });
    });

    // Set the menus to open
    setOpenSubmenus(newOpenSubmenus);
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    openSubmenus.forEach((key) => {
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubmenus]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "support" | "others") => {
    const key = `${menuType}-${index}`;
    setOpenSubmenus((prevOpenSubmenus) => {
      const newSet = new Set(prevOpenSubmenus);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Last20Logo to="/dashboard" />
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Support" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(supportItems, "support")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
