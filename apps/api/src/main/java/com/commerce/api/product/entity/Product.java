package com.commerce.api.product.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 255)
    private String handle;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder")
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StoreProduct> storeProducts = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductTranslation> translations = new ArrayList<>();

    public Product() {
    }

    public Product(String id, String handle) {
        this.id = id;
        this.handle = handle;
        this.updatedAt = Instant.now();
    }

    // -- Getters & Setters --

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHandle() { return handle; }
    public void setHandle(String handle) { this.handle = handle; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }

    public List<StoreProduct> getStoreProducts() { return storeProducts; }
    public void setStoreProducts(List<StoreProduct> storeProducts) { this.storeProducts = storeProducts; }

    public List<ProductTranslation> getTranslations() { return translations; }
    public void setTranslations(List<ProductTranslation> translations) { this.translations = translations; }

    // -- Helpers --

    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }

    public void addStoreProduct(StoreProduct storeProduct) {
        storeProducts.add(storeProduct);
        storeProduct.setProduct(this);
    }

    public void addTranslation(ProductTranslation translation) {
        translations.add(translation);
        translation.setProduct(this);
    }
}
