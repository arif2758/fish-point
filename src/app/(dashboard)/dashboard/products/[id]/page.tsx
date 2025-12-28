import { notFound } from "next/navigation"
import { getProductById } from "@/actions/product"
import ProductForm from "@/components/admin/products/ProductForm"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await getProductById(id)

  if (!product) {
    return notFound()
  }

  return (
    <ProductForm initialData={product} />
  )
}