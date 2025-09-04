import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/root/Signin.tsx"),
  layout("routes/admin/AdminLayout.tsx", [
    route("dashboard", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/AllUsers.tsx"),
  ]),
] satisfies RouteConfig;
