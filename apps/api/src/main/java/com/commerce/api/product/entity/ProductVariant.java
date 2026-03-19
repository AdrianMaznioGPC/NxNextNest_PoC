package com.commerce.api.product.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variant")
public class ProductVariant {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VariantTranslation> translations = new ArrayList<>();

    public ProductVariant() {
    }

    public ProductVariant(String id, int sortOrder) {
        this.id = id;
        this.sortOrder = sortOrder;
    }

    // -- Getters & Setters --

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public List<VariantTranslation> getTranslations() { return translations; }
    public void setTranslations(List<VariantTranslation> translations) { this.translations = translations; }

    // -- Helpers --

    public void addTranslation(VariantTranslation translation) {
        translations.add(translation);
        translation.setVariant(this);
    }
}
