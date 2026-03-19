package com.commerce.api.product.repository;

import com.commerce.api.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {

    /**
     * Find a product by handle, but only if it belongs to the given store.
     */
    @Query("""
            SELECT p FROM Product p
            JOIN p.storeProducts sp
            WHERE p.handle = :handle AND sp.storeCode = :storeCode
            """)
    Optional<Product> findByHandleAndStore(@Param("handle") String handle,
                                           @Param("storeCode") String storeCode);

    /**
     * Find a product by ID, but only if it belongs to the given store.
     */
    @Query("""
            SELECT p FROM Product p
            JOIN p.storeProducts sp
            WHERE p.id = :id AND sp.storeCode = :storeCode
            """)
    Optional<Product> findByIdAndStore(@Param("id") String id,
                                       @Param("storeCode") String storeCode);

    /**
     * Find multiple products by IDs within a store.
     */
    @Query("""
            SELECT p FROM Product p
            JOIN p.storeProducts sp
            WHERE p.id IN :ids AND sp.storeCode = :storeCode
            """)
    List<Product> findByIdsAndStore(@Param("ids") List<String> ids,
                                    @Param("storeCode") String storeCode);

    /**
     * Find all products in a store.
     */
    @Query("""
            SELECT DISTINCT p FROM Product p
            JOIN p.storeProducts sp
            JOIN p.translations t
            WHERE sp.storeCode = :storeCode
              AND t.storeCode = :storeCode
              AND t.locale = :locale
            """)
    List<Product> findAllByStore(@Param("storeCode") String storeCode,
                                 @Param("locale") String locale);

    /**
     * Search products in a store by title or description.
     */
    @Query("""
            SELECT DISTINCT p FROM Product p
            JOIN p.storeProducts sp
            JOIN p.translations t
            WHERE sp.storeCode = :storeCode
              AND t.storeCode = :storeCode
              AND t.locale = :locale
              AND (LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
            """)
    List<Product> searchByStore(@Param("storeCode") String storeCode,
                                @Param("locale") String locale,
                                @Param("query") String query);
}
