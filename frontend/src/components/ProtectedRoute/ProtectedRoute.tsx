import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInRoute } from '../../constants';

interface Props extends PropsWithChildren {
  isAllowed: boolean;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAllowed) {
      navigate(signInRoute);
    }
  });

  return children;
};

export default ProtectedRoute;
