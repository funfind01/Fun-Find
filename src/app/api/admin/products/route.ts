import { NextResponse } from "next/server";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  type ProductPayload,
  updateAdminProduct,
} from "@/utils/products";
import { adminUnauthorizedResponse, hasValidAdminSession, isMissingProductsTableError } from "@/utils/admin-auth";

const setupRequiredResponse = () =>
  NextResponse.json({
    products: [],
    setupRequired: true,
    message: "Inventory table not initialized. Run supabase/products.sql.",
  });

export async function GET() {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ products });
  } catch (error) {
    if (isMissingProductsTableError(error)) {
      return setupRequiredResponse();
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  const payload = (await request.json()) as ProductPayload;

  try {
    const product = await createAdminProduct(payload);
    return NextResponse.json({ product });
  } catch (error) {
    if (isMissingProductsTableError(error)) {
      return NextResponse.json(
        { error: "Inventory table not initialized. Run supabase/products.sql.", setupRequired: true },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  const payload = (await request.json()) as ProductPayload;

  try {
    const product = await updateAdminProduct(payload);
    return NextResponse.json({ product });
  } catch (error) {
    if (isMissingProductsTableError(error)) {
      return NextResponse.json(
        { error: "Inventory table not initialized. Run supabase/products.sql.", setupRequired: true },
        { status: 409 },
      );
    }

    const status = error instanceof Error && error.message === "Missing product id" ? 400 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update product" }, { status });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasValidAdminSession())) {
    return adminUnauthorizedResponse();
  }

  const { id } = (await request.json()) as { id?: string };

  try {
    await deleteAdminProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isMissingProductsTableError(error)) {
      return NextResponse.json(
        { error: "Inventory table not initialized. Run supabase/products.sql.", setupRequired: true },
        { status: 409 },
      );
    }

    const status = error instanceof Error && error.message === "Missing product id" ? 400 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete product" }, { status });
  }
}
