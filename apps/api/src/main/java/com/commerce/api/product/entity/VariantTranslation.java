package com.commerce.api.product.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "variant_translation",
        uniqueConstraints = @UniqueConstraint(columnNames = {"variant_id", "store_code", "locale"}))
public class VariantTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    private ProductVariant variant;

    @Column(name = "store_code", nullable = false, length = 16)
    private String storeCode;

    @Column(nullable = false, length = 16)
    private String locale;

    @Column(nullable = false)
    private String title;

    public VariantTranslation() {
    }

    public VariantTranslation(String storeCode, String locale, String title) {
        this.storeCode = storeCode;
        this.locale = locale;
        this.title = title;
    }

    // -- Getters & Setters --

    public Long getId() { return id; }

    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }

    public String getStoreCode() { return storeCode; }
    public void setStoreCode(String storeCode) { this.storeCode = storeCode; }

    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
