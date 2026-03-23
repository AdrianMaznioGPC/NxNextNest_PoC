import { Module } from "@nestjs/common";
import { MockCommerceModule } from "./mock-commerce.module";
import { MockDirectiveModule } from "./mock-directive.module";

/**
 * Convenience module that re-exports both commerce and directive mock modules.
 * Prefer importing `MockCommerceModule` and `MockDirectiveModule` separately
 * when you need to swap the directive provider (e.g., for LaunchDarkly).
 */
@Module({
  imports: [MockCommerceModule, MockDirectiveModule],
  exports: [MockCommerceModule, MockDirectiveModule],
})
export class MockBackendModule {}
