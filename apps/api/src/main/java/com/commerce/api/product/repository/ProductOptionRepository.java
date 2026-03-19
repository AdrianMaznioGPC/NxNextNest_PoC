package com.commerce.api.product.repository;

import com.commerce.api.product.entity.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {

    @Query("""
            SELECT o FROM ProductOption o
            WHERE o.product.id = :productId
              AND o.storeCode = :storeCode
              AND o.locale = :locale
            """)
    List<ProductOption> findByProductAndStoreAndLocale(
            @Param("productId") String productId,
            @Param("storeCode") String storeCode,
            @Param("locale") String locale);

    @Query("""
            SELECT o FROM ProductOption o
            WHERE o.product.id IN :productIds
              AND o.storeCode = :storeCode
              AND o.locale = :locale
            """)
    List<ProductOption> findByProductIdsAndStoreAndLocale(
            @Param("productIds") List<String> productIds,
            @Param("storeCode") String storeCode,
            @Param("locale") String locale);
}
