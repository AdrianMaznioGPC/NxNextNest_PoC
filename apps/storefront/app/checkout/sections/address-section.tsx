"use client";

import type { AddressFieldConfig, AddressFormSchema } from "lib/types";
import { useTranslations } from "next-intl";

interface AddressSectionProps {
  schema: AddressFormSchema;
  values: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
}

function TextField({
  field,
  value,
  onChange,
  label,
}: {
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div>
      <label
        htmlFor={field.name}
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
        id={field.name}
        name={field.name}
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
  field,
  value,
  onChange,
  label,
}: {
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const t = useTranslations("checkout");

  return (
    <div>
      <label
        htmlFor={field.name}
        className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
      </label>
      <select
        id={field.name}
        name={field.name}
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
  field,
  value,
  onChange,
}: {
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("checkout");
  const label = t(field.labelKey);

  if (field.type === "select") {
    return (
      <SelectField
        field={field}
        value={value}
        onChange={onChange}
        label={label}
      />
    );
  }

  return (
    <TextField field={field} value={value} onChange={onChange} label={label} />
  );
}

/** Maps a colSpan value to the appropriate Tailwind grid column class. */
function colSpanClass(colSpan: number | undefined, rowLength: number): string {
  const span = colSpan ?? 1;
  if (rowLength === 1 || span >= rowLength) return "sm:col-span-full";
  return "";
}

export function AddressSection({
  schema,
  values,
  onChange,
}: AddressSectionProps) {
  const t = useTranslations("checkout");

  return (
    <fieldset>
      <legend className="mb-4 text-lg font-semibold">
        {t("shippingAddress")}
      </legend>
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        {schema.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {row.map((field) => (
              <div
                key={field.name}
                className={colSpanClass(field.colSpan, row.length)}
              >
                <AddressField
                  field={field}
                  value={values[field.name] ?? ""}
                  onChange={(v) => onChange(field.name, v)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
