import { db } from "@/server";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const ProductPage = async () => {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("등록된 제품이 없습니다.");

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }

    const image = product.productVariants[0]?.variantImages[0]?.url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
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
