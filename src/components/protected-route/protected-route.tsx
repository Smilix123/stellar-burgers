import { FC } from 'react';
import { TProtectedRouteProps } from './type';
import { useSelector } from '../../services/store';
import {
  selectUserProfile,
  selectUserProfileLoading
} from '../../services/profile';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const user = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserProfileLoading);
  const location = useLocation();
  const from = location.state?.from || '/';

  if (isLoading) {
    return <Preloader />;
  }

  if (anonymous && user) {
    return <Navigate to={from} replace />;
  }

  if (!anonymous && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
