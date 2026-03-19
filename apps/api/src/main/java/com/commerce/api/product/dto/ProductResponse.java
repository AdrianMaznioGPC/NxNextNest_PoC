package com.commerce.api.product.dto;

import java.util.List;

/**
 * Response DTO matching the BaseProduct TypeScript type in shared-types.
 * This is the contract between the Spring API and the BFF.
 */
public record ProductResponse(
        String id,
        String handle,
        String title,
        String description,
        String descriptionHtml,
        List<OptionDto> options,
        List<VariantDto> variants,
        ImageDto featuredImage,
        List<ImageDto> images,
        SeoDto seo,
        List<String> tags,
        String updatedAt
) {

    public record OptionDto(
            String id,
            String name,
            List<String> values
    ) {
    }

    public record VariantDto(
            String id,
            String title,
            List<SelectedOptionDto> selectedOptions
    ) {
    }

    public record SelectedOptionDto(
            String name,
            String value
    ) {
    }

    public record ImageDto(
            String url,
            String altText,
            int width,
            int height
    ) {
    }

    public record SeoDto(
            String title,
            String description
    ) {
    }
}
