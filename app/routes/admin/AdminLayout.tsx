import { MobileSidebar, NavItems } from "components";
import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { account } from "~/appwrite/client";
import { getExistingUser, signUpUser } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();
    console.log("User: ", user);
    if (!user.$id) {
      return redirect("/sign-in");
    }
    const newUser = await signUpUser();
    if (newUser?.status === "user") return redirect("/");
    return newUser;
  } catch (error) {
    console.log("Error in Client Loader", error);
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
