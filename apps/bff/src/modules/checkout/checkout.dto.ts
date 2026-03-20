export class PlaceOrderDto {
  cartId!: string;
  shippingAddress!: Record<string, string>;
  billingAddress!: Record<string, string>;
  deliveryOptionId!: string;
  paymentOptionId!: string;
}
