"use client";

import { useT } from "lib/i18n/messages-context";
import type { AddressFieldConfig, AddressFormSchema } from "lib/types";

interface AddressFormProps {
  idPrefix: string;
  schema: AddressFormSchema;
  values: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
  saveAddress?: boolean;
  onSaveAddressChange?: (save: boolean) => void;
}

function TextField({
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
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-foreground"
      >
        {field.label}
        {!field.required && (
          <span className="ml-1 font-normal text-muted">(optional)</span>
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
        className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SelectField({
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
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-sm font-medium text-foreground"
      >
        {field.label}
      </label>
      <select
        id={fieldId}
        name={fieldId}
        autoComplete={field.autoComplete}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">{field.label}</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
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
  if (field.type === "select") {
    return (
      <SelectField
        fieldId={fieldId}
        field={field}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <TextField
      fieldId={fieldId}
      field={field}
      value={value}
      onChange={onChange}
    />
  );
}

function colSpanClass(colSpan: number | undefined, rowLength: number): string {
  const span = colSpan ?? 1;
  if (rowLength === 1 || span >= rowLength) return "sm:col-span-full";
  return "";
}

export function AddressForm({
  idPrefix,
  schema,
  values,
  onChange,
  saveAddress,
  onSaveAddressChange,
}: AddressFormProps) {
  const t = useT("checkout");

  return (
    <div className="space-y-4">
      {schema.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {onSaveAddressChange && (
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => onSaveAddressChange(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          {t("saveThisAddress")}
        </label>
      )}
    </div>
  );
}
