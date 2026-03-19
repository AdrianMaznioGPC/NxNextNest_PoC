package com.commerce.api.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Extracts X-Store-Code and X-Locale headers from each request
 * and places them in a thread-local {@link StoreContextHolder}.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class StoreContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String storeCode = request.getHeader("X-Store-Code");
        String locale = request.getHeader("X-Locale");

        if (storeCode == null || storeCode.isBlank()) {
            storeCode = StoreContext.DEFAULT_STORE_CODE;
        }
        if (locale == null || locale.isBlank()) {
            locale = StoreContext.DEFAULT_LOCALE;
        }

        StoreContextHolder.set(new StoreContext(storeCode, locale));
        try {
            filterChain.doFilter(request, response);
        } finally {
            StoreContextHolder.clear();
        }
    }
}
