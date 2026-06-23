const fs = require('fs');

function edu(name) {
  return {
    h2_1: `Understanding ${name} Mechanics`,
    p_1: `Operating on the ${name} platform requires a deep understanding of its fee structure to maintain profitability. Like many digital commerce solutions, it utilizes a combination of percentage-based commissions and fixed transaction fees. Sellers must accurately account for cost of goods sold, shipping, and any marketing overhead to calculate true net margins. Failure to track these granular metrics often leads to scaled losses. By modeling these costs precisely, merchants can determine optimal pricing strategies, set profitable baseline metrics, and scale their operations with confidence, knowing their unit economics are structurally sound.`,
    h2_2: `Optimizing ${name} Margin Strategy`,
    p_2: `To optimize margins within ${name}, consider strategies that either increase average order value or reduce variable costs. Small adjustments to retail pricing can have disproportionate impacts on bottom-line profitability when fees are percentage-based. Additionally, streamlining logistics and reducing product acquisition costs will directly improve the net return per unit sold. Implementing tiered pricing, bundling items, or negotiating better rates with suppliers are proven methods to widen the profit gap. It is essential to continuously revisit these calculations as platform policies and market conditions evolve to ensure long-term sustainability.`
  };
}

const platforms = [
  // Archetype 1: Standard Marketplace & Transaction Gateways
  {
    slug: "amazon-fba", title: "Amazon FBA", category: "marketplace", metaDescription: "Calculate Amazon FBA fees and profit.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Gross Revenue", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 20, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping Cost", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "referralPercent", label: "Referral Fee (%)", type: "number", defaultValue: 15, min: 0, max: 100, step: 0.1 },
        { id: "fbaFee", label: "FBA Fee", type: "number", defaultValue: 4, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "revenue - cogs - shipping - (revenue * (referralPercent/100)) - fbaFee" } }
    },
    educationalContent: edu("Amazon FBA")
  },
  {
    slug: "etsy-fee-and-profit", title: "Etsy Fee & Profit", category: "marketplace", metaDescription: "Calculate Etsy processing, transaction, and ad fees.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Item Price", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "shippingCharged", label: "Shipping Charged", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 },
        { id: "shippingCost", label: "Actual Shipping Cost", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "isOffsiteAd", label: "Offsite Ad Sale?", type: "toggle", defaultValue: 0, min: 0, max: 1, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const proc = (revenue + shippingCharged) * 0.03 + 0.25; const trans = (revenue + shippingCharged) * 0.065; const ad = isOffsiteAd ? (revenue * 0.12) : 0; return revenue + shippingCharged - cogs - shippingCost - 0.20 - proc - trans - ad;" } }
    },
    educationalContent: edu("Etsy")
  },
  {
    slug: "ebay-promoted-listings", title: "eBay Promoted Listings", category: "marketplace", metaDescription: "eBay seller fee and ad rate calculator.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Item Price", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "shippingCharged", label: "Shipping Charged", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 30, min: 0, max: 10000, step: 0.01 },
        { id: "shippingCost", label: "Actual Shipping Cost", type: "number", defaultValue: 8, min: 0, max: 10000, step: 0.01 },
        { id: "ebayTierPercent", label: "Category Fee (%)", type: "number", defaultValue: 13.25, min: 0, max: 100, step: 0.01 },
        { id: "adRatePercent", label: "Ad Rate (%)", type: "slider", defaultValue: 2, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const ebayFee = (revenue + shippingCharged) * (ebayTierPercent/100) + 0.30; const adFee = revenue * (adRatePercent/100); return revenue + shippingCharged - cogs - shippingCost - ebayFee - adFee;" } }
    },
    educationalContent: edu("eBay")
  },
  {
    slug: "walmart-marketplace", title: "Walmart Marketplace", category: "marketplace", metaDescription: "Walmart seller fees and WFS profit calculator.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Gross Revenue", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 20, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "referralPercent", label: "Referral Percent", type: "number", defaultValue: 15, min: 0, max: 100, step: 0.1 },
        { id: "wfsFee", label: "WFS Fee", type: "number", defaultValue: 4, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "revenue - cogs - shipping - (revenue * (referralPercent/100)) - wfsFee" } }
    },
    educationalContent: edu("Walmart")
  },
  {
    slug: "poshmark-seller", title: "Poshmark Seller Profit", category: "marketplace", metaDescription: "Calculate Poshmark margins with tier logic.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Sale Price", type: "number", defaultValue: 30, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = revenue < 15 ? 2.95 : revenue * 0.20; return revenue - cogs - fee;" } }
    },
    educationalContent: edu("Poshmark")
  },
  {
    slug: "mercari-selling", title: "Mercari Net Profit", category: "marketplace", metaDescription: "Mercari dynamic fees and cash-out cost.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Sale Price", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = (revenue * 0.10) + (revenue * 0.029 + 0.50) + 2.00; return revenue - cogs - fee;" } }
    },
    educationalContent: edu("Mercari")
  },
  {
    slug: "vinted-net-income", title: "Vinted Net Income", category: "marketplace", metaDescription: "Vinted seller profit calculator.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Sale Price", type: "number", defaultValue: 40, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "revenue - cogs" } }
    },
    educationalContent: edu("Vinted")
  },
  {
    slug: "tiktok-shop-fee", title: "TikTok Shop Profit", category: "gateway", metaDescription: "TikTok shop category fees.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Revenue", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "categoryFeePercent", label: "Category Fee (%)", type: "number", defaultValue: 8, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = (revenue * (categoryFeePercent/100)) + 0.30; return revenue - cogs - shipping - fee;" } }
    },
    educationalContent: edu("TikTok Shop")
  },
  {
    slug: "tiktok-shop-affiliate-split", title: "TikTok Shop Affiliate Split", category: "marketing", metaDescription: "TikTok shop affiliate margin impact.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Revenue", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "affiliatePercent", label: "Affiliate Cut (%)", type: "slider", defaultValue: 15, min: 0, max: 100, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = revenue * (affiliatePercent/100); return revenue - cogs - shipping - fee;" } }
    },
    educationalContent: edu("TikTok Affiliate")
  },
  {
    slug: "instagram-shopping", title: "Instagram Shopping Fees", category: "gateway", metaDescription: "Meta commerce processing costs.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Revenue", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = (revenue * 0.029) + 0.30; return revenue - cogs - shipping - fee;" } }
    },
    educationalContent: edu("Instagram Shopping")
  },
  {
    slug: "youtube-shopping", title: "YouTube Shopping Splits", category: "marketing", metaDescription: "YouTube product tags and affiliate margins.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Revenue", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 40, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "commissionPercent", label: "Commission (%)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = revenue * (commissionPercent/100); return revenue - cogs - shipping - fee;" } }
    },
    educationalContent: edu("YouTube Shopping")
  },
  {
    slug: "pinterest-buyable-pins", title: "Pinterest Buyable Pins", category: "gateway", metaDescription: "Pinterest shopping integration fees.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Revenue", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "shipping", label: "Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const fee = (revenue * 0.023) + 0.30; return revenue - cogs - shipping - fee;" } }
    },
    educationalContent: edu("Pinterest Shopping")
  },
  {
    slug: "stripe-fee", title: "Stripe Fee Calculator", category: "gateway", metaDescription: "Calculate standard Stripe payment fees.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 2.9, flatFee: 0.30, extraRules: { archetype: 1, formula: "revenue - ((revenue * 0.029) + 0.30)" } }
    },
    educationalContent: edu("Stripe")
  },
  {
    slug: "paypal-merchant", title: "PayPal Merchant Fees", category: "gateway", metaDescription: "PayPal commercial transaction costs.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 3.49, flatFee: 0.49, extraRules: { archetype: 1, formula: "revenue - ((revenue * 0.0349) + 0.49)" } }
    },
    educationalContent: edu("PayPal")
  },
  {
    slug: "shopify-payments", title: "Shopify Payments Processor", category: "gateway", metaDescription: "Shopify payment gateway margins.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "planTier", label: "Plan Tier (1=Basic, 2=Shopify, 3=Advanced)", type: "slider", defaultValue: 1, min: 1, max: 3, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const rates = {1: [0.029, 0.30], 2: [0.026, 0.30], 3: [0.024, 0.30]}; const fee = (revenue * rates[planTier][0]) + rates[planTier][1]; return revenue - fee;" } }
    },
    educationalContent: edu("Shopify Payments")
  },
  {
    slug: "square-pos-retail", title: "Square POS Retail", category: "gateway", metaDescription: "Square face-to-face and remote fee calculator.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "isKeyed", label: "Manually Keyed?", type: "toggle", defaultValue: 0, min: 0, max: 1, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 1, formula: "const percent = isKeyed ? 0.035 : 0.026; const flat = isKeyed ? 0.15 : 0.10; const fee = (revenue * percent) + flat; return revenue - fee;" } }
    },
    educationalContent: edu("Square POS")
  },
  {
    slug: "klarna-bnpl-impact", title: "Klarna BNPL Impact", category: "gateway", metaDescription: "Buy Now Pay Later merchant costs.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 200, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 80, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 5.99, flatFee: 0.30, extraRules: { archetype: 1, formula: "revenue - cogs - ((revenue * 0.0599) + 0.30)" } }
    },
    educationalContent: edu("Klarna BNPL")
  },
  {
    slug: "afterpay-merchant", title: "Afterpay Merchant Fees", category: "gateway", metaDescription: "Afterpay merchant installment margins.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 200, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 80, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 6.0, flatFee: 0.30, extraRules: { archetype: 1, formula: "revenue - cogs - ((revenue * 0.06) + 0.30)" } }
    },
    educationalContent: edu("Afterpay")
  },

  // Archetype 2: Logistics, Volumetric, & Landed Cost Systems
  {
    slug: "amazon-fba-dimensional-weight", title: "FBA Dimensional Weight", category: "logistics", metaDescription: "Amazon dimensional volume vs physical weight.",
    calculatorConfig: {
      inputs: [
        { id: "length", label: "Length (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "width", label: "Width (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "height", label: "Height (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "actualWeight", label: "Actual Weight (lbs)", type: "number", defaultValue: 5, min: 0, max: 500, step: 0.1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "billableWeight", formula: "const dimWeight = (length * width * height) / 139; return Math.max(actualWeight, dimWeight);" } }
    },
    educationalContent: edu("FBA Dimensional Weight")
  },
  {
    slug: "amazon-aged-inventory-surcharge", title: "Aged Inventory Surcharge", category: "logistics", metaDescription: "Amazon stale inventory cost calculator.",
    calculatorConfig: {
      inputs: [
        { id: "length", label: "Length (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "width", label: "Width (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "height", label: "Height (in)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "units", label: "Units Stored", type: "number", defaultValue: 100, min: 0, max: 100000, step: 1 },
        { id: "monthsAged", label: "Months Aged", type: "slider", defaultValue: 7, min: 0, max: 24, step: 1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "surcharge", formula: "const cubicFeet = ((length * width * height) / 1728) * units; const rate = monthsAged > 12 ? 6.90 : monthsAged > 6 ? 3.80 : 0.78; return cubicFeet * rate;" } }
    },
    educationalContent: edu("Aged Inventory")
  },
  {
    slug: "stripe-cross-border-currency", title: "Stripe Cross Border FX", category: "gateway", metaDescription: "International payment gateway margins.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 },
        { id: "isCrossBorder", label: "Cross Border?", type: "toggle", defaultValue: 1, min: 0, max: 1, step: 1 },
        { id: "needsConversion", label: "Currency Conversion?", type: "toggle", defaultValue: 1, min: 0, max: 1, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, formula: "const rate = 0.029 + (isCrossBorder ? 0.01 : 0) + (needsConversion ? 0.01 : 0); const fee = (revenue * rate) + 0.30; return revenue - fee;" } }
    },
    educationalContent: edu("Stripe FX")
  },
  {
    slug: "paypal-micro-transactions", title: "PayPal Micro-Transactions", category: "gateway", metaDescription: "Compare micro vs standard PayPal rates.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 5, min: 0, max: 100, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "savings", formula: "const standardFee = (revenue * 0.0349) + 0.49; const microFee = (revenue * 0.05) + 0.05; return standardFee - microFee;" } }
    },
    educationalContent: edu("PayPal Micro")
  },
  {
    slug: "shopify-plan-breakeven", title: "Shopify Plan Breakeven", category: "gateway", metaDescription: "Find the optimal Shopify subscription tier.",
    calculatorConfig: {
      inputs: [
        { id: "monthlyVolume", label: "Monthly Sales Volume ($)", type: "number", defaultValue: 5000, min: 0, max: 500000, step: 100 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "optimalPlanCost", formula: "const b = 29 + (monthlyVolume * 0.029); const s = 79 + (monthlyVolume * 0.026); const a = 299 + (monthlyVolume * 0.024); return Math.min(b, s, a);" } }
    },
    educationalContent: edu("Shopify Breakeven")
  },
  {
    slug: "aliexpress-dropshipping", title: "AliExpress Dropshipping Margin", category: "logistics", metaDescription: "Calculate arbitrage landed cost margins.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Selling Price", type: "number", defaultValue: 30, min: 0, max: 10000, step: 0.01 },
        { id: "aliCost", label: "AliExpress Cost", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 },
        { id: "aliShipping", label: "AliExpress Shipping", type: "number", defaultValue: 3, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "profit", formula: "return retailPrice - aliCost - aliShipping;" } }
    },
    educationalContent: edu("AliExpress")
  },
  {
    slug: "cjdropshipping-landed-cost", title: "CJ Dropshipping Landed Cost", category: "logistics", metaDescription: "Aggregate CJ Dropshipping fulfillment costs.",
    calculatorConfig: {
      inputs: [
        { id: "productCost", label: "Product Cost", type: "number", defaultValue: 8, min: 0, max: 10000, step: 0.01 },
        { id: "shippingFee", label: "Shipping Fee", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "processingFee", label: "Processing Fee", type: "number", defaultValue: 1, min: 0, max: 1000, step: 0.01 },
        { id: "packagingFee", label: "Packaging Fee", type: "number", defaultValue: 0.5, min: 0, max: 1000, step: 0.01 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "landedCost", formula: "return productCost + shippingFee + processingFee + packagingFee;" } }
    },
    educationalContent: edu("CJ Dropshipping")
  },
  {
    slug: "printful-pod", title: "Printful POD Margins", category: "logistics", metaDescription: "Print-on-demand fulfillment tracking.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Selling Price", type: "number", defaultValue: 25, min: 0, max: 10000, step: 0.01 },
        { id: "printfulBaseCost", label: "Printful Cost", type: "number", defaultValue: 13, min: 0, max: 10000, step: 0.01 },
        { id: "customShipping", label: "Custom Shipping", type: "number", defaultValue: 4, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "profit", formula: "return retailPrice - printfulBaseCost - customShipping;" } }
    },
    educationalContent: edu("Printful")
  },
  {
    slug: "printify-variant", title: "Printify Variant Routing", category: "logistics", metaDescription: "Printify production center split tracking.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Selling Price", type: "number", defaultValue: 25, min: 0, max: 10000, step: 0.01 },
        { id: "printifyBase", label: "Printify Cost", type: "number", defaultValue: 12, min: 0, max: 10000, step: 0.01 },
        { id: "routingMargin", label: "Routing Overhead (%)", type: "number", defaultValue: 5, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "profit", formula: "return retailPrice - (printifyBase * (1 - routingMargin/100));" } }
    },
    educationalContent: edu("Printify")
  },
  {
    slug: "teespring-apparel", title: "Teespring Royalty", category: "logistics", metaDescription: "Simple Teespring creator royalty calculator.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Selling Price", type: "number", defaultValue: 28, min: 0, max: 1000, step: 0.01 },
        { id: "apparelBaseCost", label: "Base Cost", type: "number", defaultValue: 15, min: 0, max: 1000, step: 0.01 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "profit", formula: "return retailPrice - apparelBaseCost;" } }
    },
    educationalContent: edu("Teespring")
  },
  {
    slug: "international-hs-tariff", title: "International Duty & VAT", category: "logistics", metaDescription: "Calculate HS Code tariffs and localized VAT.",
    calculatorConfig: {
      inputs: [
        { id: "fobValue", label: "Product Value (FOB)", type: "number", defaultValue: 1000, min: 0, max: 1000000, step: 1 },
        { id: "freightCost", label: "Freight Cost", type: "number", defaultValue: 200, min: 0, max: 100000, step: 1 },
        { id: "dutyPercent", label: "Import Duty (%)", type: "number", defaultValue: 5, min: 0, max: 100, step: 0.1 },
        { id: "vatPercent", label: "VAT (%)", type: "number", defaultValue: 20, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "totalLanded", formula: "const cifValue = fobValue + freightCost; const dutyAmount = cifValue * (dutyPercent/100); const vatAmount = (cifValue + dutyAmount) * (vatPercent/100); return cifValue + dutyAmount + vatAmount;" } }
    },
    educationalContent: edu("Import Tariffs")
  },
  {
    slug: "ocean-container-freight-splitter", title: "Ocean Container CBM Splitter", category: "logistics", metaDescription: "Allocate sea freight costs by volumetric share.",
    calculatorConfig: {
      inputs: [
        { id: "totalFreight", label: "Total Container Cost", type: "number", defaultValue: 3500, min: 0, max: 50000, step: 1 },
        { id: "totalCBM", label: "Total Container CBM", type: "number", defaultValue: 33, min: 0, max: 100, step: 0.1 },
        { id: "unitLength", label: "Unit Length (cm)", type: "number", defaultValue: 40, min: 0, max: 500, step: 1 },
        { id: "unitWidth", label: "Unit Width (cm)", type: "number", defaultValue: 30, min: 0, max: 500, step: 1 },
        { id: "unitHeight", label: "Unit Height (cm)", type: "number", defaultValue: 20, min: 0, max: 500, step: 1 },
        { id: "totalUnits", label: "Total Units", type: "number", defaultValue: 500, min: 1, max: 100000, step: 1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "totalShare", formula: "const unitCBM = (unitLength * unitWidth * unitHeight) / 1000000; return totalFreight * ((unitCBM * totalUnits) / totalCBM);" } }
    },
    educationalContent: edu("Ocean Freight CBM")
  },
  {
    slug: "air-freight-volumetric", title: "Air Freight Volumetric", category: "logistics", metaDescription: "Airway bill dimensional divisor calculations.",
    calculatorConfig: {
      inputs: [
        { id: "length", label: "Length (cm)", type: "number", defaultValue: 50, min: 0, max: 500, step: 1 },
        { id: "width", label: "Width (cm)", type: "number", defaultValue: 40, min: 0, max: 500, step: 1 },
        { id: "height", label: "Height (cm)", type: "number", defaultValue: 30, min: 0, max: 500, step: 1 },
        { id: "actualWeight", label: "Actual Weight (kg)", type: "number", defaultValue: 10, min: 0, max: 1000, step: 0.1 },
        { id: "unitCount", label: "Unit Count", type: "number", defaultValue: 10, min: 1, max: 10000, step: 1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "totalBillable", formula: "const volWeight = (length * width * height) / 5000; return Math.max(actualWeight, volWeight) * unitCount;" } }
    },
    educationalContent: edu("Air Freight")
  },
  {
    slug: "3pl-warehouse-fulfillment", title: "3PL Fulfillment Overhead", category: "logistics", metaDescription: "Amortize monthly storage and pick-pack fees.",
    calculatorConfig: {
      inputs: [
        { id: "monthlyStorage", label: "Monthly Storage ($)", type: "number", defaultValue: 500, min: 0, max: 50000, step: 1 },
        { id: "totalUnitsStored", label: "Units Stored", type: "number", defaultValue: 2000, min: 1, max: 1000000, step: 1 },
        { id: "pickPackFee", label: "Pick & Pack Fee ($/unit)", type: "number", defaultValue: 2.50, min: 0, max: 100, step: 0.01 },
        { id: "receivingFee", label: "Total Receiving Fee ($)", type: "number", defaultValue: 100, min: 0, max: 10000, step: 1 },
        { id: "unitsProcessed", label: "Units Processed (Inbound)", type: "number", defaultValue: 500, min: 1, max: 100000, step: 1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "perUnitCost", formula: "const amStorage = monthlyStorage / totalUnitsStored; const amRec = receivingFee / unitsProcessed; return amStorage + amRec + pickPackFee;" } }
    },
    educationalContent: edu("3PL Fulfillment")
  },
  {
    slug: "e-commerce-returns-cost", title: "True Cost of Returns", category: "logistics", metaDescription: "Calculate financial drain of reverse logistics.",
    calculatorConfig: {
      inputs: [
        { id: "returnRate", label: "Return Rate (%)", type: "number", defaultValue: 10, min: 0, max: 100, step: 0.1 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 20, min: 0, max: 10000, step: 0.01 },
        { id: "outboundShipping", label: "Outbound Shipping", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "returnShipping", label: "Return Shipping", type: "number", defaultValue: 6, min: 0, max: 10000, step: 0.01 },
        { id: "restockLabor", label: "Restock Labor", type: "number", defaultValue: 2, min: 0, max: 1000, step: 0.01 },
        { id: "resaleValue", label: "Salvage Resale Value", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "netReturnImpact", formula: "const lossPerReturn = cogs + outboundShipping + returnShipping + restockLabor - resaleValue; return (returnRate / 100) * lossPerReturn;" } }
    },
    educationalContent: edu("E-commerce Returns")
  },
  {
    slug: "supplier-bulk-moq", title: "MOQ Bulk Order Savings", category: "logistics", metaDescription: "Balance MOQ savings vs inventory holding costs.",
    calculatorConfig: {
      inputs: [
        { id: "orderQty", label: "Order Quantity", type: "number", defaultValue: 1000, min: 1, max: 1000000, step: 1 },
        { id: "unitPrice", label: "Unit Price", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 },
        { id: "holdingRatePercent", label: "Annual Holding Rate (%)", type: "number", defaultValue: 20, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "logistics_volumetric", basePercentage: 0, flatFee: 0, extraRules: { archetype: 2, metric: "totalCost", formula: "const purchaseCost = orderQty * unitPrice; const holdingCost = (orderQty / 2) * (unitPrice * (holdingRatePercent/100)); return purchaseCost + holdingCost;" } }
    },
    educationalContent: edu("MOQ Sourcing")
  },

  // Archetype 3: Paid Media Ad Spend & Marketing Economics
  {
    slug: "target-breakeven-roas", title: "Target Break-even ROAS", category: "marketing", metaDescription: "Find the exact ad multiplier ceiling for profit.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Retail Price", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "transactionFees", label: "Transaction Fees", type: "number", defaultValue: 2, min: 0, max: 1000, step: 0.01 },
        { id: "shippingCost", label: "Shipping Cost", type: "number", defaultValue: 5, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "breakevenROAS", formula: "const netMargin = retailPrice - cogs - transactionFees - shippingCost; return retailPrice / netMargin;" } }
    },
    educationalContent: edu("Break-even ROAS")
  },
  {
    slug: "maximum-allowed-cpa", title: "Maximum Allowed CPA", category: "marketing", metaDescription: "Define maximum acquisition ceiling.",
    calculatorConfig: {
      inputs: [
        { id: "retailPrice", label: "Retail Price", type: "number", defaultValue: 50, min: 0, max: 10000, step: 0.01 },
        { id: "cogs", label: "COGS", type: "number", defaultValue: 15, min: 0, max: 10000, step: 0.01 },
        { id: "fees", label: "Total Fees & Shipping", type: "number", defaultValue: 7, min: 0, max: 10000, step: 0.01 },
        { id: "desiredProfit", label: "Desired Profit ($)", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "maxCPA", formula: "return retailPrice - cogs - fees - desiredProfit;" } }
    },
    educationalContent: edu("Maximum CPA")
  },
  {
    slug: "customer-lifetime-value", title: "Customer Lifetime Value", category: "marketing", metaDescription: "Measure long-term CLV profiles.",
    calculatorConfig: {
      inputs: [
        { id: "avgOrderValue", label: "Average Order Value ($)", type: "number", defaultValue: 60, min: 0, max: 10000, step: 0.01 },
        { id: "purchaseFrequency", label: "Purchases Per Year", type: "number", defaultValue: 2.5, min: 0, max: 1000, step: 0.1 },
        { id: "lifespanYears", label: "Lifespan (Years)", type: "number", defaultValue: 3, min: 0, max: 100, step: 0.1 },
        { id: "grossMarginPercent", label: "Gross Margin (%)", type: "number", defaultValue: 40, min: 0, max: 100, step: 0.1 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "clv", formula: "return avgOrderValue * purchaseFrequency * lifespanYears * (grossMarginPercent/100);" } }
    },
    educationalContent: edu("CLV")
  },
  {
    slug: "average-order-value-threshold", title: "AOV Free Shipping Threshold", category: "marketing", metaDescription: "Evaluate free shipping cart minimum lifts.",
    calculatorConfig: {
      inputs: [
        { id: "currentAOV", label: "Current AOV ($)", type: "number", defaultValue: 45, min: 0, max: 10000, step: 0.01 },
        { id: "freeShippingMin", label: "Proposed Free Shipping Min ($)", type: "number", defaultValue: 60, min: 0, max: 10000, step: 0.01 },
        { id: "conversionDropPercent", label: "Conversion Drop (%)", type: "slider", defaultValue: 5, min: 0, max: 100, step: 1 },
        { id: "marginPercent", label: "Gross Margin (%)", type: "number", defaultValue: 50, min: 0, max: 100, step: 0.1 },
        { id: "carrierCost", label: "Carrier Shipping Cost ($)", type: "number", defaultValue: 8, min: 0, max: 1000, step: 0.01 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "profitLift", formula: "const currentProfit = currentAOV * (marginPercent/100); const newProfit = (freeShippingMin * (marginPercent/100) * (1 - conversionDropPercent/100)) - carrierCost; return newProfit - currentProfit;" } }
    },
    educationalContent: edu("AOV Expansion")
  },
  {
    slug: "customer-acquisition-cost-payback", title: "CAC Payback Period", category: "marketing", metaDescription: "Compute CAC operational runway.",
    calculatorConfig: {
      inputs: [
        { id: "cac", label: "Customer Acquisition Cost ($)", type: "number", defaultValue: 30, min: 0, max: 10000, step: 0.01 },
        { id: "monthlyGrossMargin", label: "Monthly Margin Per User ($)", type: "number", defaultValue: 10, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "paybackMonths", formula: "return cac / monthlyGrossMargin;" } }
    },
    educationalContent: edu("CAC Payback")
  },
  {
    slug: "ubereats-merchant", title: "UberEats Merchant Cut", category: "marketing", metaDescription: "UberEats payout configurations.",
    calculatorConfig: {
      inputs: [
        { id: "orderValue", label: "Order Value ($)", type: "number", defaultValue: 40, min: 0, max: 1000, step: 0.01 },
        { id: "deliveryType", label: "Delivery Type (1=Market, 0=Self)", type: "toggle", defaultValue: 1, min: 0, max: 1, step: 1 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "payout", formula: "const rate = deliveryType ? 0.30 : 0.15; return orderValue * (1 - rate);" } }
    },
    educationalContent: edu("UberEats")
  },
  {
    slug: "doordash-storefront", title: "DoorDash Storefront Tiers", category: "marketing", metaDescription: "DoorDash merchant plans.",
    calculatorConfig: {
      inputs: [
        { id: "orderValue", label: "Order Value ($)", type: "number", defaultValue: 40, min: 0, max: 1000, step: 0.01 },
        { id: "planType", label: "Plan Tier (1=Basic, 2=Plus, 3=Premier)", type: "slider", defaultValue: 1, min: 1, max: 3, step: 1 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "payout", formula: "const rates = {1: 0.15, 2: 0.25, 3: 0.30}; return orderValue * (1 - rates[planType]);" } }
    },
    educationalContent: edu("DoorDash")
  },
  {
    slug: "instacart-grocer", title: "Instacart Grocer Margins", category: "marketing", metaDescription: "Instacart listing markup simulator.",
    calculatorConfig: {
      inputs: [
        { id: "wholesaleCost", label: "Wholesale Cost ($)", type: "number", defaultValue: 10, min: 0, max: 1000, step: 0.01 },
        { id: "storeMarkupPercent", label: "In-App Markup (%)", type: "slider", defaultValue: 20, min: 0, max: 200, step: 1 }
      ],
      formulas: { type: "marketing_roas", basePercentage: 0, flatFee: 0, extraRules: { archetype: 3, metric: "netStoreReturn", formula: "const listed = wholesaleCost * (1 + storeMarkupPercent/100); const comm = listed * 0.10; return listed - comm;" } }
    },
    educationalContent: edu("Instacart")
  },

  // Archetype 4: The Regional / Tax Duplication Matrix
  {
    slug: "stripe-fee-us", title: "Stripe US Processing", category: "gateway", metaDescription: "Stripe fee calculator for US merchants.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 2.9, flatFee: 0.30, extraRules: { archetype: 4, symbol: "$", formula: "revenue - ((revenue * 0.029) + 0.30)" } }
    },
    educationalContent: edu("Stripe US")
  },
  {
    slug: "stripe-fee-uk", title: "Stripe UK Processing", category: "gateway", metaDescription: "Stripe fee calculator for UK merchants.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 1.5, flatFee: 0.20, extraRules: { archetype: 4, symbol: "£", formula: "revenue - ((revenue * 0.015) + 0.20)" } }
    },
    educationalContent: edu("Stripe UK")
  },
  {
    slug: "stripe-fee-canada", title: "Stripe Canada Processing", category: "gateway", metaDescription: "Stripe fee calculator for Canadian merchants.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 100, min: 0, max: 10000, step: 0.01 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 2.9, flatFee: 0.30, extraRules: { archetype: 4, symbol: "$", formula: "revenue - ((revenue * 0.029) + 0.30)" } }
    },
    educationalContent: edu("Stripe Canada")
  },
  {
    slug: "paypal-fee-india", title: "PayPal India", category: "gateway", metaDescription: "PayPal fee calculator for Indian merchants.",
    calculatorConfig: {
      inputs: [
        { id: "revenue", label: "Transaction Amount", type: "number", defaultValue: 1000, min: 0, max: 100000, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 4.4, flatFee: 0.00, extraRules: { archetype: 4, symbol: "₹", formula: "revenue - (revenue * 0.044)" } }
    },
    educationalContent: edu("PayPal India")
  },
  {
    slug: "vat-margin-germany", title: "Germany VAT Extractor", category: "gateway", metaDescription: "Separate product revenue from German VAT liabilities.",
    calculatorConfig: {
      inputs: [
        { id: "grossAmount", label: "Gross Amount", type: "number", defaultValue: 119, min: 0, max: 100000, step: 0.01 },
        { id: "isReducedRate", label: "Reduced Rate (7%)?", type: "toggle", defaultValue: 0, min: 0, max: 1, step: 1 }
      ],
      formulas: { type: "percentage_flat", basePercentage: 0, flatFee: 0, extraRules: { archetype: 4, metric: "netAmount", symbol: "€", formula: "const vatRate = isReducedRate ? 7.0 : 19.0; const net = grossAmount / (1 + (vatRate / 100)); return net;" } }
    },
    educationalContent: edu("German VAT")
  }
];

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/platforms.json', JSON.stringify(platforms, null, 2));
console.log('Successfully generated platforms.json with ' + platforms.length + ' entries.');
