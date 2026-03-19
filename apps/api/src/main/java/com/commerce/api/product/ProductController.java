package com.commerce.api.product;

import com.commerce.api.config.StoreContext;
import com.commerce.api.config.StoreContextHolder;
import com.commerce.api.product.dto.ProductResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /products?ids=p-1,p-2,p-3  → batch fetch by IDs
     * GET /products?query=brake       → search by text
     * GET /products                   → all products in store
     */
    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) String ids,
            @RequestParam(required = false) String query) {

        StoreContext ctx = StoreContextHolder.get();

        if (ids != null && !ids.isBlank()) {
            List<String> idList = Arrays.asList(ids.split(","));
            return productService.getProductsByIds(idList, ctx);
        }

        return productService.searchProducts(query, ctx);
    }

    /**
     * GET /products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        StoreContext ctx = StoreContextHolder.get();
        return productService.getProductById(id, ctx)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /products/by-handle/{handle}
     */
    @GetMapping("/by-handle/{handle}")
    public ResponseEntity<ProductResponse> getProductByHandle(@PathVariable String handle) {
        StoreContext ctx = StoreContextHolder.get();
        return productService.getProductByHandle(handle, ctx)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /products/{id}/recommendations
     */
    @GetMapping("/{id}/recommendations")
    public List<ProductResponse> getRecommendations(@PathVariable String id) {
        StoreContext ctx = StoreContextHolder.get();
        return productService.getRecommendations(id, ctx);
    }
}
