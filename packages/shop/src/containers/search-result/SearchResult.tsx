import React from 'react';
import 'styled-components/macro';
import { useTranslation } from 'react-i18next';

import { ErrorDisplay } from '@rmp-demo-store/ui/error-display';

import useSearch from '../../hooks/use-search';
import SingleProduct from '../../components/product/single';
import { ProductDisplayItem } from '../../components/product/types';
import { useRouter } from 'next/router';
import Button from '@rmp-demo-store/ui/button';

type Props = {
  searchWord: string;
};

export const SearchResult: React.FC<Props> = (props) => {
  const { searchWord } = props;

  const router = useRouter();
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useSearch(searchWord);
  const { t } = useTranslation('common');

  if (isError) {
    return (
      <ErrorDisplay size="sm">
        <ErrorDisplay.Title>{t('error.title')}</ErrorDisplay.Title>
      </ErrorDisplay>
    );
  }

  if (isLoading) {
    return <SingleProduct isLoading />;
  }

  // empty
  if (data?.pages.length === 1 && data?.pages[0].products.length === 0) {
    return <div>No results</div>;
  }

  const handleItemClick = (item: ProductDisplayItem) => {
    const { product } = item;
    router.push(`/products/${product.id}`);
  };

  return (
    <>
      {data?.pages.map((page) => {
        return page.products.map((p, index) => (
          <SingleProduct
            key={`${p.id}-${index}`}
            item={{
              product: p,
            }}
            onClickItem={handleItemClick}
          />
        ));
      })}
      {hasNextPage && (
        <Button variant="ghost" onClick={() => fetchNextPage()}>
          Load more...
        </Button>
      )}
    </>
  );
};
