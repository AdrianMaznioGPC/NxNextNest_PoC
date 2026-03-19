package com.commerce.api.config;

/**
 * Holds per-request store and locale context, extracted from HTTP headers.
 */
public record StoreContext(String storeCode, String locale) {

    public static final String DEFAULT_STORE_CODE = "fr";
    public static final String DEFAULT_LOCALE = "fr-FR";

    public String language() {
        if (locale == null || !locale.contains("-")) {
            return "fr";
        }
        return locale.split("-")[0];
    }
}
