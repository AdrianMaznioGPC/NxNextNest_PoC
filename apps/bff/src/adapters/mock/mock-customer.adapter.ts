import { Injectable } from "@nestjs/common";
import type { CustomerPort } from "../../ports/customer.port";

@Injectable()
export class MockCustomerAdapter implements CustomerPort {}
