"use client";

import {
  Checkbox,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@commerce/ui";
import type { AddressFieldConfig, AddressFormSchema } from "lib/types";
import { useTranslations } from "next-intl";

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
  label,
}: {
  fieldId: string;
  field: AddressFieldConfig;
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>
        {label}
        {!field.required && (
          <span className="ml-1 text-muted-foreground font-normal">
            (optional)
          </span>
        )}
      </FieldLabel>
      <Input
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
      />
    </Field>
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
  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Select
        items={field.options}
        defaultValue={field.options ? field.options[0] : undefined}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {field.options?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
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
  const label = field.label;

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

export function AddressForm({
  idPrefix,
  schema,
  values,
  onChange,
  saveAddress,
  onSaveAddressChange,
}: AddressFormProps) {
  const t = useTranslations("checkout");

  return (
    <div className="space-y-4">
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

      {onSaveAddressChange && (
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
          <Checkbox
            checked={saveAddress}
            onCheckedChange={(val) => onSaveAddressChange(val as boolean)}
          />
          {t("saveThisAddress")}
        </label>
      )}
    </div>
  );
}
