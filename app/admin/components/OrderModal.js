// // components/OrderModal.js → FINAL WITH PRINT RECEIPT (3-INCH WIDTH)

// "use client";

// import { useState } from 'react';
// import { X, Phone, MapPin, Clock, Package, ChevronDown, Printer } from 'lucide-react';
// import toast from 'react-hot-toast';

// const statusOptions = [
//   { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
//   { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
//   { value: "preparing", label: "Preparing", color: "bg-indigo-100 text-indigo-800" },
//   { value: "on-the-way", label: "On The Way", color: "bg-purple-100 text-purple-800" },
//   { value: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
//   { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
// ];

// export default function OrderModal({ order, onClose, onUpdate }) {
//   const [status, setStatus] = useState(order.status);
//   const [saving, setSaving] = useState(false);

//   const updateStatus = async () => {
//     if (status === order.status) return;

//     setSaving(true);
//     try {
//       const res = await fetch(`/api/admin/orders/${order._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });

//       if (!res.ok) throw new Error();
//       toast.success("Status updated!");
//       onUpdate?.();
//     } catch {
//       toast.error("Failed to update");
//       setStatus(order.status);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // PRINT RECEIPT FUNCTION (3-inch width optimized)
//   const printReceipt = () => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) {
//       toast.error("Please allow popups for printing");
//       return;
//     }

//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Order Receipt #${order.orderId || order._id}</title>
//         <style>
//           @page {
//             size: 80mm auto;          /* Width fixed, height auto = fits content */
//             margin: 4mm;            /* Only side margins, no top/bottom waste */
//           }
//           body {
//             font-family: 'Courier New', Courier, monospace;
//             width: 72mm;              /* Safe printable content width (~3 inch) */
//             margin: 4mm auto;           /* Center horizontally */
//             padding: 4mm 0 8mm 0;     /* Small top + extra bottom for tear-off */
//             font-size: 12px;
//             line-height: 1.3;
//             color: #000;
//             height: auto;             /* Crucial: height follows content */
//             box-sizing: border-box;
//           }
//           .container {
//             padding-bottom: 8mm;      /* Extra space at bottom for clean cut */
//           }
//           h1, h2 {
//             text-align: center;
//             margin: 4px 0 6px;
//             font-weight: bold;
//           }
//           .divider {
//             border-top: 1px dashed #000;
//             margin: 6px 0;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 6px 0;
//           }
//           td {
//             padding: 2px 0;
//             vertical-align: top;
//           }
//           .right { text-align: right; }
//           .center { text-align: center; }
//           .bold { font-weight: bold; }
//           .total {
//             font-size: 14px;
//             font-weight: bold;
//             border-top: 2px solid #000;
//             padding-top: 6px;
//             margin-top: 8px;
//           }
//           .footer {
//             margin-top: 12px;
//             text-align: center;
//             font-size: 10px;
//           }
//           @media print {
//             body { margin: 0; padding: 0; }
//             .container { page-break-after: avoid; }
//           }
//         </style>
//       </head>
//       <body onload="window.print();setTimeout(() => window.close(), 800);">
//         <div class="container">
//           <div class="center">
//             <h1>ORDER RECEIPT</h1>
//             <p>Order ID: ${order.orderId || order._id}</p>
//             <p>${new Date(order.createdAt).toLocaleString()}</p>
//           </div>

//           <div class="divider"></div>

//           <div>
//             <strong>Customer:</strong> ${order.customerName}<br>
//             <strong>Contact:</strong> ${order.phone || order.whatsapp || 'N/A'}<br>
//             <strong>Address:</strong> ${order.deliveryAddress}
//           </div>

//           <div class="divider"></div>

