# Commerce Monorepo — Architecture

## High-Level Overview

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
    end

    subgraph Proxy["Reverse Proxy"]
        Caddy["Caddy<br/><small>Domain-based routing</small><br/><small>*.localhost → :3000</small>"]
    end

    subgraph Apps["Applications"]
        subgraph SF["Storefront <small>(Next.js 15 / React 19)</small>"]
            Middleware["Middleware<br/><small>Resolves store from hostname</small>"]
            Pages["App Router Pages<br/><small>/, /product, /categories,<br/>/search, /checkout</small>"]
            Components["Components<br/><small>Cart, CMS, Layout, Product</small>"]
            LibAPI["lib/api<br/><small>BFF fetch client</small>"]
            I18n["next-intl<br/><small>en, fr</small>"]
        end

        subgraph BFF["BFF <small>(NestJS / Fastify)</small>"]
            direction TB
            Controllers["Controllers<br/><small>Cart, Checkout, PageData,<br/>AddressBook</small>"]
            DomainServices["Domain Services<br/><small>Product, Catalog, Content,<br/>Navigation</small>"]
            Ports["Ports <small>(interfaces)</small><br/><small>Product, Cart, Checkout, CMS,<br/>Collection, Customer, Menu,<br/>Pricing, Availability, Search,<br/>Navigation, Page, Order</small>"]
            StoreCtx["Store Context<br/><small>x-store-code middleware</small>"]
            SystemMod["System Module<br/><small>Resilience, Caching,<br/>Load Shedding, Metrics</small>"]

            subgraph Adapters["Adapters <small>(swappable backends)</small>"]
                MockAdapter["Mock Adapter<br/><small>In-memory data</small>"]
                SpringAdapter["Spring Adapter<br/><small>HTTP → API</small>"]
                ChaosAdapter["Chaos Adapter<br/><small>Fault injection testing</small>"]
            end
        end

        subgraph API["API <small>(Spring Boot 3 / Java 21)</small>"]
            APIControllers["Controllers<br/><small>Product, Hello</small>"]
            APIServices["Services<br/><small>ProductService</small>"]
            APIEntities["Entities<br/><small>Product, ProductVariant,<br/>ProductOption, ProductTranslation,<br/>StoreProduct</small>"]
            APIConfig["Config<br/><small>StoreContext filter</small>"]
        end
    end

    subgraph Libs["Shared Libraries"]
        SharedTypes["@commerce/shared-types<br/><small>Cart, Product, Collection, CMS,<br/>Checkout, Order, Page types</small>"]
        StoreConfig["@commerce/store-config<br/><small>Store definitions,<br/>domain → store resolution</small>"]
        UI["@commerce/ui<br/><small>40+ UI components<br/>(Tailwind CSS 4)</small>"]
    end

    subgraph Data["Data Layer"]
        Postgres[("PostgreSQL<br/><small>:5432/commerce</small>")]
    end

    subgraph Testing["Load & Chaos Testing"]
        K6["k6 Scenarios<br/><small>Baseline, Timeout, Circuit Breaker,<br/>Concurrency, Load Shedding,<br/>Fallback, Retry, Recovery</small>"]
    end

    Browser -->|"HTTPS"| Caddy
    Caddy -->|":3000"| Middleware
    Middleware --> Pages
    Pages --> Components
    Pages --> LibAPI
    Components --> UI
    Components --> I18n
    LibAPI -->|"HTTP :4000"| Controllers
    Controllers --> DomainServices
    Controllers --> StoreCtx
    DomainServices --> Ports
    Ports -.->|"implements"| MockAdapter
    Ports -.->|"implements"| SpringAdapter
    Ports -.->|"implements"| ChaosAdapter
    SystemMod --> Controllers
    SpringAdapter -->|"HTTP :5000"| APIControllers
    APIControllers --> APIServices
    APIServices --> APIEntities
    APIEntities -->|"JPA"| Postgres
    APIConfig --> APIControllers

    SF -->|"imports"| SharedTypes
    SF -->|"imports"| StoreConfig
    SF -->|"imports"| UI
    BFF -->|"imports"| SharedTypes
    BFF -->|"imports"| StoreConfig

    K6 -->|"load tests"| BFF

    classDef app fill:#4f46e5,stroke:#3730a3,color:#fff
    classDef lib fill:#0d9488,stroke:#0f766e,color:#fff
    classDef data fill:#d97706,stroke:#b45309,color:#fff
    classDef test fill:#7c3aed,stroke:#6d28d9,color:#fff
    classDef proxy fill:#64748b,stroke:#475569,color:#fff

    class SF,BFF,API app
    class SharedTypes,StoreConfig,UI lib
    class Postgres data
    class K6 test
    class Caddy proxy
