import type {
  AddressFormSchema,
  DeliveryOption,
  PaymentOption,
} from "@commerce/shared-types";

// -- Shipping address schemas ------------------------------------------------

const frAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        labelKey: "firstName",
        type: "text",
        autoComplete: "given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        labelKey: "lastName",
        type: "text",
        autoComplete: "family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "email",
        labelKey: "email",
        type: "email",
        autoComplete: "email",
        required: true,
        colSpan: 1,
      },
      {
        name: "phone",
        labelKey: "phone",
        type: "tel",
        autoComplete: "tel",
        required: false,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        labelKey: "address",
        type: "text",
        autoComplete: "street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "postalCode",
        labelKey: "postalCode",
        type: "text",
        autoComplete: "postal-code",
        required: true,
        colSpan: 1,
        validation: {
          pattern: "^\\d{5}$",
          minLength: 5,
          maxLength: 5,
        },
      },
      {
        name: "city",
        labelKey: "city",
        type: "text",
        autoComplete: "address-level2",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "country",
        labelKey: "country",
        type: "select",
        autoComplete: "country-name",
        required: true,
        colSpan: 2,
        options: [
          { value: "FR", labelKey: "countries.france" },
          { value: "BE", labelKey: "countries.belgium" },
          { value: "LU", labelKey: "countries.luxembourg" },
        ],
      },
    ],
  ],
};

const ieAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        labelKey: "firstName",
        type: "text",
        autoComplete: "given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        labelKey: "lastName",
        type: "text",
        autoComplete: "family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "email",
        labelKey: "email",
        type: "email",
        autoComplete: "email",
        required: true,
        colSpan: 1,
      },
      {
        name: "phone",
        labelKey: "phone",
        type: "tel",
        autoComplete: "tel",
        required: false,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        labelKey: "address",
        type: "text",
        autoComplete: "street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        labelKey: "city",
        type: "text",
        autoComplete: "address-level2",
        required: true,
        colSpan: 1,
      },
      {
        name: "county",
        labelKey: "county",
        type: "text",
        autoComplete: "address-level1",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "eircode",
        labelKey: "eircode",
        type: "text",
        autoComplete: "postal-code",
        required: false,
        colSpan: 1,
        validation: {
          pattern: "^[A-Z0-9]{3}\\s?[A-Z0-9]{4}$",
          maxLength: 8,
        },
      },
      {
        name: "country",
        labelKey: "country",
        type: "select",
        autoComplete: "country-name",
        required: true,
        colSpan: 1,
        options: [
          { value: "IE", labelKey: "countries.ireland" },
          { value: "GB", labelKey: "countries.unitedKingdom" },
        ],
      },
    ],
  ],
};

export const addressSchemas: Record<string, AddressFormSchema> = {
  fr: frAddressSchema,
  ie: ieAddressSchema,
};

// -- Billing address schemas -------------------------------------------------
// Omit contact fields (email, phone) since those are already captured
// in the shipping address.

const frBillingAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        labelKey: "firstName",
        type: "text",
        autoComplete: "billing given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        labelKey: "lastName",
        type: "text",
        autoComplete: "billing family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        labelKey: "address",
        type: "text",
        autoComplete: "billing street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "postalCode",
        labelKey: "postalCode",
        type: "text",
        autoComplete: "billing postal-code",
        required: true,
        colSpan: 1,
        validation: {
          pattern: "^\\d{5}$",
          minLength: 5,
          maxLength: 5,
        },
      },
      {
        name: "city",
        labelKey: "city",
        type: "text",
        autoComplete: "billing address-level2",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "country",
        labelKey: "country",
        type: "select",
        autoComplete: "billing country-name",
        required: true,
        colSpan: 2,
        options: [
          { value: "FR", labelKey: "countries.france" },
          { value: "BE", labelKey: "countries.belgium" },
          { value: "LU", labelKey: "countries.luxembourg" },
        ],
      },
    ],
  ],
};

const ieBillingAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        labelKey: "firstName",
        type: "text",
        autoComplete: "billing given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        labelKey: "lastName",
        type: "text",
        autoComplete: "billing family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        labelKey: "address",
        type: "text",
        autoComplete: "billing street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        labelKey: "city",
        type: "text",
        autoComplete: "billing address-level2",
        required: true,
        colSpan: 1,
      },
      {
        name: "county",
        labelKey: "county",
        type: "text",
        autoComplete: "billing address-level1",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "eircode",
        labelKey: "eircode",
        type: "text",
        autoComplete: "billing postal-code",
        required: false,
        colSpan: 1,
        validation: {
          pattern: "^[A-Z0-9]{3}\\s?[A-Z0-9]{4}$",
          maxLength: 8,
        },
      },
      {
        name: "country",
        labelKey: "country",
        type: "select",
        autoComplete: "billing country-name",
        required: true,
        colSpan: 1,
        options: [
          { value: "IE", labelKey: "countries.ireland" },
          { value: "GB", labelKey: "countries.unitedKingdom" },
        ],
      },
    ],
  ],
};

export const billingAddressSchemas: Record<string, AddressFormSchema> = {
  fr: frBillingAddressSchema,
  ie: ieBillingAddressSchema,
};

// -- Delivery options --------------------------------------------------------

export const deliveryOptionsByStore: Record<string, DeliveryOption[]> = {
  fr: [
    {
      id: "colissimo",
      labelKey: "delivery.colissimo",
      descriptionKey: "delivery.colissimoDescription",
      price: { amount: "4.99", currencyCode: "EUR" },
    },
    {
      id: "chronopost",
      labelKey: "delivery.chronopost",
      descriptionKey: "delivery.chronopostDescription",
      price: { amount: "9.99", currencyCode: "EUR" },
    },
    {
      id: "chronopost-express",
      labelKey: "delivery.chronopostExpress",
      descriptionKey: "delivery.chronopostExpressDescription",
      price: { amount: "19.99", currencyCode: "EUR" },
    },
  ],
  ie: [
    {
      id: "standard",
      labelKey: "delivery.standard",
      descriptionKey: "delivery.standardDescription",
      price: { amount: "4.99", currencyCode: "EUR" },
    },
    {
      id: "express",
      labelKey: "delivery.express",
      descriptionKey: "delivery.expressDescription",
      price: { amount: "9.99", currencyCode: "EUR" },
    },
    {
      id: "nextDay",
      labelKey: "delivery.nextDay",
      descriptionKey: "delivery.nextDayDescription",
      price: { amount: "14.99", currencyCode: "EUR" },
    },
  ],
};

// -- Payment options ---------------------------------------------------------

export const paymentOptionsByStore: Record<string, PaymentOption[]> = {
  fr: [
    {
      id: "card",
      labelKey: "payment.creditCard",
      descriptionKey: "payment.creditCardDescription",
    },
    {
      id: "paypal",
      labelKey: "payment.paypal",
      descriptionKey: "payment.paypalDescription",
    },
  ],
  ie: [
    {
      id: "card",
      labelKey: "payment.creditCard",
      descriptionKey: "payment.creditCardDescription",
    },
    {
      id: "paypal",
      labelKey: "payment.paypal",
      descriptionKey: "payment.paypalDescription",
    },
    {
      id: "ideal",
      labelKey: "payment.ideal",
      descriptionKey: "payment.idealDescription",
    },
  ],
};
