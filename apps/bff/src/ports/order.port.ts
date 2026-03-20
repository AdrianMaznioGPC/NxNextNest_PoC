import type {
  OrderConfirmation,
  PlaceOrderRequest,
} from "@commerce/shared-types";

export interface OrderPort {
  placeOrder(request: PlaceOrderRequest): Promise<OrderConfirmation>;
  getOrder(orderId: string): Promise<OrderConfirmation | undefined>;
}

export const ORDER_PORT = Symbol("ORDER_PORT");
