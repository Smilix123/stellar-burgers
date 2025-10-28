import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeeds,
  selectFeedsLoading
} from '../../services/feeds';
import { selectIngredientsLoading } from '../../services/ingredients';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isFeedsLoading = useSelector(selectFeedsLoading);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const feeds = useSelector(selectFeeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isIngredientsLoading || isFeedsLoading || !feeds) {
    return <Preloader />;
  }
  const orders: TOrder[] = feeds.orders;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