```

## Request Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant C as Caddy
    participant S as Storefront<br/>(Next.js :3000)
    participant BFF as BFF<br/>(NestJS :4000)
    participant API as API<br/>(Spring :5000)
    participant DB as PostgreSQL

    B->>C: GET winparts.fr.localhost/product/brake-pads
    C->>S: Proxy → localhost:3000
    Note over S: Middleware resolves<br/>hostname → store "fr"
    S->>S: Set x-store-code: fr
    S->>BFF: GET /page-data/product/brake-pads<br/>x-store-code: fr
    Note over BFF: Store context middleware<br/>extracts store code
    BFF->>BFF: ProductDomainService<br/>enriches with pricing<br/>& availability
    alt Spring Backend
        BFF->>API: GET /products/brake-pads<br/>x-store-code: fr
        API->>DB: JPA query
        DB-->>API: Product + translations
        API-->>BFF: ProductResponse
    else Mock Backend
        BFF->>BFF: Return mock data
    end
    BFF-->>S: ProductPageData JSON
    S-->>B: Rendered HTML (RSC)
```

## Monorepo Structure

```mermaid
graph LR
    subgraph NX["Nx Workspace"]
        direction TB
        subgraph applications["apps/"]
            A1["storefront<br/><small>Next.js 15 · React 19<br/>Tailwind CSS 4 · next-intl</small>"]
            A2["bff<br/><small>NestJS 11 · Fastify<br/>Hexagonal Architecture</small>"]
            A3["api<br/><small>Spring Boot 3.4<br/>Java 21 · JPA · Gradle</small>"]
        end
        subgraph libraries["libs/"]
            L1["shared-types<br/><small>Domain type definitions</small>"]
            L2["store-config<br/><small>Multi-store configuration</small>"]
            L3["ui<br/><small>Design system components</small>"]
        end
    end

    A1 --> L1
    A1 --> L2
    A1 --> L3
    A2 --> L1
    A2 --> L2

    style NX fill:#f8fafc,stroke:#cbd5e1
    style applications fill:#eef2ff,stroke:#a5b4fc
    style libraries fill:#ecfdf5,stroke:#6ee7b7
```

## BFF Hexagonal Architecture

```mermaid
graph TB
    subgraph Inbound["Inbound (Driving)"]
        HTTP["HTTP Controllers"]
    end

    subgraph Core["Domain Core"]
        DS["Domain Services<br/><small>Product · Catalog · Content · Navigation</small>"]
        P["Ports <small>(interfaces)</small><br/><small>13 port contracts</small>"]
    end

    subgraph Outbound["Outbound (Driven) — Adapters"]
        Mock["Mock<br/><small>In-memory</small>"]
        Spring["Spring<br/><small>HTTP client</small>"]
        Chaos["Chaos<br/><small>Fault injection</small>"]
    end

    HTTP --> DS
    DS --> P
    P -.-> Mock
    P -.-> Spring
    P -.-> Chaos

    style Core fill:#fef3c7,stroke:#f59e0b
    style Inbound fill:#dbeafe,stroke:#3b82f6
    style Outbound fill:#fce7f3,stroke:#ec4899
```

## Multi-Store Resolution

```mermaid
flowchart LR
    A["winparts.fr.localhost"] -->|Caddy| B["Storefront :3000"]
    C["winparts.ie.localhost"] -->|Caddy| B
    B -->|"Middleware"| D{"Resolve store<br/>from hostname"}
    D -->|"fr"| E["x-store-code: fr<br/>locale: fr-FR<br/>currency: EUR"]
    D -->|"ie"| F["x-store-code: ie<br/>locale: en-IE<br/>currency: EUR"]
    E --> G["BFF → locale-aware<br/>data & translations"]
    F --> G
```

## Tech Stack Summary

| Layer | Technology | Port |
|-------|-----------|------|
| Reverse Proxy | Caddy | 80/443 |
| Storefront | Next.js 15, React 19, Tailwind CSS 4, next-intl | 3000 |
| BFF | NestJS 11, Fastify | 4000 |
| API | Spring Boot 3.4, Java 21, JPA | 5000 |
| Database | PostgreSQL | 5432 |
| Build System | Nx, Gradle (API) | — |
| Load Testing | k6 | — |
