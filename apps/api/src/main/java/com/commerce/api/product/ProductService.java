package com.commerce.api.product;

import com.commerce.api.config.StoreContext;
import com.commerce.api.product.dto.ProductResponse;
import com.commerce.api.product.entity.Product;
import com.commerce.api.product.entity.ProductOption;
import com.commerce.api.product.repository.ProductOptionRepository;
import com.commerce.api.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductOptionRepository optionRepository;
    private final ProductMapper mapper;

    public ProductService(ProductRepository productRepository,
                          ProductOptionRepository optionRepository,
                          ProductMapper mapper) {
        this.productRepository = productRepository;
        this.optionRepository = optionRepository;
        this.mapper = mapper;
    }

    public Optional<ProductResponse> getProductById(String id, StoreContext ctx) {
        return productRepository.findByIdAndStore(id, ctx.storeCode())
                .map(product -> mapWithOptions(product, ctx));
    }

    public Optional<ProductResponse> getProductByHandle(String handle, StoreContext ctx) {
        return productRepository.findByHandleAndStore(handle, ctx.storeCode())
                .map(product -> mapWithOptions(product, ctx));
    }

    public List<ProductResponse> getProductsByIds(List<String> ids, StoreContext ctx) {
        List<Product> products = productRepository.findByIdsAndStore(ids, ctx.storeCode());
        return mapBatchWithOptions(products, ctx);
    }

    public List<ProductResponse> searchProducts(String query, StoreContext ctx) {
        List<Product> products = (query != null && !query.isBlank())
                ? productRepository.searchByStore(ctx.storeCode(), ctx.locale(), query)
                : productRepository.findAllByStore(ctx.storeCode(), ctx.locale());
        return mapBatchWithOptions(products, ctx);
    }

    public List<ProductResponse> getRecommendations(String productId, StoreContext ctx) {
        // Return up to 4 other products from the same store
        List<Product> all = productRepository.findAllByStore(ctx.storeCode(), ctx.locale());
        List<Product> recommendations = all.stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(4)
                .toList();
        return mapBatchWithOptions(recommendations, ctx);
    }

    // -- Private helpers --

    private ProductResponse mapWithOptions(Product product, StoreContext ctx) {
        List<ProductOption> options = optionRepository.findByProductAndStoreAndLocale(
                product.getId(), ctx.storeCode(), ctx.locale());
        return mapper.toResponse(product, options, ctx.storeCode(), ctx.locale());
    }

    private List<ProductResponse> mapBatchWithOptions(List<Product> products, StoreContext ctx) {
        if (products.isEmpty()) return List.of();

        List<String> productIds = products.stream().map(Product::getId).toList();
        List<ProductOption> allOptions = optionRepository.findByProductIdsAndStoreAndLocale(
                productIds, ctx.storeCode(), ctx.locale());

        Map<String, List<ProductOption>> optionsByProduct = allOptions.stream()
                .collect(Collectors.groupingBy(o -> o.getProduct().getId()));

        return products.stream()
                .map(p -> mapper.toResponse(
                        p,
                        optionsByProduct.getOrDefault(p.getId(), List.of()),
                        ctx.storeCode(),
                        ctx.locale()))
                .toList();
    }
}
