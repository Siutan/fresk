import * as Icons from "lucide-svelte";
import type { Route } from "$lib/types/Route";

export const primaryRoutes: Route[] = [
  {
    title: "Home",
    label: "",
    route: "/",
    icon: Icons.Home,
    variant: "default",
    adminRoute: false,
  },
  {
    title: "User Management",
    label: "",
    route: "/users",
    icon: Icons.Users,
    variant: "ghost",
    adminRoute: true,
  },
];

export const secondaryRoutes: Route[] = [
  {
    title: "Settings",
    label: "",
    route: "/settings",
    icon: Icons.Settings,
    variant: "ghost",
    adminRoute: false,
  },
  {
    title: "Info",
    label: "",
    route: "/info",
    icon: Icons.Info,
    variant: "ghost",
    adminRoute: false,
  },
];
