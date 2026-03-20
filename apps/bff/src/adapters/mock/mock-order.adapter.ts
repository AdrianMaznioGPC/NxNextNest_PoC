import type {
  OrderConfirmation,
  OrderLineItem,
  PlaceOrderRequest,
} from "@commerce/shared-types";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CartPort } from "../../ports/cart.port";
import { CART_PORT } from "../../ports/cart.port";
import type { CheckoutPort } from "../../ports/checkout.port";
import { CHECKOUT_PORT } from "../../ports/checkout.port";
import type { OrderPort } from "../../ports/order.port";

@Injectable()
export class MockOrderAdapter implements OrderPort {
  private readonly orders = new Map<string, OrderConfirmation>();
  private orderCounter = 1000;

  constructor(
    @Inject(CART_PORT) private readonly cart: CartPort,
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
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
    const paymentOption = config.paymentOptions.find(
      (o) => o.id === request.paymentOptionId,
    );

    if (!deliveryOption || !paymentOption) {
      throw new NotFoundException("Invalid delivery or payment option");
    }

    const lines: OrderLineItem[] = cart.lines.map((line) => ({
      title: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      quantity: line.quantity,
      image: line.merchandise.product.featuredImage,
      totalPrice: line.cost.totalAmount,
    }));

    const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    const shipping = parseFloat(deliveryOption.price.amount);
    const tax = parseFloat(cart.cost.totalTaxAmount.amount);
    const total = subtotal + shipping + tax;
    const currencyCode = cart.cost.totalAmount.currencyCode;

    this.orderCounter++;
    const orderId = `order-${this.orderCounter}`;
    const orderNumber = `ORD-${this.orderCounter}`;

    const confirmation: OrderConfirmation = {
      orderId,
      orderNumber,
      lines,
      cost: {
        subtotalAmount: { amount: subtotal.toFixed(2), currencyCode },
        shippingAmount: {
          amount: shipping.toFixed(2),
          currencyCode,
        },
        taxAmount: { amount: tax.toFixed(2), currencyCode },
        totalAmount: { amount: total.toFixed(2), currencyCode },
      },
      deliveryOption: {
        label: deliveryOption.label,
        description: deliveryOption.description,
      },
      paymentOption: {
        label: paymentOption.label,
        description: paymentOption.description,
      },
    };

    this.orders.set(orderId, confirmation);
    return confirmation;
  }

  async getOrder(orderId: string): Promise<OrderConfirmation | undefined> {
    return this.orders.get(orderId);
  }
}
