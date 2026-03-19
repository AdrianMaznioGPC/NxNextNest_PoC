package com.commerce.api.config;

/**
 * Thread-local holder for the current request's store context.
 * Set by {@link StoreContextFilter}, cleared after request completes.
 */
public final class StoreContextHolder {

    private static final ThreadLocal<StoreContext> CONTEXT = new ThreadLocal<>();

    private StoreContextHolder() {
    }

    public static StoreContext get() {
        StoreContext ctx = CONTEXT.get();
        if (ctx == null) {
            return new StoreContext(StoreContext.DEFAULT_STORE_CODE, StoreContext.DEFAULT_LOCALE);
        }
        return ctx;
    }

    public static void set(StoreContext context) {
        CONTEXT.set(context);
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
