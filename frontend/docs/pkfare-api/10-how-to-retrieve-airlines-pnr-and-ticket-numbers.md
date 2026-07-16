# How to retrieve airlines'PNR and ticket numbers

# 🎫 Ticket Number and PNR Mapping – Interface Parameter Explanation

This document describes how to parse and prioritize the ticketing and PNR data in the PKFARE-issued ticket push interface. It aims to help integrators accurately extract and associate ticket numbers with passengers and flight segments.

---

## ✈️ Data Source Prioritization

### ✅ Primary Source: `pnrList`

Always prioritize the `pnrList` structure when it is available. It provides the most **granular mapping** between:

* Passengers (via `passengerIndex`)
* Segments
* Ticket numbers (`ticketNums`)
* Airline PNRs (`airPnr`)

This ensures that each passenger and segment can be precisely linked with the correct ticket number and airline PNR.

### ❌ Ignore: `data.pnr`

The `data.pnr` field is an **order-level general PNR** and should be ignored during downstream processing, as it holds **no segment-level or passenger-level value**.

---

## 💡 Best Practices

### ✅ Always use `pnrList` when available:

* It's the most **granular source** of ticket-to-passenger-to-segment mapping.
* Includes both `ticketNums` and `airPnr` per segment.

### ❌ Ignore `data.pnr`:

* It's a **general order-level placeholder**.
* Holds **no value** for passengers or segment-level processing.

### 🛠 Fallback when `pnrList` is missing:

* Use `data.airPnr` as the **airline PNR**.
* Use `data.passengers[].ticketNum`, and **split on `/`** if multiple tickets exist.
* Ensure fallback mapping aligns with the **segment count or journey order**.

### 🔍 Data validation tips:

* Confirm **ticket number format** is **13-digit**.
* Ensure **ticket count matches journey segment count** (when using fallback).
* Make sure each `ticketNum` is **properly associated** with the correct passenger and flight segment.

---

Modified at 2 months ago

PreviousPKFARE Operation Notice 