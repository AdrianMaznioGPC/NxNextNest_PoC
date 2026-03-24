import type { SavedAddress } from "@commerce/shared-types";
import { Body, Controller, Get, Headers, Inject, Post } from "@nestjs/common";
import type { CustomerPort } from "../../ports/customer.port";
import { CUSTOMER_PORT } from "../../ports/customer.port";

/**
 * Placeholder customer ID header. A real implementation would extract
 * the identity from a JWT or session token via an auth guard.
 */
const CUSTOMER_ID_HEADER = "x-customer-id";
const ANONYMOUS_CUSTOMER_ID = "anonymous";

@Controller("customer/addresses")
export class AddressBookController {
  constructor(@Inject(CUSTOMER_PORT) private readonly customer: CustomerPort) {}

  @Get()
  getAddresses(
    @Headers(CUSTOMER_ID_HEADER) customerId?: string,
  ): Promise<SavedAddress[]> {
    return this.customer.getAddresses(customerId || ANONYMOUS_CUSTOMER_ID);
  }

  @Post()
  createAddress(
    @Body() body: Omit<SavedAddress, "id">,
    @Headers(CUSTOMER_ID_HEADER) customerId?: string,
  ): Promise<SavedAddress> {
    return this.customer.createAddress(
      customerId || ANONYMOUS_CUSTOMER_ID,
      body,
    );
  }
}