//           <table>
//             <tbody>
//               ${order.items.map(item => `
//                 <tr>
//                   <td>${item.quantity} × ${item.name}</td>
//                   <td class="right">${(item.price * item.quantity).toFixed(2)} SAR</td>
//                 </tr>
//                 ${item.addons?.length > 0 ? `
//                   <tr>
//                     <td colspan="2" style="padding-left: 12px;">
//                       Add-ons:<br>
//                       ${item.addons.map(a => `• ${a.name} (+${a.price} SAR)`).join('<br>')}
//                     </td>
//                   </tr>
//                 ` : ''}
//               `).join('')}
//             </tbody>
//           </table>

//           <div class="divider"></div>

//           <div class="total">
//             <div class="flex justify-between">
//               <span>GRAND TOTAL</span>
//               <span>${order.total.toFixed(2)} SAR</span>
//             </div>
//           </div>

//           ${order.notes ? `
//             <div class="divider"></div>
//             <strong>Notes:</strong><br>${order.notes}
//           ` : ''}

//           <div class="divider" style="margin-top: 16px;"></div>

//           <div class="footer">
//             Thank you for your order!<br>
//             Please come again ♥
//           </div>
//         </div>
//       </body>
//     </html>
//   `);

//     printWindow.document.close();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
//           <h2 className="text-2xl font-bold">Order Details</h2>
//           <div className="flex gap-3">
//             <button
//               onClick={printReceipt}
//               className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
//               title="Print Receipt"
//             >
//               <Printer size={24} />
//             </button>
//             <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full">
//               <X size={28} />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Header */}
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm text-gray-500">Order ID</p>
//               <p className="text-2xl font-bold">{order.orderId || order._id}</p>
//             </div>

//             {/* STATUS SELECTOR */}
//             <div className="relative">
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 disabled={saving}
//                 className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
//               >
//                 {statusOptions.map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />

//               {status !== order.status && (
//                 <button
//                   onClick={updateStatus}
//                   disabled={saving}
//                   className="mt-3 w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
//                 >
//                   {saving ? "Saving..." : "Update Status"}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Customer Info */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <p className="text-sm text-gray-500 flex items-center gap-2"><Phone size={16} /> Customer</p>
//               <p className="font-bold text-lg">{order.customerName}</p>
//               <p className="text-gray-600">{order.phone || order.whatsapp || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 flex items-center gap-2"><Clock size={16} /> Time</p>
//               <p className="font-medium">
//                 {new Date(order.createdAt).toLocaleString()}
//               </p>
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <p className="text-sm text-gray-500 flex items-center gap-2 mb-2"><MapPin size={16} /> Delivery</p>
//             <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
//             {order.notes && <p className="text-sm text-gray-600 mt-2 italic">"{order.notes}"</p>}
//           </div>

//           {/* Items */}
//           <div>
//             <p className="font-bold text-lg mb-3 flex items-center gap-2"><Package size={20} /> Items ({order.items.length})</p>
//             <div className="space-y-4">
//               {order.items.map((item, i) => (
//                 <div key={i} className="bg-gray-50 p-4 rounded-xl">
//                   <div className="flex justify-between mb-2">
//                     <p className="font-medium">{item.quantity} × {item.name}</p>
//                     <p className="font-bold">{(item.price * item.quantity).toFixed(2)} SAR</p>
//                   </div>

