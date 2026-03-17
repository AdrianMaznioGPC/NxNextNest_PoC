"use client";

import { AddressPicker } from "components/address/address-picker";
import type {
  AddressFieldConfig,
  AddressFormSchema,
  SavedAddress,
} from "lib/types";
import { useTranslations } from "next-intl";

interface AddressSectionProps {
  title: string;
  idPrefix: string;
  schema: AddressFormSchema;
  values: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
  savedAddresses?: SavedAddress[];
  selectedAddressId?: string | null;
  onSelectSavedAddress?: (address: SavedAddress | null) => void;
}

function TextField({
  fieldId,
  field,
  value,
  onChange,
  label,
}: {
  fieldId: string;
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
        {!field.required && (
          <span className="ml-1 text-neutral-400 dark:text-neutral-500">
            (optional)
          </span>
        )}
      </label>
      <input
        id={fieldId}
        name={fieldId}
        type={field.type}
        autoComplete={field.autoComplete}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        pattern={field.validation?.pattern}
        minLength={field.validation?.minLength}
        maxLength={field.validation?.maxLength}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
      />
    </div>
  );
}

function SelectField({
  fieldId,
  field,
  value,
  onChange,
  label,
}: {
  fieldId: string;
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const t = useTranslations("checkout");

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <select
        id={fieldId}
        name={fieldId}
        autoComplete={field.autoComplete}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
      >
        <option value="" disabled>
          {label}
        </option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddressField({
  fieldId,
  field,
  value,
  onChange,
}: {
  fieldId: string;
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("checkout");
  const label = t(field.labelKey);

  if (field.type === "select") {
    return (
      <SelectField
        fieldId={fieldId}
        field={field}
        value={value}
        onChange={onChange}
        label={label}
      />
    );
  }

  return (
    <TextField
      fieldId={fieldId}
      field={field}
      value={value}
      onChange={onChange}
      label={label}
    />
  );
}

/** Maps a colSpan value to the appropriate Tailwind grid column class. */
function colSpanClass(colSpan: number | undefined, rowLength: number): string {
  const span = colSpan ?? 1;
  if (rowLength === 1 || span >= rowLength) return "sm:col-span-full";
  return "";
}

export function AddressSection({
  title,
  idPrefix,
  schema,
  values,
  onChange,
  savedAddresses,
  selectedAddressId,
  onSelectSavedAddress,
}: AddressSectionProps) {
  const hasPicker =
    savedAddresses && savedAddresses.length > 0 && onSelectSavedAddress;
  const showForm = !hasPicker || selectedAddressId === null;

  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 text-lg font-semibold">{title}</legend>

      {hasPicker && (
        <AddressPicker
          addresses={savedAddresses}
          selectedId={selectedAddressId ?? null}
          onSelect={onSelectSavedAddress}
        />
      )}

      {showForm && (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
          {schema.rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {row.map((field) => {
                const fieldId = `${idPrefix}-${field.name}`;

                return (
                  <div
                    key={field.name}
                    className={colSpanClass(field.colSpan, row.length)}
                  >
                    <AddressField
                      fieldId={fieldId}
                      field={field}
                      value={values[field.name] ?? ""}
                      onChange={(v) => onChange(field.name, v)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </fieldset>
  );
}
