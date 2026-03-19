package com.commerce.api.product.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_translation",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "store_code", "locale"}))
public class ProductTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "store_code", nullable = false, length = 16)
    private String storeCode;

    @Column(nullable = false, length = 16)
    private String locale;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionHtml;

    @Column(length = 255)
    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    public ProductTranslation() {
    }

    public ProductTranslation(String storeCode, String locale, String title,
                               String description, String descriptionHtml,
                               String seoTitle, String seoDescription) {
        this.storeCode = storeCode;
        this.locale = locale;
        this.title = title;
        this.description = description;
        this.descriptionHtml = descriptionHtml;
        this.seoTitle = seoTitle;
        this.seoDescription = seoDescription;
    }

    // -- Getters & Setters --

    public Long getId() { return id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getStoreCode() { return storeCode; }
    public void setStoreCode(String storeCode) { this.storeCode = storeCode; }

    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDescriptionHtml() { return descriptionHtml; }
    public void setDescriptionHtml(String descriptionHtml) { this.descriptionHtml = descriptionHtml; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }
}
