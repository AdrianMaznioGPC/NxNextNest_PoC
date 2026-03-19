package com.commerce.api.product.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for {@link StoreProduct}.
 */
public class StoreProductId implements Serializable {

    private String storeCode;
    private String product;

    public StoreProductId() {
    }

    public StoreProductId(String storeCode, String product) {
        this.storeCode = storeCode;
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StoreProductId that)) return false;
        return Objects.equals(storeCode, that.storeCode) &&
                Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(storeCode, product);
    }
}
