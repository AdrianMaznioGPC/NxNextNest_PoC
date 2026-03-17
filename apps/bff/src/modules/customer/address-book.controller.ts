import type { SavedAddress } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  SetMetadata,
} from "@nestjs/common";
import { CUSTOMER_PORT, CustomerPort } from "../../ports/customer.port";
import { StoreContext } from "../../store";
import { CACHE_ROUTE_KIND_KEY } from "../system/cache-policy.service";
import { LOAD_SHED_SCOPE_KEY } from "../system/load-shedding.config";

@Controller("customers/me/addresses")
@SetMetadata(LOAD_SHED_SCOPE_KEY, "customers")
@SetMetadata(CACHE_ROUTE_KIND_KEY, "customers")
export class AddressBookController {
  constructor(
    @Inject(CUSTOMER_PORT) private readonly customer: CustomerPort,
    private readonly store: StoreContext,
  ) {}

  private requireAuth(): string {
    const id = this.store.customerId;
    if (!id) throw new ForbiddenException("Authentication required");
    return id;
  }

  @Get()
  getAddresses(): Promise<SavedAddress[]> {
    const customerId = this.requireAuth();
    return this.customer.getAddresses(customerId);
  }

  @Post()
  createAddress(@Body() body: Omit<SavedAddress, "id">): Promise<SavedAddress> {
    const customerId = this.requireAuth();
    return this.customer.createAddress(customerId, body);
  }

  @Patch(":id")
  async updateAddress(
    @Param("id") id: string,
    @Body() body: Partial<Omit<SavedAddress, "id">>,
  ): Promise<SavedAddress> {
    const customerId = this.requireAuth();
    const result = await this.customer.updateAddress(customerId, id, body);
    if (!result) throw new NotFoundException("Address not found");
    return result;
  }

  @Delete(":id")
  async deleteAddress(@Param("id") id: string): Promise<void> {
    const customerId = this.requireAuth();
    const deleted = await this.customer.deleteAddress(customerId, id);
    if (!deleted) throw new NotFoundException("Address not found");
  }

  @Post(":id/default")
  async setDefault(
    @Param("id") id: string,
    @Body("type") type: "shipping" | "billing",
  ): Promise<SavedAddress> {
    const customerId = this.requireAuth();
    const result = await this.customer.setDefaultAddress(customerId, id, type);
    if (!result) throw new NotFoundException("Address not found");
    return result;
  }
}
