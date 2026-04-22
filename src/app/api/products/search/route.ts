import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/products/get-products.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [], meta: { totalItems: 0 } });
    }

    const result = await getProducts({ q, limit: 6, sort: "rating_desc" });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
