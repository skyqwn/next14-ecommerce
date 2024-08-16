import ProductType from "@/components/products/product-type";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/fotmat-price";
import sanitizeHtml from "@/lib/santizeHtml";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugId = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugId;
  }
  return [];
}

const ProductDetailPage = async ({ params }: { params: { slug: string } }) => {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });
  if (variant) {
    const sanitizedHTML = sanitizeHtml(variant.product.description);

    return (
      <main className="">
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div className="flex-1">
            <ProductShowcase variants={variant.product.productVariants} />
          </div>
          <div className="flex gap-2 flex-col flex-1">
            <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
            <div className="">
              <ProductType variants={variant?.product.productVariants} />
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-medium py-2">
              {formatPrice(variant.product.price)}
            </p>
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }}></div>
            <p className="text-secondary-foreground font-medium my-2">
              Available Colors
            </p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((productVariant) => (
                <ProductPick
                  key={productVariant.id}
                  productId={variant.productId}
                  productType={productVariant.productType}
                  id={productVariant.id}
                  color={productVariant.color}
                  price={variant.product.price}
                  title={variant.product.title}
                  image={productVariant.variantImages[0].url}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }
};

export default ProductDetailPage;
