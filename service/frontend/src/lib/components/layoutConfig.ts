import * as Icons from "lucide-svelte";
import type { Route } from "$lib/types/Route";

export const primaryRoutes: Route[] = [
  {
    title: "Home",
    label: "128",
    route: "/",
    icon: Icons.Home,
    variant: "default",
  },
  {
    title: "User Management",
    label: "",
    route: "/users",
    icon: Icons.Users,
    variant: "ghost",
  },
];

export const secondaryRoutes: Route[] = [
  {
    title: "Settings",
    label: "",
    route: "/settings",
    icon: Icons.Settings,
    variant: "ghost",
  },
  {
    title: "Info",
    label: "",
    route: "/info",
    icon: Icons.Info,
    variant: "ghost",
  },
];
