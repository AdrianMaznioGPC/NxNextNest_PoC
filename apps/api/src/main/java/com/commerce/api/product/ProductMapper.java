package com.commerce.api.product;

import com.commerce.api.product.dto.ProductResponse;
import com.commerce.api.product.dto.ProductResponse.*;
import com.commerce.api.product.entity.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Maps JPA entities to the {@link ProductResponse} DTO, resolving translations
 * for the requested store and locale.
 */
@Component
public class ProductMapper {

    private static final ObjectMapper JSON = new ObjectMapper();

    /**
     * Converts a Product entity with its pre-fetched options into a response DTO.
     *
     * @param product   the JPA entity (with variants, translations, storeProducts loaded)
     * @param options   the ProductOption entities for this product's store + locale
     * @param storeCode the current store
     * @param locale    the current locale
     */
    public ProductResponse toResponse(Product product, List<ProductOption> options,
                                       String storeCode, String locale) {
        ProductTranslation translation = resolveTranslation(product, storeCode, locale);
        StoreProduct storeProduct = resolveStoreProduct(product, storeCode);

        List<OptionDto> optionDtos = toOptionDtos(options, product.getId());

        List<VariantDto> variantDtos = product.getVariants().stream()
                .map(v -> toVariantDto(v, storeCode, locale, optionDtos))
                .toList();

        String imageUrl = storeProduct != null ? storeProduct.getFeaturedImageUrl() : "";
        String imageAlt = translation != null ? translation.getTitle() : product.getHandle();
        ImageDto featuredImage = new ImageDto(imageUrl, imageAlt, 800, 800);

        List<String> tags = storeProduct != null && storeProduct.getTags() != null
                ? Arrays.stream(storeProduct.getTags().split(",")).map(String::trim).toList()
                : List.of();

        return new ProductResponse(
                product.getId(),
                product.getHandle(),
                translation != null ? translation.getTitle() : product.getHandle(),
                translation != null ? translation.getDescription() : "",
                translation != null ? translation.getDescriptionHtml() : "",
                optionDtos,
                variantDtos,
                featuredImage,
                List.of(featuredImage),
                new SeoDto(
                        translation != null ? translation.getSeoTitle() : "",
                        translation != null ? translation.getSeoDescription() : ""
                ),
                tags,
                product.getUpdatedAt().toString()
        );
    }

    // -- Private helpers --

    private ProductTranslation resolveTranslation(Product product, String storeCode, String locale) {
        return product.getTranslations().stream()
                .filter(t -> t.getStoreCode().equals(storeCode) && t.getLocale().equals(locale))
                .findFirst()
                .orElseGet(() -> product.getTranslations().stream()
                        .filter(t -> t.getStoreCode().equals(storeCode))
                        .findFirst()
                        .orElse(null));
    }

    private StoreProduct resolveStoreProduct(Product product, String storeCode) {
        return product.getStoreProducts().stream()
                .filter(sp -> sp.getStoreCode().equals(storeCode))
                .findFirst()
                .orElse(null);
    }

    private List<OptionDto> toOptionDtos(List<ProductOption> options, String productId) {
        return options.stream()
                .map(opt -> new OptionDto(
                        "opt-" + productId + "-" + opt.getOptionKey(),
                        opt.getName(),
                        parseJsonArray(opt.getValuesJson())
                ))
                .toList();
    }

    private VariantDto toVariantDto(ProductVariant variant, String storeCode,
                                     String locale, List<OptionDto> options) {
        VariantTranslation translation = variant.getTranslations().stream()
                .filter(t -> t.getStoreCode().equals(storeCode) && t.getLocale().equals(locale))
                .findFirst()
                .orElseGet(() -> variant.getTranslations().stream()
                        .filter(t -> t.getStoreCode().equals(storeCode))
                        .findFirst()
                        .orElse(null));

        String variantTitle = translation != null ? translation.getTitle() : variant.getId();

        List<SelectedOptionDto> selectedOptions = List.of();
        if (!options.isEmpty()) {
            OptionDto option = options.getFirst();
            selectedOptions = List.of(new SelectedOptionDto(option.name(), variantTitle));
        }

        return new VariantDto(variant.getId(), variantTitle, selectedOptions);
    }

    private List<String> parseJsonArray(String json) {
        try {
            return JSON.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
