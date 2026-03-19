package com.commerce.api.product.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "store_product")
@IdClass(StoreProductId.class)
public class StoreProduct {

    @Id
    @Column(name = "store_code", length = 16)
    private String storeCode;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String featuredImageUrl;

    @Column(length = 512)
    private String featuredImageAlt;

    /** Comma-separated tags for this product in this store. */
    @Column(columnDefinition = "TEXT")
    private String tags;

    public StoreProduct() {
    }

    public StoreProduct(String storeCode, String featuredImageUrl, String featuredImageAlt, String tags) {
        this.storeCode = storeCode;
        this.featuredImageUrl = featuredImageUrl;
        this.featuredImageAlt = featuredImageAlt;
        this.tags = tags;
    }

    // -- Getters & Setters --

    public String getStoreCode() { return storeCode; }
    public void setStoreCode(String storeCode) { this.storeCode = storeCode; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getFeaturedImageUrl() { return featuredImageUrl; }
    public void setFeaturedImageUrl(String featuredImageUrl) { this.featuredImageUrl = featuredImageUrl; }

    public String getFeaturedImageAlt() { return featuredImageAlt; }
    public void setFeaturedImageAlt(String featuredImageAlt) { this.featuredImageAlt = featuredImageAlt; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
