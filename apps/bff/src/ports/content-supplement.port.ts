export type ReviewItem = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export interface ContentSupplementPort {
  getReviews(productHandle: string, locale: string): Promise<ReviewItem[]>;
  getFaq(locale: string): Promise<FaqItem[]>;
}

export const CONTENT_SUPPLEMENT_PORT = Symbol("CONTENT_SUPPLEMENT_PORT");
