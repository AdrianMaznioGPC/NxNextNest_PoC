import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import type {
  LaunchDarklyConfig,
  LaunchDarklyContext,
} from "./launchdarkly.types";

export const LAUNCHDARKLY_CONFIG = Symbol("LAUNCHDARKLY_CONFIG");

/**
 * Wraps the LaunchDarkly server-side SDK.
 *
 * In production, this would initialize the real LD client via `@launchdarkly/node-server-sdk`.
 * Currently a stub that logs evaluations — replace the body of `init()` and
 * `jsonVariation()` with real SDK calls when the dependency is added.
 */
@Injectable()
export class LaunchDarklyClientService implements OnModuleDestroy {
  private readonly logger = new Logger(LaunchDarklyClientService.name);
  private initialized = false;

  constructor(
    @Inject(LAUNCHDARKLY_CONFIG)
    private readonly config: LaunchDarklyConfig,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.config.sdkKey) {
      this.logger.warn(
        "LAUNCHDARKLY_SDK_KEY not set — LaunchDarkly client will return defaults",
      );
      return;
    }

    // TODO: Initialize real LD client
    // this.client = LaunchDarkly.init(this.config.sdkKey);
    // await this.client.waitForInitialization();
    this.initialized = true;
    this.logger.log("LaunchDarkly client initialized");
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.initialized) return;

    // TODO: Close real LD client
    // await this.client.close();
    this.logger.log("LaunchDarkly client closed");
  }

  get directivesFlagKey(): string {
    return this.config.directivesFlagKey;
  }

  /**
   * Evaluate a JSON flag variation.
   *
   * Returns the flag value or the provided default if the client is not
   * initialized or the flag cannot be evaluated.
   */
  async jsonVariation<T>(
    flagKey: string,
    context: LaunchDarklyContext,
    defaultValue: T,
  ): Promise<T> {
    if (!this.initialized) {
      return defaultValue;
    }

    // TODO: Replace with real SDK call
    // return this.client.jsonVariation(flagKey, context, defaultValue) as T;
    this.logger.debug(
      `Flag evaluation: ${flagKey} for context ${JSON.stringify(context)}`,
    );
    return defaultValue;
  }
}
