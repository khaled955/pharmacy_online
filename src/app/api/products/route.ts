// [NEW] Products API route — used by Virtual Shelf drawer to fetch products
// [SAFE] This does not affect existing API logic (new route, no existing /api/products)
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/products/get-products.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    // Cap at 12 so we don't over-fetch inside the drawer panel
    const limit = Math.min(Number(searchParams.get("limit") ?? "8"), 12);

    const result = await getProducts({ category, limit, sort: "rating_desc" });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
