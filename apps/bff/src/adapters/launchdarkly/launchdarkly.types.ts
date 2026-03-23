/**
 * LaunchDarkly context shape used for flag evaluation.
 *
 * Uses multi-context to represent the different dimensions
 * (user, store, campaign, route) that LD uses for targeting.
 */
export type LaunchDarklyContext = {
  kind: "multi";
  user: {
    key: string;
    custom?: Record<string, string | boolean | number>;
  };
  store: {
    key: string;
  };
  campaign: {
    key: string;
  };
  route: {
    key: string;
  };
};

/** Configuration required to initialize the LaunchDarkly client. */
export type LaunchDarklyConfig = {
  sdkKey: string;
  /** Flag key that returns the campaign directives JSON payload. */
  directivesFlagKey: string;
};
