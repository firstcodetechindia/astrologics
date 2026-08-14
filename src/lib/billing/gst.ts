/** GST India — amounts in paise (minor units). Rate in basis points (1800 = 18%). */

export type GstSplit = "cgst_sgst" | "igst";

export type GstBreakdown = {
  amountMinor: number;
  taxableMinor: number;
  gstMinor: number;
  cgstMinor: number;
  sgstMinor: number;
  igstMinor: number;
  gstRateBps: number;
  split: GstSplit;
  placeOfSupply: string;
};

export function rupees(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

export function gstBreakdown(input: {
  amountMinorInclGst: number;
  gstRateBps: number;
  sellerStateCode: string;
  buyerStateCode: string;
}): GstBreakdown {
  const rate = Math.max(0, input.gstRateBps);
  const amount = Math.max(0, Math.round(input.amountMinorInclGst));
  const taxable =
    rate === 0 ? amount : Math.round((amount * 10000) / (10000 + rate));
  const gst = amount - taxable;
  const sameState =
    input.sellerStateCode.trim().toUpperCase() ===
    input.buyerStateCode.trim().toUpperCase();
  if (sameState) {
    const cgst = Math.floor(gst / 2);
    const sgst = gst - cgst;
    return {
      amountMinor: amount,
      taxableMinor: taxable,
      gstMinor: gst,
      cgstMinor: cgst,
      sgstMinor: sgst,
      igstMinor: 0,
      gstRateBps: rate,
      split: "cgst_sgst",
      placeOfSupply: input.buyerStateCode.trim().toUpperCase(),
    };
  }
  return {
    amountMinor: amount,
    taxableMinor: taxable,
    gstMinor: gst,
    cgstMinor: 0,
    sgstMinor: 0,
    igstMinor: gst,
    gstRateBps: rate,
    split: "igst",
    placeOfSupply: input.buyerStateCode.trim().toUpperCase(),
  };
}

export type CommissionSplit = {
  taxableMinor: number;
  gstMinor: number;
  commissionBps: number;
  platformMinor: number;
  astrologerMinor: number;
};

export function commissionSplit(
  taxableMinor: number,
  gstMinor: number,
  commissionBps: number
): CommissionSplit {
  const bps = Math.min(10000, Math.max(0, commissionBps));
  const platform = Math.round((taxableMinor * bps) / 10000);
  const astrologer = taxableMinor - platform;
  return {
    taxableMinor,
    gstMinor,
    commissionBps: bps,
    platformMinor: platform,
    astrologerMinor: astrologer,
  };
}
