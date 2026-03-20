"use client";

import { useT } from "lib/i18n/messages-context";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: StepNavigationProps) {
  const t = useT("checkout");
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      {/* Back button */}
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-control border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted-surface"
        >
          {t("back")}
        </button>
      ) : (
        <div />
      )}

      {/* Next or Place Order */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-control bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t("placingOrder") : t("placeOrder")}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="rounded-control bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          {t("next")}
        </button>
      )}
    </div>
  );
}
