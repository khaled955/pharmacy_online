
export default  async function ProductDetailsPage(props:PageProps<`/products/[...productSlug]`>) {
  const productSlug = (await props.params).productSlug.join("/");
  console.log(productSlug);
  return (
    <div>
      <h1>Product Details</h1>
      <p>Slug: {productSlug}</p>

    </div>
  )
}
