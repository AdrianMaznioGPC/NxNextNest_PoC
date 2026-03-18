"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const AccordionRoot = forwardRef<
  ComponentRef<typeof BaseAccordion.Root>,
  ComponentPropsWithoutRef<typeof BaseAccordion.Root>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Root
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
AccordionRoot.displayName = "AccordionRoot";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const AccordionItem = forwardRef<
  ComponentRef<typeof BaseAccordion.Item>,
  ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Item
    ref={ref}
    className={cn("border-b border-border", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/* ── Trigger ─────────────────────────────────────────────────────────── */

export const AccordionTrigger = forwardRef<
  ComponentRef<typeof BaseAccordion.Trigger>,
  ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Header>
    <BaseAccordion.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 w-full items-center justify-between py-4 text-sm font-medium text-foreground transition-all",
        "hover:underline",
        "[&>svg]:transition-transform [&>svg]:duration-200",
        "data-[panel-open]:[&>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 shrink-0 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </BaseAccordion.Trigger>
  </BaseAccordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

/* ── Panel ────────────────────────────────────────────────────────────── */

export const AccordionPanel = forwardRef<
  ComponentRef<typeof BaseAccordion.Panel>,
  ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "h-[var(--accordion-panel-height)] transition-[height] duration-200 ease-out",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{props.children}</div>
  </BaseAccordion.Panel>
));
AccordionPanel.displayName = "AccordionPanel";
