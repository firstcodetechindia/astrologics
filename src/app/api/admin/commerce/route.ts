import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/platform/admin-api";
import { getSql } from "@/lib/db";
import { writeAuditLog } from "@/lib/platform/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requirePermission(req, "finance:read");
  if ("response" in auth) return auth.response;
  const sql = getSql();
  const products = await sql`SELECT * FROM catalog_products ORDER BY created_at DESC`;
  const orders = await sql`
    SELECT o.*, p.name AS product_name, c.display_name AS customer_name, pay.status AS payment_status
    FROM shop_orders o
    LEFT JOIN catalog_products p ON p.id = o.product_id
    LEFT JOIN billing_customers c ON c.id = o.customer_id
    LEFT JOIN payments pay ON pay.id = o.payment_id
    ORDER BY o.created_at DESC
    LIMIT 80
  `;
  return NextResponse.json({ ok: true, products, orders });
}

export async function POST(req: Request) {
  const auth = await requirePermission(req, "finance:write");
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    slug?: string;
    kind?: string;
    description?: string;
    amountMinor?: number;
    inventory?: number | null;
    active?: boolean;
    orderId?: string;
    shippingStatus?: string;
  };
  const sql = getSql();
  if (body.orderId && body.shippingStatus) {
    await sql`UPDATE shop_orders SET shipping_status = ${body.shippingStatus} WHERE id = ${body.orderId}`;
    await writeAuditLog({
      actor: auth.staff,
      action: "order.ship",
      entityType: "shop_order",
      entityId: body.orderId,
      summary: `Shipping status ${body.shippingStatus}`,
    });
  } else {
    const slug =
      body.slug ||
      String(body.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
        `-${Date.now().toString(36)}`;
    await sql`
      INSERT INTO catalog_products (name, slug, kind, description, amount_minor, inventory, active)
      VALUES (
        ${String(body.name || "Product")},
        ${slug},
        ${body.kind === "physical" ? "physical" : "digital"},
        ${String(body.description || "")},
        ${Number(body.amountMinor || 0)},
        ${body.kind === "physical" ? Number(body.inventory ?? 0) : null},
        ${body.active !== false}
      )
    `;
    await writeAuditLog({
      actor: auth.staff,
      action: "product.create",
      entityType: "catalog_product",
      summary: `Created product ${body.name}`,
    });
  }
  const products = await sql`SELECT * FROM catalog_products ORDER BY created_at DESC`;
  const orders = await sql`
    SELECT o.*, p.name AS product_name, c.display_name AS customer_name
    FROM shop_orders o
    LEFT JOIN catalog_products p ON p.id = o.product_id
    LEFT JOIN billing_customers c ON c.id = o.customer_id
    ORDER BY o.created_at DESC LIMIT 80
  `;
  return NextResponse.json({ ok: true, products, orders });
}
