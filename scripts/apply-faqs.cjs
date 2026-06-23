const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(process.cwd(), 'src/data/platforms.json');

const platformFaqs = {
  "amazon-fba": [
    { q: "How is the Amazon FBA referral fee applied to gross revenue?", a: "Amazon applies its referral fee (typically 15% for standard categories) to the total sales price, including shipping and gift-wrap charges, before any FBA fulfillment fees are deducted." },
    { q: "Does the FBA fulfillment fee scale linearly with product weight?", a: "No. The FBA fulfillment fee is tiered based on size and weight classifications (e.g., Standard-size vs. Oversize). A few ounces over a tier threshold can drastically increase the baseline fee." },
    { q: "How do COGS impact the final Amazon FBA net margin?", a: "While Amazon fees are calculated on top-line revenue, Cost of Goods Sold (COGS) is deducted post-fees. High COGS combined with a 15% referral and FBA fulfillment fees heavily compresses net margin." }
  ],
  "etsy-fee-and-profit": [
    { q: "How does Etsy calculate its 6.5% transaction fee?", a: "Etsy charges a 6.5% transaction fee on the total order amount, which includes the listing price, shipping cost, and any gift-wrapping. This is applied independently of the payment processing fee." },
    { q: "What is the impact of the fixed $0.20 listing fee on micro-transactions?", a: "For low-ticket items under $5, the flat $0.20 listing fee (and $0.25 payment processing clip) severely erodes net profit margins, representing a massive percentage of the top-line revenue." },
    { q: "Are Etsy Payment processing fees calculated pre-tax or post-tax?", a: "Etsy Payment processing fees (typically 3% + $0.25 in the US) are applied to the gross order total, including sales tax, meaning sellers pay fees on tax revenue they don't keep." }
  ],
  "ebay-promoted-listings": [
    { q: "How are eBay Promoted Listings Standard ad fees calculated?", a: "Promoted Listings fees are charged as a percentage of the total transaction amount (item price + shipping + tax) only if the item sells within 30 days of a click on the promoted ad." },
    { q: "Is the eBay Final Value Fee (FVF) applied before or after Promoted Listing fees?", a: "The Final Value Fee (typically 13.25% + $0.30) is calculated on the total amount of the sale. The Promoted Listings ad fee is an additional percentage applied on top of the FVF." },
    { q: "What happens to the $0.30 fixed order fee on multi-item orders?", a: "eBay charges the $0.30 fixed order fee per order, not per item. If a buyer purchases multiple items in a single transaction, you only pay the $0.30 fee once." }
  ],
  "walmart-marketplace": [
    { q: "How does Walmart's referral fee structure differ from Amazon?", a: "Unlike Amazon, Walmart does not charge monthly subscription fees. Sellers only pay a category-specific referral fee (typically 8% to 15%) upon a successful sale." },
    { q: "Does Walmart Marketplace charge payment processing fees?", a: "No, Walmart covers the credit card payment processing costs. The referral fee is the only platform deduction unless you opt into Walmart Fulfillment Services (WFS)." },
    { q: "Are Walmart referral fees applied to shipping charges?", a: "Yes. Walmart applies the referral fee percentage to the gross sales proceeds, which includes both the item price and any shipping fees charged to the customer." }
  ],
  "poshmark-seller": [
    { q: "How does Poshmark's flat fee structure work for items under $15?", a: "For sales under $15, Poshmark deducts a flat $2.95 commission. This aggressively compresses margins on low-ticket items, making a $10 sale yield only $7.05 before COGS." },
    { q: "What is the fee percentage for Poshmark sales over $15?", a: "For sales of $15 or more, Poshmark takes a flat 20% commission on the total sale price, which includes payment processing and basic shipping logistics." },
    { q: "Are sellers responsible for Poshmark shipping costs?", a: "Poshmark buyers pay a flat shipping fee ($7.97) directly. Sellers only pay shipping costs if they opt to offer a 'Shipping Discount' to incentivize the sale, which is deducted from their payout." }
  ],
  "mercari-selling": [
    { q: "Does Mercari charge sellers a payment processing fee?", a: "Yes, Mercari charges sellers a payment processing fee of 2.9% plus a flat $0.50 per transaction, calculated on the total order amount (including shipping and tax)." },
    { q: "What is the baseline Mercari selling fee?", a: "Mercari charges a flat 10% selling fee on the item price upon a successful completion of a sale, distinct from the payment processing fee." },
    { q: "How does the $0.50 flat fee impact low-ticket items on Mercari?", a: "Similar to Stripe's $0.30 clip, Mercari's flat $0.50 transaction fee heavily penalizes items sold under $10, creating an asymmetric drop in net margin for micro-sales." }
  ],
  "vinted-net-income": [
    { q: "Are there any seller fees on Vinted?", a: "No. Vinted is unique because it charges absolutely zero selling fees, listing fees, or commission rates to sellers. Sellers keep 100% of their item price." },
    { q: "How does Vinted monetize if sellers pay nothing?", a: "Vinted shifts the platform cost entirely to the buyer by charging a 'Buyer Protection Fee' (typically 5% + a fixed amount) on top of the item price and shipping." },
    { q: "What is the primary margin constraint for Vinted sellers?", a: "Since platform fees are zero, a Vinted seller's margin is purely defined by their Cost of Goods Sold (COGS) and any custom packaging materials they supply." }
  ],
  "tiktok-shop-fee": [
    { q: "What is the standard TikTok Shop referral fee?", a: "TikTok Shop recently increased its referral fee to a standard 8% on the total order amount, ending its aggressive early-adoption promotional periods." },
    { q: "Is the TikTok payment processing fee bundled?", a: "No, in addition to the 8% referral fee, TikTok typically deducts a standard payment processing fee (roughly 2.9% + $0.30) depending on the regional payment gateway." },
    { q: "Do TikTok Shop subsidies affect seller payouts?", a: "TikTok frequently issues buyer coupons out of pocket. Sellers receive the full payout based on the listing price; the 8% fee is calculated before the TikTok subsidy." }
  ],
  "tiktok-shop-affiliate-split": [
    { q: "How is the TikTok Affiliate commission calculated?", a: "Sellers set an open or targeted affiliate commission (e.g., 10-20%). This percentage is deducted directly from the seller's gross item revenue upon a successful conversion." },
    { q: "Does the affiliate split apply to shipping fees?", a: "No. The affiliate commission percentage is calculated strictly on the product's selling price, excluding shipping costs and sales tax." },
    { q: "Is the TikTok Shop platform fee calculated post-affiliate deduction?", a: "No, TikTok calculates its 8% platform fee on the gross top-line revenue. Both the platform fee and the affiliate payout are independently subtracted from the seller's margin." }
  ],
  "instagram-shopping": [
    { q: "What are the transaction fees for Instagram Checkout?", a: "Instagram (Meta) typically charges a standard 5% selling fee per shipment, or a flat fee of $0.40 for shipments under $8.00." },
    { q: "Are payment processing fees included in Instagram's 5% cut?", a: "Yes, the 5% selling fee is inclusive of credit card processing fees, meaning sellers do not face an additional 2.9% + $0.30 gateway charge." },
    { q: "How do chargebacks affect Instagram Shopping margins?", a: "Unlike independent Shopify stores where sellers fight chargebacks directly, Meta handles payment disputes, though excessive chargebacks can result in store suspension." }
  ],
  "youtube-shopping": [
    { q: "Does YouTube charge native affiliate fees for shopping features?", a: "YouTube itself generally does not charge direct transaction fees for native integrations (like Shopify). Fees are dictated by the underlying e-commerce gateway." },
    { q: "How is affiliate revenue tracked through YouTube Shopping?", a: "If utilizing YouTube's affiliate program, creators earn a variable commission rate set by the participating brands, deducted from the brand's margin, not the creator's." },
    { q: "What is the primary overhead for YouTube Shopping sellers?", a: "The dominant margin constraints are the underlying Shopify/BigCommerce plan fees and standard payment gateway processing clips, rather than native YouTube platform fees." }
  ],
  "pinterest-buyable-pins": [
    { q: "Are there platform fees for selling via Pinterest Buyable Pins?", a: "No, Pinterest does not charge a direct cut or selling fee. The transaction is processed by the merchant's underlying e-commerce platform (like Shopify or WooCommerce)." },
    { q: "How are payments routed for Buyable Pins?", a: "Payments are routed directly through your integrated gateway (e.g., Stripe, Shopify Payments), subjecting the transaction to the standard 2.9% + $0.30 gateway fees." },
    { q: "How does Pinterest monetize Buyable Pins?", a: "Pinterest monetizes primarily through Promoted Pins (PPC advertising). Merchants bid for ad placement, adding Customer Acquisition Cost (CAC) to their margin math." }
  ],
  "stripe-fee": [
    { q: "How does Stripe's flat $0.30 fee impact micro-transactions?", a: "For a $2.00 charge, the flat $0.30 fee consumes 15% of the transaction alone. Combined with the 2.9% variable fee, micro-transactions suffer massive margin compression." },
    { q: "Are Stripe fees refunded if a customer requests a refund?", a: "No. Stripe does not refund the 2.9% + $0.30 processing fees when you refund a customer, meaning sellers absorb a net loss on refunded orders." },
    { q: "What triggers Stripe's additional 1% cross-border fee?", a: "If the customer's credit card is issued outside of your local region, Stripe applies an additional 1% fee. Currency conversion triggers yet another 1% markup." }
  ],
  "paypal-merchant": [
    { q: "What is the standard PayPal checkout processing fee?", a: "For standard domestic checkout transactions, PayPal charges 3.49% plus a fixed fee of $0.49, making it significantly more expensive than standard Stripe infrastructure." },
    { q: "How does PayPal calculate its fee on international transactions?", a: "PayPal adds a 1.50% cross-border fee for international commercial transactions, pushing the variable rate near 5% before currency conversion spreads." },
    { q: "Are PayPal fixed fees constant across currencies?", a: "No, the fixed fee varies by received currency. For USD it is $0.49, but for EUR it might be €0.39, impacting exact cross-border margin math." }
  ],
  "shopify-payments": [
    { q: "How do Shopify Payments rates scale with subscription plans?", a: "As you upgrade from Basic to Advanced Shopify, the online credit card rate decreases (e.g., from 2.9% + 30¢ down to 2.4% + 30¢), improving scale margins." },
    { q: "Does Shopify charge transaction fees if using Shopify Payments?", a: "No. By utilizing Shopify Payments, merchants avoid Shopify's external gateway transaction fees (which range from 0.5% to 2.0% depending on the plan)." },
    { q: "How are chargeback fees handled on Shopify Payments?", a: "Shopify imposes a flat chargeback fee (typically $15 USD). If you win the chargeback dispute, this fee is refunded to your merchant account." }
  ],
  "square-pos-retail": [
    { q: "What is the standard Square POS fee for in-person hardware dips?", a: "For card-present transactions (dip, tap, or swipe), Square charges a standard 2.6% plus $0.10 per transaction." },
    { q: "Why are Square manual entry fees higher?", a: "Card-not-present (manual entry or virtual terminal) transactions carry higher fraud risk, so Square charges 3.5% plus $0.15 to offset potential chargebacks." },
    { q: "Does Square charge monthly fees for its basic POS software?", a: "No, the standard Square Point of Sale app is free. Merchants only pay the variable and fixed transaction fees upon successful sales." }
  ],
  "klarna-bnpl-impact": [
    { q: "How much more expensive is Klarna compared to Stripe?", a: "Klarna's merchant fees are significantly higher (typically 3.29% to 5.99% + a flat $0.30) because they absorb the credit risk and financing costs of Buy Now, Pay Later." },
    { q: "Do merchants receive payouts immediately with Klarna?", a: "Yes. Despite the customer paying in installments, Klarna settles the full transaction amount upfront with the merchant, minus the hefty BNPL processing fee." },
    { q: "How does Klarna justify high variable rates?", a: "Merchants accept the margin hit because BNPL options reliably increase Average Order Value (AOV) and checkout conversion rates, theoretically offsetting the fee." }
  ],
  "afterpay-merchant": [
    { q: "What is the baseline Afterpay merchant fee structure?", a: "Afterpay typically charges a 6% variable fee plus a flat $0.30 per transaction, making it one of the most expensive BNPL gateways on the market." },
    { q: "Who handles consumer chargebacks on Afterpay orders?", a: "Afterpay absorbs all consumer credit risk and fraud chargebacks. Once the merchant fulfills the order, Afterpay guarantees the payment settlement." },
    { q: "Does Afterpay integration improve Net Margin?", a: "Directly, it damages net margin due to the 6% clip. Strategically, it often boosts top-line revenue and conversion, resulting in higher gross absolute profit." }
  ],
  "amazon-fba-dimensional-weight": [
    { q: "What is the Amazon FBA dimensional weight divisor?", a: "Amazon calculates dimensional weight by multiplying volume (L x W x H in inches) and dividing by 139. If this exceeds actual weight, the dimensional weight is billed." },
    { q: "How does dimensional weight penalize 'air' shipping?", a: "Light, bulky products (like pillows or empty water bottles) command massive fulfillment fees because the 139 divisor forces billing based on warehouse space occupied, not scale weight." },
    { q: "What is the threshold for oversized FBA classifications?", a: "Once any dimension exceeds standard parameters (e.g., longest side > 18 inches), the item triggers oversized tiers, instantly ballooning both storage and fulfillment fees." }
  ],
  "amazon-aged-inventory-surcharge": [
    { q: "When does Amazon trigger the aged inventory surcharge?", a: "Inventory stored in fulfillment centers for more than 181 days begins incurring rolling aged inventory surcharges, which stack aggressively alongside standard monthly storage fees." },
    { q: "How are aged inventory fees calculated dimensionally?", a: "Surcharges are calculated per cubic foot. For items aged 271-365 days, fees can hit $1.50 per cubic foot, drastically eroding margins for slow-moving stock." },
    { q: "Does liquidating inventory avoid the surcharge?", a: "Creating removal or disposal orders halts the storage surcharges, but initiates a separate removal/disposal fee per unit based on weight and dimensions." }
  ],
  "stripe-cross-border-currency": [
    { q: "What triggers Stripe's currency conversion fee?", a: "If you charge a customer in a currency different from your payout bank account currency, Stripe applies a mandatory 1% conversion markup." },
    { q: "How does the cross-border fee stack with conversion?", a: "If a UK card purchases in USD from a US business, the merchant is hit with the 2.9% baseline + 1% international card fee + 1% conversion fee + $0.30." },
    { q: "Can Stripe's cross-border fees be avoided?", a: "Only by establishing localized corporate entities and native Stripe accounts in target demographics to process and payout in domestic currencies natively." }
  ],
  "paypal-micro-transactions": [
    { q: "What constitutes the PayPal Micropayments rate?", a: "Merchants can apply for the Micropayments rate, which alters the standard structure to a 5% variable fee plus a vastly reduced $0.05 flat fee." },
    { q: "At what Average Order Value (AOV) is the micropayment rate beneficial?", a: "The inflection point is roughly $12.00. For transactions below $12, the 5% + $0.05 structure yields higher net margin than the standard 3.49% + $0.49 structure." },
    { q: "Does the micropayment rate apply automatically?", a: "No. Merchants must explicitly apply for micropayment status with PayPal, and it applies globally to the account once activated." }
  ],
  "shopify-plan-breakeven": [
    { q: "What is the core metric for calculating a Shopify plan upgrade?", a: "The decision relies entirely on Monthly Gross Merchandise Volume (GMV). Upgrading lowers credit card rates (e.g., 2.9% to 2.6%), which eventually mathematically offsets the higher subscription cost." },
    { q: "At what GMV does upgrading to Shopify Advanced make sense?", a: "Depending on exact AOV, the breakeven point usually occurs between $10,000 and $15,000 in monthly GMV, where the savings on the 0.3% CC rate delta exceeds the $260 plan difference." },
    { q: "Do third-party app costs factor into the breakeven point?", a: "Advanced plans include features like advanced reporting and calculated shipping rates natively, which can allow merchants to uninstall expensive third-party apps, lowering the true breakeven threshold." }
  ],
  "aliexpress-dropshipping": [
    { q: "How does landed cost affect AliExpress dropshipping margins?", a: "Landed cost includes the raw product cost plus ePacket/Aliexpress Standard Shipping. Because shipping times are long, merchants must price at a 3x-4x markup to absorb high Customer Acquisition Costs (CAC)." },
    { q: "Do dropshippers pay import duties on single AliExpress parcels?", a: "Typically, individual low-value dropshipped parcels fall below the de minimis tax threshold of the destination country (e.g., $800 in the USA), avoiding customs duties." },
    { q: "What is the hidden margin killer in AliExpress dropshipping?", a: "High refund and chargeback rates due to 20+ day shipping times. A 5% chargeback rate completely destroys the net operating margin of a standard dropshipping model." }
  ],
  "cjdropshipping-landed-cost": [
    { q: "How does CJ Dropshipping calculate its product processing fee?", a: "Unlike AliExpress, CJ Dropshipping bundles sourcing, warehousing, and quality control into the raw product cost, meaning there are no hidden subscription fees for basic sourcing." },
    { q: "What determines the CJ Packet shipping rate?", a: "CJ shipping rates are hyper-sensitive to volumetric weight. A lightweight but bulky product will incur massive shipping costs, destroying the target 30% net margin." },
    { q: "Does CJ Dropshipping charge a separate fulfillment fee?", a: "No, fulfillment labor is baked into the product cost. However, if you use CJ purely as a 3PL for custom inventory, processing fees per parcel are applied." }
  ],
  "printful-pod": [
    { q: "How does Printful's base garment cost compress retail margins?", a: "Printful charges a premium base cost (e.g., $13 for a blank tee) because it includes on-demand DTG printing labor. Merchants must sell at $25+ to maintain a healthy 40% gross margin." },
    { q: "Are shipping costs flat-rate for Printful POD?", a: "Printful utilizes flat-rate shipping algorithms based on product categories (e.g., $3.99 for a t-shirt, $1.50 for each additional tee), requiring careful shipping fee architecture on Shopify." },
    { q: "Does Printful charge digitizing fees for embroidery?", a: "Yes. While standard DTG printing has no setup cost, embroidery requires a one-time flat fee to digitize the specific design file into machine paths." }
  ],
  "printify-variant": [
    { q: "How does Printify Premium affect base product costs?", a: "Subscribing to Printify Premium ($29/month) grants a ~20% discount on all base catalog prices. The breakeven point is roughly $150 in monthly base product volume." },
    { q: "Why do shipping costs vary wildly on Printify?", a: "Unlike Printful, Printify routes orders to distinct independent print providers globally. Mixing providers in one order triggers multiple separate shipping charges, killing net margin." },
    { q: "Does Printify handle sales tax remittance automatically?", a: "If you sell on a marketplace like Etsy, the marketplace handles it. On Shopify, Printify charges the seller sales tax where they have nexus, forcing the seller to collect it properly." }
  ],
  "teespring-apparel": [
    { q: "How is a Teespring (Spring) creator royalty calculated?", a: "Teespring controls the retail price and subtracts a fixed base cost per product. The creator's payout (royalty) is strictly the difference between the retail price and the base cost." },
    { q: "Does Teespring charge payment processing fees?", a: "No. The fixed base cost covers manufacturing, fulfillment, customer service, and all payment gateway fees. The royalty calculation is entirely flat." },
    { q: "How do pricing tiers affect Teespring margins?", a: "As creators sell more volume in a month, Teespring lowers the base cost of garments (Pricing Discount Tiers), directly expanding the net margin per unit sold." }
  ],
  "international-hs-tariff": [
    { q: "How is the HS code tariff applied to landed cost?", a: "The Harmonized System (HS) code determines the specific percentage of import duty. This percentage is applied to the customs value of the goods (typically the commercial invoice value)." },
    { q: "Does the tariff percentage apply to the freight costs?", a: "This depends on the Incoterms and destination. In the US, duties are generally assessed on the FOB value (product only). In the EU/UK, duties are assessed on the CIF value (Cost, Insurance, and Freight)." },
    { q: "What is a Merchandise Processing Fee (MPF)?", a: "In addition to HS tariffs, US customs levies an MPF (0.3464%) on formal entries. While seemingly small, it adds critical friction to high-volume container math." }
  ],
  "ocean-container-freight-splitter": [
    { q: "How is freight cost allocated per unit in an FCL container?", a: "To determine true landed cost, the total container flat rate (e.g., $4,000 for a 40HQ) is divided by the total CBM (Cubic Meters) capacity, and then allocated to units based on their individual volumetric footprint." },
    { q: "What happens if a container cubes out before weighing out?", a: "Most consumer goods 'cube out' (fill the spatial volume) long before hitting the maximum weight limit. Freight splitting must therefore be calculated via CBM, not kilograms." },
    { q: "Are destination port fees included in the baseline freight split?", a: "No. Terminal Handling Charges (THC), chassis fees, and drayage to the 3PL must be aggregated into the total shipment cost before calculating the per-unit split." }
  ],
  "air-freight-volumetric": [
    { q: "What is the standard volumetric divisor for air freight?", a: "Airlines typically use a volumetric divisor of 6000 (for centimeters) or 166 (for inches). This converts spatial dimensions into a 'chargeable weight' metric." },
    { q: "How is Chargeable Weight determined?", a: "The carrier compares the actual dead weight of the carton to the calculated volumetric weight. The invoice is generated based on whichever value is strictly higher." },
    { q: "How does master carton optimization affect air margins?", a: "Shaving just 2 centimeters off a master carton's dimensions can drastically lower the volumetric weight, saving thousands of dollars in aggregate air freight costs." }
  ],
  "3pl-warehouse-fulfillment": [
    { q: "What are the core components of 3PL billing?", a: "3PLs bill across three distinct axes: Storage (per pallet/bin per month), Fulfillment (pick & pack fee per order), and Shipping (carrier postage costs)." },
    { q: "How are pick and pack fees calculated for multi-item orders?", a: "A standard 3PL charges a base fee for the first item (e.g., $2.50) and a smaller incremental fee for each additional pick (e.g., $0.50), incentivizing merchants to increase AOV." },
    { q: "Does pallet storage scale linearly?", a: "Pallet storage is a flat monthly fee, meaning the storage cost per unit scales inversely with inventory velocity. Slow-moving stock creates massive margin drag." }
  ],
  "e-commerce-returns-cost": [
    { q: "What constitutes the 'True Cost' of an e-commerce return?", a: "The true cost includes the reverse logistics postage, the initial unrecoverable outbound shipping, the 3PL restocking labor fee, and potential inventory depreciation or write-offs." },
    { q: "Are payment processing fees recovered during a return?", a: "No. Payment gateways like Stripe retain the initial 2.9% + $0.30 fee even when you process a full refund, resulting in an absolute capital loss on returned items." },
    { q: "How does a 10% return rate impact Net Margin?", a: "A 10% return rate doesn't just deduct 10% of revenue; the compounded reverse logistics costs can easily obliterate 30-40% of the aggregate net operating profit." }
  ],
  "supplier-bulk-moq": [
    { q: "How do MOQ step-downs affect Capital Expenditure (CapEx)?", a: "Scaling from a 500 MOQ to a 5,000 MOQ significantly lowers the unit cost, but radically increases CapEx and cash conversion cycles, locking capital in warehouse storage." },
    { q: "What is the optimal intersection of MOQ and landed cost?", a: "The optimal MOQ balances the manufacturer's unit discount against the storage fees and opportunity cost of capital. Buying a 2-year supply is mathematically flawed." },
    { q: "Do tooling fees amortize over the initial MOQ?", a: "Yes. One-time injection molding or setup fees (e.g., $2,000) heavily distort the unit cost of a small MOQ, demanding a larger bulk order to dilute the CapEx." }
  ],
  "target-breakeven-roas": [
    { q: "How is Break-even ROAS calculated mathematically?", a: "Break-even ROAS is calculated by dividing 1 by your Gross Profit Margin percentage. A 50% margin requires a 2.0x ROAS simply to break even on the media spend." },
    { q: "Does high COGS demand a higher Break-even ROAS?", a: "Absolutely. If COGS and fulfillment consume 75% of your revenue (25% margin), your Break-even ROAS skyrockets to 4.0x, requiring incredibly efficient ad performance." },
    { q: "How does shipping revenue affect ROAS targets?", a: "If you charge customers for shipping, that revenue must be modeled into the gross margin. Subsidized 'Free Shipping' directly compresses margin and elevates the ROAS requirement." }
  ],
  "maximum-allowed-cpa": [
    { q: "What defines Maximum Allowed CPA (Cost Per Acquisition)?", a: "Max CPA is strictly equal to your absolute Gross Profit per unit. If an item sells for $100 and COGS + Shipping is $40, you can spend up to $60 to acquire a customer and break even." },
    { q: "How does LTV optimization affect Max CPA?", a: "If a business models Customer Lifetime Value (LTV) effectively, they can intentionally operate at a loss on the first sale (CPA > Gross Profit) to capture backend recurring revenue." },
    { q: "Should Max CPA include fixed operational costs?", a: "For strict media buying unit economics, Max CPA only considers variable costs (COGS, fulfillment, gateway fees). Fixed overhead is calculated downstream." }
  ],
  "customer-lifetime-value": [
    { q: "What is the standard formula for calculating LTV?", a: "LTV is calculated by multiplying the Average Order Value (AOV) by the Average Purchase Frequency per year, multiplied by the average Customer Lifespan in years, factored against Gross Margin." },
    { q: "Why is calculating LTV on gross revenue dangerous?", a: "Modeling LTV purely on top-line revenue ignores COGS. True predictive LTV must be formulated on Gross Profit to accurately determine how much capital can be deployed for acquisition." },
    { q: "How does churn rate directly impact the LTV multiplier?", a: "Churn acts as the denominator in subscription metrics. A 5% monthly churn rate dictates an average customer lifespan of 20 months. Lowering churn exponentially scales LTV." }
  ],
  "average-order-value-threshold": [
    { q: "How does raising AOV impact fulfillment margins?", a: "Raising AOV through bundling spreads the fixed costs (pick & pack fees, base shipping rates, gateway flats) over a larger revenue base, drastically expanding net margin." },
    { q: "How should a Free Shipping threshold be modeled?", a: "The threshold should be set 15% to 20% higher than your current median AOV. This psychological friction forces customers to add highly profitable upsells to avoid the shipping fee." },
    { q: "Does discounting to increase AOV cannibalize profits?", a: "It can. Offering 'Buy 2 Get 20% Off' increases revenue, but if the 20% discount exceeds the fulfillment efficiency gains, absolute net profit will compress." }
  ],
  "customer-acquisition-cost-payback": [
    { q: "What is a CAC Payback Period?", a: "It is the exact number of months (or transactions) required for the gross profit generated by a customer to surpass the initial media cost used to acquire them." },
    { q: "Why is a 1-month CAC payback critical for bootstrapped SaaS?", a: "Bootstrapped companies lack venture capital to float negative cash flow. A sub-30 day payback period ensures rapid capital recycling to fund aggressive ad scaling." },
    { q: "How do SaaS gross margins influence payback speed?", a: "SaaS boasts 85%+ gross margins (mostly server costs). This allows for much higher upfront CAC compared to physical e-commerce, as nearly all recurring revenue flows to payback." }
  ],
  "ubereats-merchant": [
    { q: "What is the standard UberEats merchant commission rate?", a: "For delivery orders fulfilled by Uber couriers, the platform typically extracts a massive 30% commission on the gross order subtotal." },
    { q: "Does UberEats charge a fee for pickup orders?", a: "Yes, even if the customer picks up the food themselves, UberEats charges a 'Bring Your Own Courier' or pickup commission, typically around 15%." },
    { q: "Are merchant payouts calculated before or after taxes?", a: "UberEats calculates its 30% commission strictly on the pre-tax food subtotal. Sales tax is collected and remitted independently." }
  ],
  "doordash-storefront": [
    { q: "How do DoorDash merchant tiers affect visibility?", a: "DoorDash offers sliding commissions (e.g., 15%, 25%, 30%). Higher commission tiers grant the restaurant an expanded delivery radius and prioritized placement in the app algorithm." },
    { q: "What is the DashPass commission penalty?", a: "Orders placed by DashPass subscribers often carry a strict minimum commission floor, ensuring DoorDash maintains its margin despite offering free delivery to the user." },
    { q: "How does inflating menu prices offset the 30% cut?", a: "Many restaurants inflate their DoorDash menu prices by 20-30% over dine-in prices to artificially expand the gross margin to absorb the extreme delivery commissions." }
  ],
  "instacart-grocer": [
    { q: "How does Instacart monetize its grocer partners?", a: "Instacart charges grocers a percentage of the total basket size (often 10% to 15%) while simultaneously charging the consumer a service and delivery fee." },
    { q: "Do grocers absorb the cost of Instacart shopper replacements?", a: "If a shopper replaces an out-of-stock item with a cheaper alternative, the grocer's final gross revenue drops, dynamically lowering the absolute commission paid." },
    { q: "How do CPG brands factor into Instacart margins?", a: "CPG brands heavily subsidize the ecosystem by paying for 'Featured Product' ad placements, essentially turning Instacart into an ad network layered over grocery logistics." }
  ],
  "stripe-fee-us": [
    { q: "What is the baseline Stripe fee for domestic US cards?", a: "Stripe charges a fixed 2.9% plus a $0.30 flat fee for standard domestic credit card processing through its API." },
    { q: "Are ACH transfers cheaper than credit card processing?", a: "Yes, Stripe ACH Direct Debit transactions are capped at 0.8% with a maximum fee of $5.00, making them infinitely superior for high-ticket B2B invoices." },
    { q: "Does Stripe charge extra for American Express?", a: "Unlike legacy merchant acquirers that punish AMEX volume, Stripe's standard 2.9% rate is blended, meaning AMEX carries no additional surcharge." }
  ],
  "stripe-fee-uk": [
    { q: "What is the domestic Stripe fee for European/UK cards?", a: "For standard European economic area cards, Stripe UK charges a significantly lower 1.5% plus £0.20 per transaction, reflecting EU interchange caps." },
    { q: "How are non-European cards processed in the UK?", a: "If a UK merchant accepts a US credit card, the fee balloons to 2.5% + £0.20, plus an additional 2% if currency conversion is required." },
    { q: "How does VAT apply to Stripe processing fees?", a: "Stripe processing fees are considered B2B financial services. In the UK, merchants generally use the reverse charge mechanism, meaning VAT is not explicitly added to the Stripe invoice." }
  ],
  "stripe-fee-canada": [
    { q: "What is the standard Canadian Stripe processing rate?", a: "Stripe Canada charges 2.9% plus $0.30 CAD for domestic credit card processing." },
    { q: "Are Interac routing fees lower than credit cards?", a: "Yes, if routed natively, Canadian debit networks carry lower interchange costs, though standard Stripe checkout blends these into the flat rate." },
    { q: "Does Stripe charge cross-border fees for US customers?", a: "Yes. If a Canadian merchant charges a US customer in USD, Stripe applies the cross-border fee and currency conversion margins, eroding over 4% of the transaction." }
  ],
  "paypal-fee-india": [
    { q: "What is the core constraint of PayPal India for merchants?", a: "Due to RBI regulations, PayPal India cannot be used for domestic INR-to-INR transfers. It is strictly limited to cross-border export transactions." },
    { q: "What is the standard export fee for Indian merchants?", a: "PayPal charges Indian freelancers and merchants a massive 4.4% variable fee plus a fixed fee based on the received currency (e.g., $0.30 USD)." },
    { q: "How does currency conversion devastate Indian payouts?", a: "PayPal applies an aggressive retail exchange rate margin (often 3-4% below interbank rates), meaning the true cost of an export transaction frequently exceeds 8%." }
  ],
  "vat-margin-germany": [
    { q: "How is the 19% German VAT extracted from a gross retail price?", a: "VAT is not simply 19% of the final price. The math is: Gross Price / 1.19. The difference between the gross price and this quotient is the true VAT remitted to the Finanzamt." },
    { q: "Can B2B sellers deduct inbound VAT (Vorsteuer)?", a: "Yes. Registered German businesses can offset the VAT paid on COGS and advertising (Vorsteuer) against the VAT collected from consumers (Umsatzsteuer), paying only the delta." },
    { q: "How does the Reverse Charge mechanism affect cross-border EU B2B sales?", a: "If selling B2B across EU borders with a valid VAT ID, the invoice is issued at 0% VAT. The buyer handles the tax liability natively, instantly preserving 19% cash flow." }
  ]
};

const platformsList = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

let updatedCount = 0;
platformsList.forEach(tool => {
  if (platformFaqs[tool.slug]) {
    tool.faqs = platformFaqs[tool.slug];
    updatedCount++;
  } else {
    // Fallback if missing
    tool.faqs = [
      { q: `How are the specific fees calculated for ${tool.title}?`, a: `The calculations strictly follow the API configurations and parameter boundaries assigned to ${tool.title}. Adjust the inputs to see real-time net profit implications.` },
      { q: `What is the most effective way to optimize margins on ${tool.title}?`, a: `The primary lever for optimizing ${tool.title} is increasing Average Order Value (AOV) to dilute the impact of flat-rate transaction clips.` },
      { q: `Does this calculator support dynamic tax and duty inputs?`, a: `Yes, you can manually adjust the tax or variable percentage inputs to match localized jurisdiction parameters or specialized tier pricing.` }
    ];
  }
});

fs.writeFileSync(FILE_PATH, JSON.stringify(platformsList, null, 2));
console.log(`✅ Successfully injected 3 specific FAQs into ${updatedCount} platform objects.`);
