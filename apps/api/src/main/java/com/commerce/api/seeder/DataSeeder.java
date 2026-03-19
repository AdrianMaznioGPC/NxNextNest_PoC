package com.commerce.api.seeder;

import com.commerce.api.product.entity.*;
import com.commerce.api.product.repository.ProductOptionRepository;
import com.commerce.api.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds the product database with data matching the existing mock data
 * from the BFF. Only runs if the product table is empty.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final ProductRepository productRepository;
    private final ProductOptionRepository optionRepository;

    public DataSeeder(ProductRepository productRepository,
                      ProductOptionRepository optionRepository) {
        this.productRepository = productRepository;
        this.optionRepository = optionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Database already seeded — skipping");
            return;
        }

        log.info("Seeding product data...");
        seedProducts();
        log.info("Seeded {} products", productRepository.count());
    }

    private void seedProducts() {
        seedProduct("p-1", "ceramic-brake-pads",
                img("1486262715619-67b85e0b08d3"),
                new LocalizedText(
                        "Plaquettes de frein en céramique",
                        "Plaquettes de frein céramique haute performance pour moins de poussière et de bruit. Compatible avec la plupart des berlines et SUV.",
                        "Essieu", "[\"Avant\",\"Arrière\"]"),
                new LocalizedText(
                        "Ceramic Brake Pads",
                        "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.",
                        "Axle", "[\"Front\",\"Rear\"]"),
                List.of(
                        new VariantDef("var-front-0", "Avant", "Front"),
                        new VariantDef("var-rear-1", "Arrière", "Rear")
                ));

        seedProduct("p-2", "drilled-rotors",
                img("1492144534655-ae79c964c9d7"),
                new LocalizedText(
                        "Disques de frein percés et rainurés",
                        "Disques de frein percés et rainurés pour une meilleure dissipation de la chaleur et une puissance de freinage accrue.",
                        "Taille", "[\"12 pouces\",\"13 pouces\"]"),
                new LocalizedText(
                        "Drilled & Slotted Rotors",
                        "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.",
                        "Size", "[\"12 in\",\"13 in\"]"),
                List.of(
                        new VariantDef("var-12-in-0", "12 pouces", "12 in"),
                        new VariantDef("var-13-in-1", "13 pouces", "13 in")
                ));

        seedProduct("p-3", "performance-air-filter",
                img("1489824904134-891ab64532f1"),
                new LocalizedText(
                        "Filtre à air performance",
                        "Filtre à air haute performance lavable et réutilisable. Augmente le débit d'air pour une meilleure réponse à l'accélérateur.",
                        "Montage", "[\"Universel\",\"Montage direct\"]"),
                new LocalizedText(
                        "Performance Air Filter",
                        "Washable and reusable high-flow air filter. Increases airflow for better throttle response.",
                        "Fitment", "[\"Universal\",\"Direct-Fit\"]"),
                List.of(
                        new VariantDef("var-universal-0", "Universel", "Universal"),
                        new VariantDef("var-direct-fit-1", "Montage direct", "Direct-Fit")
                ));

        seedProduct("p-4", "iridium-spark-plugs",
                img("1517524008697-84bbe3c3fd98"),
                new LocalizedText(
                        "Bougies d'allumage iridium (lot de 4)",
                        "Bougies d'allumage à pointe iridium longue durée pour un allumage fiable et une efficacité énergétique optimale.",
                        "Indice thermique", "[\"6\",\"7\",\"8\"]"),
                new LocalizedText(
                        "Iridium Spark Plugs (Set of 4)",
                        "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.",
                        "Heat Range", "[\"6\",\"7\",\"8\"]"),
                List.of(
                        new VariantDef("var-6-0", "6", "6"),
                        new VariantDef("var-7-1", "7", "7"),
                        new VariantDef("var-8-2", "8", "8")
                ));

        seedProduct("p-5", "coilover-kit",
                img("1494976388531-d1058494cdd8"),
                new LocalizedText(
                        "Kit combinés filetés réglables",
                        "Kit de suspension combinés filetés à hauteur réglable. Amortissement réglable 32 voies pour route et circuit.",
                        "Montage", "[\"Ensemble avant et arrière\"]"),
                new LocalizedText(
                        "Adjustable Coilover Kit",
                        "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.",
                        "Fitment", "[\"Front & Rear Set\"]"),
                List.of(
                        new VariantDef("var-front-&-rear-set-0", "Ensemble avant et arrière", "Front & Rear Set")
                ));

        seedProduct("p-6", "sway-bar-end-links",
                img("1504215680853-026ed2a45def"),
                new LocalizedText(
                        "Biellettes de barre stabilisatrice",
                        "Biellettes de barre stabilisatrice renforcées avec silentblocs en polyuréthane pour un meilleur maintien en virage.",
                        "Position", "[\"Avant\",\"Arrière\"]"),
                new LocalizedText(
                        "Sway Bar End Links",
                        "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.",
                        "Position", "[\"Front\",\"Rear\"]"),
                List.of(
                        new VariantDef("var-front-0", "Avant", "Front"),
                        new VariantDef("var-rear-1", "Arrière", "Rear")
                ));

        seedProduct("p-7", "led-headlight-bulbs",
                img("1605559424843-9e4c228bf1c2"),
                new LocalizedText(
                        "Ampoules LED phares (paire)",
                        "Ampoules LED 6000K blanc brillant pour phares. Remplacement plug-and-play avec ventilateur de refroidissement intégré.",
                        "Taille d'ampoule", "[\"H11\",\"9005\",\"9006\"]"),
                new LocalizedText(
                        "LED Headlight Bulbs (Pair)",
                        "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.",
                        "Bulb Size", "[\"H11\",\"9005\",\"9006\"]"),
                List.of(
                        new VariantDef("var-h11-0", "H11", "H11"),
                        new VariantDef("var-9005-1", "9005", "9005"),
                        new VariantDef("var-9006-2", "9006", "9006")
                ));

        seedProduct("p-8", "smoked-tail-lights",
                img("1609521263047-f8f205293f24"),
                new LocalizedText(
                        "Caches feux arrière fumés",
                        "Caches feux arrière fumés résistants aux UV pour un look personnalisé et élégant.",
                        "Montage", "[\"Universel\"]"),
                new LocalizedText(
                        "Smoked Tail Light Covers",
                        "UV-resistant smoked tail light covers for a sleek custom appearance.",
                        "Fitment", "[\"Universal\"]"),
                List.of(
                        new VariantDef("var-universal-0", "Universel", "Universal")
                ));

        seedProduct("p-9", "cat-back-exhaust",
                img("1552519507-da3b142c6e3d"),
                new LocalizedText(
                        "Ligne d'échappement cat-back",
                        "Ligne d'échappement cat-back en acier inoxydable avec doubles sorties polies. Ajoute de la puissance et un son sportif.",
                        "Style de sortie", "[\"Poli\",\"Titane brûlé\"]"),
                new LocalizedText(
                        "Cat-Back Exhaust System",
                        "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.",
                        "Tip Style", "[\"Polished\",\"Burnt Titanium\"]"),
                List.of(
                        new VariantDef("var-polished-0", "Poli", "Polished"),
                        new VariantDef("var-burnt-titanium-1", "Titane brûlé", "Burnt Titanium")
                ));

        seedProduct("p-10", "exhaust-tip-clamp-on",
                img("1549399542-7e3f8b79c341"),
                new LocalizedText(
                        "Embout d'échappement à collier",
                        "Embout d'échappement universel en acier inoxydable à collier. Compatible avec les tubes de 63 à 76 mm.",
                        "Finition", "[\"Chrome\",\"Noir\"]"),
                new LocalizedText(
                        "Clamp-On Exhaust Tip",
                        "Universal stainless steel clamp-on exhaust tip. Fits 2.5\" to 3\" pipes.",
                        "Finish", "[\"Chrome\",\"Black\"]"),
                List.of(
                        new VariantDef("var-chrome-0", "Chrome", "Chrome"),
                        new VariantDef("var-black-1", "Noir", "Black")
                ));

        seedProduct("p-11", "short-ram-intake",
                img("1606577924006-27d39b132ae2"),
                new LocalizedText(
                        "Kit d'admission courte",
                        "Admission courte en aluminium poli avec filtre conique haute performance. Installation facile par boulonnage.",
                        "Diamètre du tube", "[\"63 mm\",\"76 mm\"]"),
                new LocalizedText(
                        "Short Ram Intake Kit",
                        "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.",
                        "Pipe Diameter", "[\"2.5 in\",\"3 in\"]"),
                List.of(
                        new VariantDef("var-2.5-in-0", "63 mm", "2.5 in"),
                        new VariantDef("var-3-in-1", "76 mm", "3 in")
                ));

        seedProduct("p-12", "wheel-spacers",
                img("1562911791-c7a97b729ec5"),
                new LocalizedText(
                        "Élargisseurs de voie (paire)",
                        "Élargisseurs de voie hubcentriques pour un look agressif. Construction en aluminium T6 billet.",
                        "Épaisseur", "[\"15mm\",\"20mm\",\"25mm\"]"),
                new LocalizedText(
                        "Wheel Spacers (Pair)",
                        "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.",
                        "Thickness", "[\"15mm\",\"20mm\",\"25mm\"]"),
                List.of(
                        new VariantDef("var-15mm-0", "15mm", "15mm"),
                        new VariantDef("var-20mm-1", "20mm", "20mm"),
                        new VariantDef("var-25mm-2", "25mm", "25mm")
                ));

        seedProduct("p-13", "tyre-pressure-sensor",
                img("1558618666-fcd25c85f68e"),
                new LocalizedText(
                        "Capteur de pression pneu (TPMS)",
                        "Capteur de pression de pneu de remplacement compatible OEM. Programmation facile et longue durée de vie de la batterie.",
                        "Type de valve", "[\"Snap-In\",\"Clamp-In\"]"),
                new LocalizedText(
                        "Tyre Pressure Sensor (TPMS)",
                        "OEM-compatible replacement tyre pressure sensor. Easy programming and long battery life.",
                        "Valve Type", "[\"Snap-In\",\"Clamp-In\"]"),
                List.of(
                        new VariantDef("var-snap-in-0", "Snap-In", "Snap-In"),
                        new VariantDef("var-clamp-in-1", "Clamp-In", "Clamp-In")
                ));

        // ── Both stores: additional shared products ──────────────────────────

        seedProduct("p-14", "brake-caliper-kit",
                img("1530046916-0457db354cde"),
                new LocalizedText("Kit étrier de frein", "Étrier de frein reconditionné avec supports et goupilles. Compatible avec la plupart des véhicules européens.", "Côté", "[\"Gauche\",\"Droit\"]"),
                new LocalizedText("Brake Caliper Kit", "Remanufactured brake caliper with brackets and pins. Fits most European vehicles.", "Side", "[\"Left\",\"Right\"]"),
                List.of(new VariantDef("var-left-0", "Gauche", "Left"), new VariantDef("var-right-1", "Droit", "Right")));

        seedProduct("p-15", "dot4-brake-fluid",
                img("1635073943212-bf3d1c00b7e0"),
                new LocalizedText("Liquide de frein DOT 4", "Liquide de frein synthétique DOT 4 haute performance. Point d'ébullition élevé pour une utilisation intensive.", "Contenance", "[\"500 ml\",\"1 L\"]"),
                new LocalizedText("DOT 4 Brake Fluid", "High-performance synthetic DOT 4 brake fluid. High boiling point for demanding use.", "Volume", "[\"500ml\",\"1L\"]"),
                List.of(new VariantDef("var-500ml-0", "500 ml", "500ml"), new VariantDef("var-1l-1", "1 L", "1L")));

        seedProduct("p-16", "oil-filter",
                img("1619642751034-765dfdf7c58e"),
                new LocalizedText("Filtre à huile", "Filtre à huile de remplacement OEM. Filtration haute efficacité pour protéger votre moteur.", "Type", "[\"Standard\",\"Longue durée\"]"),
                new LocalizedText("Oil Filter", "OEM-replacement oil filter. High-efficiency filtration to protect your engine.", "Type", "[\"Standard\",\"Long-Life\"]"),
                List.of(new VariantDef("var-standard-0", "Standard", "Standard"), new VariantDef("var-long-life-1", "Longue durée", "Long-Life")));

        seedProduct("p-17", "timing-belt-kit",
                img("1606577924006-27d39b132ae2"),
                new LocalizedText("Kit courroie de distribution", "Kit complet courroie de distribution avec tendeur et galets. Remplacement préventif recommandé.", "Motorisation", "[\"1.6L\",\"2.0L\"]"),
                new LocalizedText("Timing Belt Kit", "Complete timing belt kit with tensioner and idler pulleys. Preventive replacement recommended.", "Engine", "[\"1.6L\",\"2.0L\"]"),
                List.of(new VariantDef("var-1.6l-0", "1.6L", "1.6L"), new VariantDef("var-2.0l-1", "2.0L", "2.0L")));

        seedProduct("p-18", "shock-absorber",
                img("1494976388531-d1058494cdd8"),
                new LocalizedText("Amortisseur", "Amortisseur à gaz monotube pour un contrôle optimal et un confort de conduite amélioré.", "Position", "[\"Avant\",\"Arrière\"]"),
                new LocalizedText("Shock Absorber", "Gas-charged monotube shock absorber for optimal control and improved ride comfort.", "Position", "[\"Front\",\"Rear\"]"),
                List.of(new VariantDef("var-front-0", "Avant", "Front"), new VariantDef("var-rear-1", "Arrière", "Rear")));

        seedProduct("p-19", "fog-light-kit",
                img("1605559424843-9e4c228bf1c2"),
                new LocalizedText("Kit antibrouillards LED", "Antibrouillards LED universels avec faisceaux de câblage et interrupteur. Installation facile.", "Couleur", "[\"Blanc\",\"Jaune\"]"),
                new LocalizedText("LED Fog Light Kit", "Universal LED fog lights with wiring harness and switch. Easy installation.", "Colour", "[\"White\",\"Yellow\"]"),
                List.of(new VariantDef("var-white-0", "Blanc", "White"), new VariantDef("var-yellow-1", "Jaune", "Yellow")));

        seedProduct("p-20", "stainless-headers",
                img("1552519507-da3b142c6e3d"),
                new LocalizedText("Collecteur d'échappement inox", "Collecteur d'échappement 4-en-1 en acier inoxydable. Améliore le flux des gaz et la puissance.", "Cylindres", "[\"4 cyl.\",\"6 cyl.\"]"),
                new LocalizedText("Stainless Steel Headers", "4-into-1 stainless steel exhaust headers. Improves gas flow and horsepower.", "Cylinders", "[\"4-cyl\",\"6-cyl\"]"),
                List.of(new VariantDef("var-4cyl-0", "4 cyl.", "4-cyl"), new VariantDef("var-6cyl-1", "6 cyl.", "6-cyl")));

        seedProduct("p-21", "lug-nut-set",
                img("1562911791-c7a97b729ec5"),
                new LocalizedText("Jeu d'écrous de roue (20 pcs)", "Écrous de roue en acier forgé avec siège conique. Finition anticorrosion.", "Taille", "[\"M12x1.25\",\"M12x1.5\"]"),
                new LocalizedText("Lug Nut Set (20 pcs)", "Forged steel lug nuts with conical seat. Anti-corrosion finish.", "Size", "[\"M12x1.25\",\"M12x1.5\"]"),
                List.of(new VariantDef("var-m12x1.25-0", "M12x1.25", "M12x1.25"), new VariantDef("var-m12x1.5-1", "M12x1.5", "M12x1.5")));

        // ── FR-only products ────────────────────────────────────────────────

        seedFrOnly("p-50", "kit-embrayage-renault",
                img("1619642751034-765dfdf7c58e"),
                new LocalizedText("Kit embrayage Renault", "Kit embrayage complet pour Renault Clio, Mégane et Scénic. Inclut disque, mécanisme et butée.", "Modèle", "[\"Clio\",\"Mégane\",\"Scénic\"]"),
                List.of(new VariantDef("var-clio-0", "Clio", "Clio"), new VariantDef("var-megane-1", "Mégane", "Mégane"), new VariantDef("var-scenic-2", "Scénic", "Scénic")));

        seedFrOnly("p-51", "durite-turbo-peugeot",
                img("1489824904134-891ab64532f1"),
                new LocalizedText("Durite turbo Peugeot", "Durite de turbo en silicone renforcé pour Peugeot 308 et 3008. Résistante à la chaleur et à la pression.", "Modèle", "[\"308\",\"3008\"]"),
                List.of(new VariantDef("var-308-0", "308", "308"), new VariantDef("var-3008-1", "3008", "3008")));

        seedFrOnly("p-52", "kit-joints-citroen",
                img("1635073943212-bf3d1c00b7e0"),
                new LocalizedText("Kit joints moteur Citroën", "Pochette de joints moteur complète pour Citroën C3 et C4. Joints de culasse, carter et collecteur.", "Modèle", "[\"C3\",\"C4\"]"),
                List.of(new VariantDef("var-c3-0", "C3", "C3"), new VariantDef("var-c4-1", "C4", "C4")));

        // ── IE-only products ────────────────────────────────────────────────

        seedIeOnly("p-60", "rhd-headlight-conversion",
                img("1605559424843-9e4c228bf1c2"),
                new LocalizedText("RHD Headlight Conversion Kit", "Right-hand drive headlight beam deflectors for UK and Irish roads. MOT/NCT compliant.", "Type", "[\"Sedan\",\"SUV\"]"),
                List.of(new VariantDef("var-sedan-0", "Sedan", "Sedan"), new VariantDef("var-suv-1", "SUV", "SUV")));

        seedIeOnly("p-61", "rain-guard-set",
                img("1609521263047-f8f205293f24"),
                new LocalizedText("Window Rain Guard Set", "In-channel wind and rain deflectors for front and rear windows. Allows fresh air in wet weather.", "Doors", "[\"4-door\",\"5-door\"]"),
                List.of(new VariantDef("var-4door-0", "4-door", "4-door"), new VariantDef("var-5door-1", "5-door", "5-door")));

        seedIeOnly("p-62", "number-plate-light-led",
                img("1530046916-0457db354cde"),
                new LocalizedText("LED Number Plate Light", "UK/IE spec LED number plate light. Direct OEM replacement, plug-and-play. NCT and MOT approved.", "Fitment", "[\"Universal\",\"Direct-Fit\"]"),
                List.of(new VariantDef("var-universal-0", "Universal", "Universal"), new VariantDef("var-direct-fit-1", "Direct-Fit", "Direct-Fit")));
    }

    /** Seed a product available in both stores. */
    private void seedProduct(String id, String handle, String imageUrl,
                              LocalizedText fr, LocalizedText en,
                              List<VariantDef> variants) {
        seedProduct(id, handle, imageUrl, fr, en, variants, true, true);
    }

    /** Seed a product for FR store only. */
    private void seedFrOnly(String id, String handle, String imageUrl,
                             LocalizedText fr, List<VariantDef> variants) {
        seedProduct(id, handle, imageUrl, fr, null, variants, true, false);
    }

    /** Seed a product for IE store only. */
    private void seedIeOnly(String id, String handle, String imageUrl,
                             LocalizedText en, List<VariantDef> variants) {
        seedProduct(id, handle, imageUrl, null, en, variants, false, true);
    }

    private void seedProduct(String id, String handle, String imageUrl,
                              LocalizedText fr, LocalizedText en,
                              List<VariantDef> variants,
                              boolean inFr, boolean inIe) {
        Product product = new Product(id, handle);

        if (inFr && fr != null) {
            product.addStoreProduct(new StoreProduct("fr", imageUrl, fr.title(), ""));
            product.addTranslation(new ProductTranslation(
                    "fr", "fr-FR", fr.title(), fr.description(),
                    "<p>" + fr.description() + "</p>", fr.title(), fr.description()));
        }
        if (inIe && en != null) {
            product.addStoreProduct(new StoreProduct("ie", imageUrl, en.title(), ""));
            product.addTranslation(new ProductTranslation(
                    "ie", "en-IE", en.title(), en.description(),
                    "<p>" + en.description() + "</p>", en.title(), en.description()));
        }

        for (int i = 0; i < variants.size(); i++) {
            VariantDef def = variants.get(i);
            String variantId = id + "-" + def.id();
            ProductVariant variant = new ProductVariant(variantId, i);
            if (inFr) variant.addTranslation(new VariantTranslation("fr", "fr-FR", def.frLabel()));
            if (inIe) variant.addTranslation(new VariantTranslation("ie", "en-IE", def.enLabel()));
            product.addVariant(variant);
        }

        productRepository.save(product);

        if (inFr && fr != null) {
            ProductOption frOpt = new ProductOption("opt-1", "fr", "fr-FR", fr.optionName(), fr.optionValues());
            frOpt.setProduct(product);
            optionRepository.save(frOpt);
        }
        if (inIe && en != null) {
            ProductOption enOpt = new ProductOption("opt-1", "ie", "en-IE", en.optionName(), en.optionValues());
            enOpt.setProduct(product);
            optionRepository.save(enOpt);
        }
    }

    private static String img(String id) {
        return "https://images.unsplash.com/photo-" + id + "?w=800&h=800&fit=crop&q=80";
    }

    private record LocalizedText(String title, String description,
                                  String optionName, String optionValues) {
    }

    private record VariantDef(String id, String frLabel, String enLabel) {
    }
}
