# Cart & Checkout

## Cart

### Architecture

Cart state lives in the BFF (in-memory `MockCartStore` for development). The storefront stores only the `cartId` in a cookie. All mutations go through the BFF.

```
Storefront (cookie: cartId)
     │
     │ Server Action (addItem / removeItem / updateItemQuantity)
     │
     ▼
BFF CartController
     │
     │ Validates purchasability (for adds)
     │ Resolves merchandiseIds to lineIds (for removes)
     │
     ▼
CartPort adapter (MockCartAdapter)
     │
     ▼
MockCartStore (in-memory Map)
```

### Purchasability Validation

Before adding items to the cart, `CartController.addToCart()` calls `ProductDomainService.getUnpurchasableVariantIds()` which checks:

1. Does the variant's product have pricing data?
2. Does the variant's product have availability data?
3. Is the specific variant marked `purchasable` in availability?
4. Does the specific variant have a price?

If any variant fails these checks, the request is rejected with a 400 `ITEMS_NOT_PURCHASABLE` error listing the failing merchandise IDs.

**Design decision:** This validation lives in the BFF, not the frontend, because the frontend could have stale data. The BFF checks against the current state of pricing and availability ports.

### Cart Mutations

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `GET /cart/:id` | Read | Fetch cart by ID |
| `POST /cart/lines` | Add | Add lines. Creates cart if `cartId` is omitted. |
| `POST /cart/remove` | Remove | Remove by merchandise IDs (BFF resolves to line IDs internally) |
| `PATCH /cart/lines` | Update | Update quantities. Handles add/update/remove in a single call. |
| `POST /cart/:id/checkout-redirect` | Redirect | Returns the checkout URL |

**Design decision:** The remove endpoint accepts `merchandiseIds` (variant IDs), not internal `lineIds`. The BFF maps merchandise IDs to line IDs by looking up the cart. This means the frontend never needs to track line IDs — it only knows about variant IDs.

**Design decision:** The update endpoint handles three cases in one call: quantity=0 removes the line, existing item with quantity>0 updates it, new item with quantity>0 adds it.

### Optimistic Updates (Storefront)

The `CartProvider` uses React 19's `useOptimistic()` hook:

1. User clicks "Add to Cart".
2. `addCartItem()` immediately updates the optimistic cart state (local calculation).
3. The server action fires `addToCart()` → BFF → response.
4. On next render, the real cart from the server replaces the optimistic state.

This gives instant UI feedback while the network request is in flight.

### Cart Cookie

When `addToCart()` creates a new cart (no existing `cartId` cookie), the storefront sets the `cartId` cookie from the response. Subsequent requests include this cookie.

## Checkout

### Server-Driven Forms

The checkout form is entirely server-driven. The BFF returns a `CheckoutConfig` containing:

```typescript
type CheckoutConfig = {
  addressSchema: AddressFormSchema;        // Shipping address fields
  billingAddressSchema: AddressFormSchema;  // Billing address fields
  deliveryOptions: DeliveryOption[];        // Shipping methods with prices
  paymentOptions: PaymentOption[];          // Payment methods
  savedAddresses: SavedAddress[];           // Customer's saved addresses
};
```

### Address Schema

`AddressFormSchema` defines rows of fields. Each field specifies:

- `name`, `label`, `type` (`text` | `email` | `tel` | `select`)
- `autoComplete` — HTML autocomplete attribute
- `required`, `colSpan` (1 or 2 for layout)
- `options` (for select fields)
- `validation` (`pattern`, `minLength`, `maxLength`)

**Why server-driven?** Address formats differ by country. France has a 5-digit postal code with a regex pattern. Ireland has Eircode (alphanumeric) and a county field instead of postal code. The BFF returns the correct schema per store — the frontend just renders it.

### Billing Address

By default, billing = shipping. A checkbox enables "Use different billing address" which shows a second form using `billingAddressSchema` (which omits email/phone since those are captured in shipping).

### Saved Addresses

If the customer is authenticated (`x-customer-id` header), `CheckoutConfig` includes their saved addresses. The `AddressPicker` component renders them as scrollable cards. Selecting one pre-fills the form fields.

### Address Book API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /customers/me/addresses` | Read | List saved addresses |
| `POST /customers/me/addresses` | Create | Add new address |
| `PATCH /customers/me/addresses/:id` | Update | Update address fields |
| `DELETE /customers/me/addresses/:id` | Delete | Remove address |
| `POST /customers/me/addresses/:id/default` | Set default | Set as default shipping or billing |

All require authentication (`x-customer-id` header). The `MockAddressStore` is a singleton that persists across requests (unlike the request-scoped adapter).

**Design decisions:**
- Max 10 addresses per customer.
- First address is auto-set as default for both shipping and billing.
- Deleting a default address auto-assigns the first remaining address as default.
- Setting a new default clears the flag on all other addresses.
