import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsInt,
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
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartLineDto)
  lines!: CartLineDto[];
}

export class RemoveFromCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  lineIds!: string[];
}

export class UpdateCartLineDto {
  @IsString()
  id!: string;

  @IsString()
  merchandiseId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}

export class UpdateCartDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateCartLineDto)
  lines!: UpdateCartLineDto[];
}