//                   {item.addons?.length > 0 && (
//                     <div className="ml-4 mt-2">
//                       <p className="text-sm font-medium text-gray-700">Addons:</p>
//                       {item.addons.map((a, idx) => (
//                         <p key={idx} className="text-sm">• {a.name} (+{a.price} SAR)</p>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Total */}
//           <div className="border-t pt-6">
//             <div className="flex justify-between text-2xl font-bold">
//               <span>Total</span>
//               <span>{order.total.toFixed(2)} SAR</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import {
  X,
  Phone,
  MapPin,
  Clock,
  Package,
  ChevronDown,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "on-the-way", label: "On The Way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    if (status === order.status) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();
      toast.success("Status updated");
      onUpdate?.();
    } catch {
      toast.error("Update failed");
      setStatus(order.status);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     SAFE THERMAL PRINT METHOD
     ========================= */
  const printReceipt = () => {
    const win = window.open("", "_blank");
    if (!win) {
      toast.error("Allow popups to print");
      return;
    }

    win.document.open();
    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Receipt ${order.orderId || order._id}</title>

<style>
@page {
  size: 80mm auto;
  margin: 0;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Courier, monospace;
  width: 72mm;
  margin: 0 auto;
  padding: 4mm 0 8mm 0;
  font-size: 12px;
  line-height: 1.3;
  color: #000;
  box-sizing: border-box;
}

* {
  page-break-inside: avoid;
  break-inside: avoid;
}

.center { text-align: center; }
.right { text-align: right; }
.bold { font-weight: bold; }

.divider {
  border-top: 1px dashed #000;
  margin: 6px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 2px 0;
  vertical-align: top;
}

.total {
  font-size: 14px;
  font-weight: bold;
  border-top: 2px solid #000;
  padding-top: 6px;
  margin-top: 8px;
}

.footer {
  margin-top: 12px;
  text-align: center;
  font-size: 10px;
}
</style>
</head>

<body onload="window.print(); setTimeout(() => window.close(), 600)">
  <div class="center">
    <div class="bold">ORDER RECEIPT</div>
    <div>Order ID: ${order.orderId || order._id}</div>
    <div>${new Date(order.createdAt).toLocaleString()}</div>
  </div>

  <div class="divider"></div>

  <div>
    <div><b>Customer:</b> ${order.customerName}</div>
    <div><b>Contact:</b> ${order.phone || order.whatsapp || "N/A"}</div>
    <div><b>Address:</b> ${order.deliveryAddress}</div>
  </div>

  <div class="divider"></div>

  <table>
    <tbody>
      ${order.items
        .map(
          (item) => `
        <tr>
          <td>${item.quantity} × ${item.name}</td>
          <td class="right">${(
              item.price * item.quantity
            ).toFixed(2)} SAR</td>
        </tr>
        ${item.addons?.length
              ? `
        <tr>
          <td colspan="2" style="padding-left:10px">
            Add-ons:<br>
            ${item.addons
                .map((a) => `• ${a.name} (+${a.price} SAR)`)
                .join("<br>")}
          </td>
        </tr>`
              : ""
            }
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="divider"></div>

  <div class="total">
    <span>GRAND TOTAL</span>
    <span style="float:right">${order.total.toFixed(2)} SAR</span>
  </div>

  ${order.notes
        ? `
    <div class="divider"></div>
    <div><b>Notes:</b><br>${order.notes}</div>
  `
        : ""
      }

  <div class="divider" style="margin-top:16px"></div>

  <div class="footer">
    Thank you for your order<br>
    Please come again
  </div>
</body>
</html>
`);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <div className="flex gap-3">
            <button
              onClick={printReceipt}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              title="Print Receipt"
            >
              <Printer size={24} />
            </button>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-2xl font-bold">{order.orderId || order._id}</p>
            </div>

            {/* STATUS SELECTOR */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />

              {status !== order.status && (
                <button
                  onClick={updateStatus}
                  disabled={saving}
                  className="mt-3 w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  {saving ? "Saving..." : "Update Status"}
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2"><Phone size={16} /> Customer</p>
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-gray-600">{order.phone || order.whatsapp || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2"><Clock size={16} /> Time</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-2"><MapPin size={16} /> Delivery</p>
            <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
            {order.notes && <p className="text-sm text-gray-600 mt-2 italic">"{order.notes}"</p>}
          </div>

          {/* Items */}
          <div>
            <p className="font-bold text-lg mb-3 flex items-center gap-2"><Package size={20} /> Items ({order.items.length})</p>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">{item.quantity} × {item.name}</p>
                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} SAR</p>
                  </div>

                  {item.addons?.length > 0 && (
                    <div className="ml-4 mt-2">
                      <p className="text-sm font-medium text-gray-700">Addons:</p>
                      {item.addons.map((a, idx) => (
                        <p key={idx} className="text-sm">• {a.name} (+{a.price} SAR)</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-6">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>{order.total.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
