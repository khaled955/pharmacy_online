import type { OrderEmailPayload } from "@/lib/types/email";

export function adminOrderTemplate(payload: OrderEmailPayload): string {
  const {
    orderNumber,
    customerName,
    customerPhone,
    address,
    items,
    subtotal,
    shippingFee,
    totalAmount,
    paymentMethod,
    notes,
    createdAt,
  } = payload;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 16px;color:#1e293b;font-size:14px;border-top:1px solid #e2e8f0;">
            ${item.name}
          </td>
          <td style="padding:12px 16px;text-align:center;color:#64748b;font-size:14px;border-top:1px solid #e2e8f0;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px;text-align:right;color:#64748b;font-size:14px;border-top:1px solid #e2e8f0;">
            $${item.unitPrice.toFixed(2)}
          </td>
          <td style="padding:12px 16px;text-align:right;color:#0d9488;font-size:14px;font-weight:600;border-top:1px solid #e2e8f0;">
            $${item.lineTotal.toFixed(2)}
          </td>
        </tr>`,
    )
    .join("");

  const notesRow = notes
    ? `<tr>
        <td style="padding:6px 0;color:#64748b;font-size:14px;">📝 Notes</td>
        <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:600;">${notes}</td>
      </tr>`
    : "";

  const shippingLabel =
    shippingFee === 0
      ? '<span style="color:#10b981;font-weight:600;">Free</span>'
      : `$${shippingFee.toFixed(2)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Order — MedBox</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- ── Header ──────────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#0891b2 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 22px;margin-bottom:20px;">
                <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">💊 MedBox</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;line-height:1.2;">
                🆕 New Order Received
              </h1>
              <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:15px;">
                Order <strong style="color:#ffffff;">#${orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- ── Body ───────────────────────────────────── -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

              <!-- Action Banner -->
              <div style="background:#f0fdfa;border:1.5px solid #99f6e4;border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
                <p style="margin:0;color:#0d9488;font-size:16px;font-weight:700;">
                  ⚡ Please prepare this order as soon as possible
                </p>
              </div>

              <!-- Customer Info -->
              <h2 style="color:#0f172a;font-size:15px;font-weight:700;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;text-transform:uppercase;letter-spacing:0.04em;">
                👤 Customer Information
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:7px 0;color:#64748b;font-size:14px;width:38%;">Name</td>
                  <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;">${customerName ?? "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#64748b;font-size:14px;">Phone</td>
                  <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;">${customerPhone ?? "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#64748b;font-size:14px;">Address</td>
                  <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;">${address || "N/A"}</td>
                </tr>
              </table>

              <!-- Items Table -->
              <h2 style="color:#0f172a;font-size:15px;font-weight:700;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;text-transform:uppercase;letter-spacing:0.04em;">
                🛒 Order Items
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:28px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:12px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Product</th>
                    <th style="padding:12px 16px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Qty</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Unit</th>
                    <th style="padding:12px 16px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Totals -->
              <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:5px 0;color:#64748b;font-size:14px;">Subtotal</td>
                    <td style="padding:5px 0;color:#0f172a;font-size:14px;text-align:right;">$${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;color:#64748b;font-size:14px;">Shipping</td>
                    <td style="padding:5px 0;font-size:14px;text-align:right;">${shippingLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0 0;color:#0f172a;font-size:17px;font-weight:800;border-top:2px solid #e2e8f0;">
                      Total Amount
                    </td>
                    <td style="padding:14px 0 0;color:#0d9488;font-size:20px;font-weight:800;text-align:right;border-top:2px solid #e2e8f0;">
                      $${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Meta -->
              <h2 style="color:#0f172a;font-size:15px;font-weight:700;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;text-transform:uppercase;letter-spacing:0.04em;">
                📋 Order Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:7px 0;color:#64748b;font-size:14px;width:38%;">💳 Payment</td>
                  <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;">${paymentMethod ?? "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:7px 0;color:#64748b;font-size:14px;">📅 Date</td>
                  <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;">${formattedDate}</td>
                </tr>
                ${notesRow}
              </table>

            </td>
          </tr>

          <!-- ── Footer ──────────────────────────────────── -->
          <tr>
            <td style="text-align:center;padding:28px 16px 8px;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                <strong style="color:#64748b;">MedBox Pharmacy</strong> — Admin Notification
              </p>
              <p style="margin:6px 0 0;color:#cbd5e1;font-size:11px;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
