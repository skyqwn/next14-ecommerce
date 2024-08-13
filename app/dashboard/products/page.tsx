import { db } from "@/server";
import { products } from "@/server/schema";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const ProductPage = async () => {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("등록된 제품이 없습니다.");

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error("등록된 제품을 찾을 수 없습니다.");
  return (
    <div className="">
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
};

export default ProductPage;
