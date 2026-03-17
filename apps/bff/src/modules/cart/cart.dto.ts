import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class CartLineDto {
  @IsString()
  merchandiseId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class AddToCartDto {
  @IsOptional()
  @IsString()
  cartId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartLineDto)
  lines!: CartLineDto[];
}

export class RemoveFromCartDto {
  @IsString()
  cartId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  merchandiseIds!: string[];
}

export class UpdateCartLineDto {
  @IsString()
  merchandiseId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}

export class UpdateCartDto {
  @IsString()
  cartId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateCartLineDto)
  lines!: UpdateCartLineDto[];
}
