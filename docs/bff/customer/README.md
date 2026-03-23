# BFF Customer Domain

## Purpose

Currently focused on address book management. It provides customer-owned data needed by checkout and future personalization layers.

## Key Files

- `apps/bff/src/modules/customer/address-book.controller.ts`

## Inputs And Outputs

- Inputs: customer address requests
- Outputs: saved address payloads used by checkout flows

## Notes

- Checkout uses saved addresses for express and returning-user experiences.
