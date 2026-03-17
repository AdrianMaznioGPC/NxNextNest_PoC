import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* ── Context ─────────────────────────────────────────────────────────── */

interface RadioCardGroupContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const RadioCardGroupContext = createContext<RadioCardGroupContextValue | null>(
  null,
);

function useRadioCardGroup() {
  const ctx = useContext(RadioCardGroupContext);
  if (!ctx) {
    throw new Error("RadioCard must be used within a RadioCardGroup");
  }
  return ctx;
}

/* ── RadioCardGroup ──────────────────────────────────────────────────── */

export interface RadioCardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Form field name for the radio inputs. */
  name: string;
  /** Currently selected value. */
  value: string;
  /** Callback when selection changes. */
  onValueChange: (value: string) => void;
}

/**
 * Container for a group of selectable radio cards.
 *
 * @example
 * ```tsx
 * <RadioCardGroup name="delivery" value={selected} onValueChange={setSelected}>
 *   <RadioCard value="standard">
 *     <RadioCardLabel>Standard Shipping</RadioCardLabel>
 *     <RadioCardDescription>3-5 business days</RadioCardDescription>
 *   </RadioCard>
 *   <RadioCard value="express">
 *     <RadioCardLabel>Express Shipping</RadioCardLabel>
 *     <RadioCardDescription>1-2 business days</RadioCardDescription>
 *   </RadioCard>
 * </RadioCardGroup>
 * ```
 */
export const RadioCardGroup = forwardRef<HTMLDivElement, RadioCardGroupProps>(
  ({ name, value, onValueChange, className, children, ...props }, ref) => (
    <RadioCardGroupContext.Provider
      value={{ name, value, onChange: onValueChange }}
    >
      <div
        ref={ref}
        role="radiogroup"
        className={cn("space-y-3", className)}
        {...props}
      >
        {children}
      </div>
    </RadioCardGroupContext.Provider>
  ),
);
RadioCardGroup.displayName = "RadioCardGroup";

/* ── RadioCard ───────────────────────────────────────────────────────── */

export interface RadioCardProps
  extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
  /** Value for this option (matched against RadioCardGroup's value). */
  value: string;
  /** When true, the card cannot be selected. */
  disabled?: boolean;
}

/**
 * Selectable card with an embedded radio input.
 * Highlights when active. Renders as a `<label>` wrapping a hidden radio.
 */
export const RadioCard = forwardRef<HTMLLabelElement, RadioCardProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    const group = useRadioCardGroup();
    const isSelected = group.value === value;

    return (
      <label
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/30",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        <input
          type="radio"
          name={group.name}
          value={value}
          checked={isSelected}
          disabled={disabled}
          onChange={() => group.onChange(value)}
          className="h-4 w-4 border-input text-primary accent-primary"
        />
        <div className="flex flex-1 flex-col">{children}</div>
      </label>
    );
  },
);
RadioCard.displayName = "RadioCard";

/* ── Sub-components ──────────────────────────────────────────────────── */

export const RadioCardLabel = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
RadioCardLabel.displayName = "RadioCardLabel";

export const RadioCardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
RadioCardDescription.displayName = "RadioCardDescription";
