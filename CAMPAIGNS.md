# Seasonal Campaigns

## Winter 2025

**Activate:** `?campaign=winter-2025`

Shows winter automotive products on the homepage with animated snowfall effect:

- Premium Winter Tire Set - $699.99
- Heavy-Duty Tire Chains - $89.99
- Windshield Ice Scraper - $14.99

Categories: Winter Tires, Winter Accessories, Winter Fluids

**Visual Effect**: Animated snowfall overlay (150 snowflakes)

---

## Summer 2025

**Activate:** `?campaign=summer-2025`

Shows summer road trip products on the homepage:

- Roof Cargo Box - $349.99
- Portable Power Station - $299.99
- Premium Car Detailing Kit - $59.99

Categories: Road Trip Essentials, Emergency Equipment, Car Detailing

---

## Testing

```bash
# Default homepage
http://localhost:3000/

# Winter campaign
http://localhost:3000/?campaign=winter-2025

# Summer campaign
http://localhost:3000/?campaign=summer-2025
```

## Implementation

Both campaigns follow the same pattern in:

- `apps/bff/src/adapters/mock/mock-data.ts` - Product definitions
- `apps/bff/src/adapters/mock/mock-marketing-directives.ts` - Campaign directives
- `apps/bff/src/adapters/mock/mock-commerce-localization.ts` - Translations (ES, NL, FR)
