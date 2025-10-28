import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading
} from '../../services/orders';
import {
  fetchIngredients,
  selectIngredientsLoading
} from '../../services/ingredients';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const isOrderLoading = useSelector(selectUserOrdersLoading);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isOrderLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
