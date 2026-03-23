import type { SavedAddress } from "@commerce/shared-types";
import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { CUSTOMER_PORT } from "../../ports/customer.port";
import type { CustomerPort } from "../../ports/customer.port";

@Controller("customer/addresses")
export class AddressBookController {
  constructor(@Inject(CUSTOMER_PORT) private readonly customer: CustomerPort) {}

  @Get()
  getAddresses(): Promise<SavedAddress[]> {
    return this.customer.getAddresses("mock-customer");
  }

  @Post()
  createAddress(@Body() body: Omit<SavedAddress, "id">): Promise<SavedAddress> {
    return this.customer.createAddress("mock-customer", body);
  }
}
