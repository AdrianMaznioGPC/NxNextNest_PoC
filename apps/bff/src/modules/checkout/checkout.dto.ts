import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  cartId!: string;

  @IsObject()
  shippingAddress!: Record<string, string>;

  @IsObject()
  billingAddress!: Record<string, string>;

  @IsString()
  @IsNotEmpty()
  deliveryOptionId!: string;

  @IsString()
  @IsNotEmpty()
  paymentOptionId!: string;
}
