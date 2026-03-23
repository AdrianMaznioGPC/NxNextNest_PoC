import { Injectable } from "@nestjs/common";
import type {
  ContentSupplementPort,
  FaqItem,
  ReviewItem,
} from "../../ports/content-supplement.port";

@Injectable()
export class MockContentSupplementAdapter implements ContentSupplementPort {
  getReviews(productHandle: string, locale: string): ReviewItem[] {
    const isSpanish = locale.startsWith("es");
    return [
      {
        id: `${productHandle}-review-1`,
        author: isSpanish ? "Carlos M." : "Alex R.",
        rating: 5,
        title: isSpanish ? "Gran calidad" : "Excellent quality",
        body: isSpanish
          ? "La instalación fue simple y la mejora se notó al instante."
          : "Install was straightforward and performance improved immediately.",
      },
      {
        id: `${productHandle}-review-2`,
        author: isSpanish ? "Lucia T." : "Jordan K.",
        rating: 4,
        title: isSpanish ? "Muy recomendable" : "Highly recommended",
        body: isSpanish
          ? "Buena relación precio/calidad, volvería a comprar."
          : "Great value for money, would buy again.",
      },
    ];
  }

  getFaq(locale: string): FaqItem[] {
    const isSpanish = locale.startsWith("es");
    return isSpanish
      ? [
          {
            q: "¿Incluye instrucciones de instalación?",
            a: "Sí. Incluye guía rápida y especificaciones de montaje.",
          },
          {
            q: "¿Cuál es el tiempo de envío?",
            a: "Generalmente entre 3 y 5 días hábiles.",
          },
        ]
      : [
          {
            q: "Does it include installation instructions?",
            a: "Yes. A quick-start guide and fitment notes are included.",
          },
          {
            q: "What is the shipping timeline?",
            a: "Most orders arrive in 3-5 business days.",
          },
        ];
  }
}
