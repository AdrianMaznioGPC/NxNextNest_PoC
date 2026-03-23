"use client";

import clsx from "clsx";
import { useT } from "lib/i18n/messages-context";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEP_KEYS = ["stepAddress", "stepShippingPayment", "stepReview"] as const;

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const t = useT("checkout");

  return (
    <nav aria-label="Checkout steps" className="mb-8">
      <ol className="flex items-center">
        {STEP_KEYS.map((key, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <li
              key={key}
              className={clsx(
                "flex items-center",
                index < STEP_KEYS.length - 1 && "flex-1",
              )}
            >
              {/* Step circle + label */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                className={clsx(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isClickable && "cursor-pointer hover:text-link-hover",
                  !isClickable && "cursor-default",
                  isCurrent && "text-primary",
                  isCompleted && "text-primary",
                  !isCurrent && !isCompleted && "text-muted",
                )}
              >
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isCurrent && "bg-primary text-primary-foreground",
                    isCompleted && "bg-primary text-primary-foreground",
                    !isCurrent &&
                      !isCompleted &&
                      "border-2 border-border text-muted",
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline">{t(key)}</span>
              </button>

              {/* Connector line */}
              {index < STEP_KEYS.length - 1 && (
                <div
                  className={clsx(
                    "mx-3 h-0.5 flex-1 transition-colors",
                    index < currentStep ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
