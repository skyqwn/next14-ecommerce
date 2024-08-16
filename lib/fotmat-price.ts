export default function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    currency: "KRW",
    style: "currency",
  }).format(price);
}
