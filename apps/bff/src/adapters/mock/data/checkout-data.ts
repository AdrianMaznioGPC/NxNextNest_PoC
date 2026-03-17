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
        label: "Prénom",
        type: "text",
        autoComplete: "given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        label: "Nom",
        type: "text",
        autoComplete: "family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "email",
        label: "E-mail",
        type: "email",
        autoComplete: "email",
        required: true,
        colSpan: 1,
      },
      {
        name: "phone",
        label: "Téléphone",
        type: "tel",
        autoComplete: "tel",
        required: false,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        label: "Adresse",
        type: "text",
        autoComplete: "street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "postalCode",
        label: "Code postal",
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
        label: "Ville",
        type: "text",
        autoComplete: "address-level2",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "country",
        label: "Pays",
        type: "select",
        autoComplete: "country-name",
        required: true,
        colSpan: 2,
        options: [
          { value: "FR", label: "France" },
          { value: "BE", label: "Belgique" },
          { value: "LU", label: "Luxembourg" },
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
        label: "First Name",
        type: "text",
        autoComplete: "given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        autoComplete: "family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "email",
        label: "Email",
        type: "email",
        autoComplete: "email",
        required: true,
        colSpan: 1,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        autoComplete: "tel",
        required: false,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        label: "Address",
        type: "text",
        autoComplete: "street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        label: "City",
        type: "text",
        autoComplete: "address-level2",
        required: true,
        colSpan: 1,
      },
      {
        name: "county",
        label: "County",
        type: "text",
        autoComplete: "address-level1",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "eircode",
        label: "Eircode",
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
        label: "Country",
        type: "select",
        autoComplete: "country-name",
        required: true,
        colSpan: 1,
        options: [
          { value: "IE", label: "Ireland" },
          { value: "GB", label: "United Kingdom" },
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
        label: "Prénom",
        type: "text",
        autoComplete: "billing given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        label: "Nom",
        type: "text",
        autoComplete: "billing family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        label: "Adresse",
        type: "text",
        autoComplete: "billing street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "postalCode",
        label: "Code postal",
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
        label: "Ville",
        type: "text",
        autoComplete: "billing address-level2",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "country",
        label: "Pays",
        type: "select",
        autoComplete: "billing country-name",
        required: true,
        colSpan: 2,
        options: [
          { value: "FR", label: "France" },
          { value: "BE", label: "Belgique" },
          { value: "LU", label: "Luxembourg" },
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
        label: "First Name",
        type: "text",
        autoComplete: "billing given-name",
        required: true,
        colSpan: 1,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        autoComplete: "billing family-name",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "address",
        label: "Address",
        type: "text",
        autoComplete: "billing street-address",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        label: "City",
        type: "text",
        autoComplete: "billing address-level2",
        required: true,
        colSpan: 1,
      },
      {
        name: "county",
        label: "County",
        type: "text",
        autoComplete: "billing address-level1",
        required: true,
        colSpan: 1,
      },
    ],
    [
      {
        name: "eircode",
        label: "Eircode",
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
        label: "Country",
        type: "select",
        autoComplete: "billing country-name",
        required: true,
        colSpan: 1,
        options: [
          { value: "IE", label: "Ireland" },
          { value: "GB", label: "United Kingdom" },
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
      label: "Colissimo",
      description: "5 à 7 jours ouvrables",
      price: { amount: "4.99", currencyCode: "EUR" },
    },
    {
      id: "chronopost",
      label: "Chronopost",
      description: "2 à 3 jours ouvrables",
      price: { amount: "9.99", currencyCode: "EUR" },
    },
    {
      id: "chronopost-express",
      label: "Chronopost Express",
      description: "Jour ouvrable suivant",
      price: { amount: "19.99", currencyCode: "EUR" },
    },
  ],
  ie: [
    {
      id: "standard",
      label: "Standard Shipping",
      description: "5-7 business days",
      price: { amount: "4.99", currencyCode: "EUR" },
    },
    {
      id: "express",
      label: "Express Shipping",
      description: "2-3 business days",
      price: { amount: "9.99", currencyCode: "EUR" },
    },
    {
      id: "nextDay",
      label: "Next Day Delivery",
      description: "Next business day",
      price: { amount: "14.99", currencyCode: "EUR" },
    },
  ],
};

// -- Payment options ---------------------------------------------------------

export const paymentOptionsByStore: Record<string, PaymentOption[]> = {
  fr: [
    {
      id: "card",
      label: "Carte de crédit",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Payer avec votre compte PayPal",
    },
  ],
  ie: [
    {
      id: "card",
      label: "Credit Card",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "paypal",
      label: "PayPal",
      description: "Pay with your PayPal account",
    },
    {
      id: "ideal",
      label: "iDEAL",
      description: "Pay with your bank account",
    },
  ],
};
