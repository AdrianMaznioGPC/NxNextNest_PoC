import { Injectable } from "@nestjs/common";
import type { OrderPort } from "../../ports/order.port";

@Injectable()
export class MockOrderAdapter implements OrderPort {}
