import type {
  OrderConfirmation,
  OrderLineItem,
  PlaceOrderRequest,
} from "@commerce/shared-types";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  RAW_CART_PORT,
  RAW_CHECKOUT_PORT,
} from "../../modules/system/system.module";
import type { CartPort } from "../../ports/cart.port";
import type { CheckoutPort } from "../../ports/checkout.port";
import type { OrderPort } from "../../ports/order.port";

@Injectable()
export class MockOrderAdapter implements OrderPort {
  /** In-memory store so the confirmation can be retrieved after placement. */
  private static readonly orders = new Map<string, OrderConfirmation>();

  constructor(
    @Inject(RAW_CART_PORT) private readonly cart: CartPort,
    @Inject(RAW_CHECKOUT_PORT) private readonly checkout: CheckoutPort,
  ) {}

  async placeOrder(request: PlaceOrderRequest): Promise<OrderConfirmation> {
    const cart = await this.cart.getCart(request.cartId);
    if (!cart || cart.lines.length === 0) {
      throw new NotFoundException("Cart not found or empty");
    }

    const config = await this.checkout.getCheckoutConfig();

    const deliveryOption = config.deliveryOptions.find(
      (o) => o.id === request.deliveryOptionId,
    );
    if (!deliveryOption) {
      throw new NotFoundException(
        `Delivery option "${request.deliveryOptionId}" not found`,
      );
    }

    const paymentOption = config.paymentOptions.find(
      (o) => o.id === request.paymentOptionId,
    );
    if (!paymentOption) {
      throw new NotFoundException(
        `Payment option "${request.paymentOptionId}" not found`,
      );
    }

    const lines: OrderLineItem[] = cart.lines.map((line) => {
      const unitAmount = (
        parseFloat(line.cost.totalAmount.amount) / line.quantity
      ).toFixed(2);
      return {
        title: line.merchandise.product.title,
        variantTitle: line.merchandise.title,
        quantity: line.quantity,
        image: line.merchandise.product.featuredImage,
        unitPrice: {
          amount: unitAmount,
          currencyCode: line.cost.totalAmount.currencyCode,
        },
        totalPrice: line.cost.totalAmount,
      };
    });

    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const shipping = parseFloat(deliveryOption.price.amount);
    const tax = parseFloat(cart.cost.totalTaxAmount.amount);
    const total = subtotal + shipping + tax;
    const currencyCode = cart.cost.totalAmount.currencyCode;

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const confirmation: OrderConfirmation = {
      orderId: `order-${Date.now()}`,
      orderNumber,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      shippingAddress: request.shippingAddress,
      billingAddress: request.billingAddress,
      deliveryOption,
      paymentOption,
      lines,
      cost: {
        subtotalAmount: { amount: subtotal.toFixed(2), currencyCode },
        shippingAmount: { amount: shipping.toFixed(2), currencyCode },
        taxAmount: { amount: tax.toFixed(2), currencyCode },
        totalAmount: { amount: total.toFixed(2), currencyCode },
      },
    };

    MockOrderAdapter.orders.set(confirmation.orderId, confirmation);
    return confirmation;
  }

  async getOrder(orderId: string): Promise<OrderConfirmation | undefined> {
    return MockOrderAdapter.orders.get(orderId);
  }
}
