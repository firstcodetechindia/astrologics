import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ no: string }> }
) {
  const { no } = await ctx.params;
  const sql = getSql();
  const rows = await sql`SELECT html, invoice_no FROM invoices WHERE invoice_no = ${no} LIMIT 1`;
  if (!rows[0]) {
    return NextResponse.json({ ok: false, error: "Invoice not found" }, { status: 404 });
  }
  return new NextResponse(String(rows[0].html), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${rows[0].invoice_no}.html"`,
    },
  });
}
