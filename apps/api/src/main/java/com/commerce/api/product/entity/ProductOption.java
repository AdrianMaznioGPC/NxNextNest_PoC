package com.commerce.api.product.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_option",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "store_code", "locale", "option_key"}))
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * Stable key identifying this option across locales (e.g. "axle", "size").
     */
    @Column(name = "option_key", nullable = false, length = 64)
    private String optionKey;

    @Column(name = "store_code", nullable = false, length = 16)
    private String storeCode;

    @Column(nullable = false, length = 16)
    private String locale;

    /** Localized display name (e.g. "Axle" in en, "Essieu" in fr). */
    @Column(nullable = false)
    private String name;

    /** Localized option values as JSON array (e.g. ["Front","Rear"]). */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String valuesJson;

    public ProductOption() {
    }

    public ProductOption(String optionKey, String storeCode, String locale,
                          String name, String valuesJson) {
        this.optionKey = optionKey;
        this.storeCode = storeCode;
        this.locale = locale;
        this.name = name;
        this.valuesJson = valuesJson;
    }

    // -- Getters & Setters --

    public Long getId() { return id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getOptionKey() { return optionKey; }
    public void setOptionKey(String optionKey) { this.optionKey = optionKey; }

    public String getStoreCode() { return storeCode; }
    public void setStoreCode(String storeCode) { this.storeCode = storeCode; }

    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getValuesJson() { return valuesJson; }
    public void setValuesJson(String valuesJson) { this.valuesJson = valuesJson; }
}
