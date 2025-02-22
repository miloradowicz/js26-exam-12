import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props extends PropsWithChildren {
  isAllowed: boolean;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
  const navigate = useNavigate();

  if (!isAllowed) {
    navigate('/login');
  }

  return children;
};

export default ProtectedRoute;
