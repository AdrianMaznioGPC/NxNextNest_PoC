import { Module } from "@nestjs/common";
import { MerchandisingResolverService } from "./merchandising-resolver.service";
import { MerchandisingValidatorService } from "./merchandising-validator.service";

@Module({
  providers: [MerchandisingResolverService, MerchandisingValidatorService],
  exports: [MerchandisingResolverService],
})
export class MerchandisingModule {}
