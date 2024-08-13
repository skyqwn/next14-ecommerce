import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import ProductForm from "./product-form";

const AddProductsPage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  return (
    <div className="">
      <ProductForm />
    </div>
  );
};

export default AddProductsPage;
