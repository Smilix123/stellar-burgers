import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearConstructor,
  selectConstructorIngredients
} from '../../services/burger-constructor';
import { getConstructorData } from '../../utils/utils';
import {
  clearOrder,
  createOrder,
  selectCreateOrderLoading,
  selectLastCreatedOrder
} from '../../services/order-create';
import { selectUserProfile } from '../../services/profile';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedIngredients = useSelector(selectConstructorIngredients);
  const orderRequest = useSelector(selectCreateOrderLoading);
  const orderModalData = useSelector(selectLastCreatedOrder);
  const user = useSelector(selectUserProfile);

  const constructorItems = useMemo(
    () => getConstructorData(selectedIngredients),
    [selectedIngredients]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(createOrder(selectedIngredients.map((ing) => ing._id)));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
