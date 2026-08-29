"use client";

import { useState } from "react";
import type { Product } from "../data";

type Props = {
  product: Product;
  showCredit?: boolean;
};

export function ProductMedia({ product, showCredit = true }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const useImage = Boolean(product.image && !imageFailed);
  const useLogo = !useImage && Boolean(product.logo && !logoFailed);
  const credit = useImage
    ? { label: product.imageCredit, url: product.imageSource }
    : useLogo
      ? { label: product.logoCredit, url: product.logoSource }
      : null;

  return (
    <>
      {useImage ? (
        <img
          src={product.image}
          alt={`${product.name}产品图片`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : useLogo ? (
        <div className="logo-fallback">
          <img
            src={product.logo}
            alt={`${product.company}标识`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setLogoFailed(true)}
          />
          <small>暂无合适的官方产品图，使用机构标识</small>
        </div>
      ) : (
        <div className="product-placeholder"><span>{product.name.slice(0, 2)}</span></div>
      )}
      {showCredit && credit?.label && credit.url && (
        <a className="media-credit" href={credit.url} target="_blank" rel="noreferrer">
          图片来源：{credit.label} ↗
        </a>
      )}
    </>
  );
}
