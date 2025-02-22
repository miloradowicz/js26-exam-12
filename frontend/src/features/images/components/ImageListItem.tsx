import { FC, memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { baseURL } from '../../../constants';
import noImg from '../../../assets/images/no-img.svg';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { StrippedUser } from '../../../types';

interface Props {
  id: string;
  author: StrippedUser;
  title: string;
  image: string | null;
  onClick: () => void;
  onDelete: () => Promise<void>;
}

const ImageListItem: FC<Props> = ({
  author,
  title,
  image,
  onClick,
  onDelete,
}) => {
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 360, mx: 'auto', height: '100%' }} elevation={5}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="180"
          width="200"
          image={
            image ? new URL(image, new URL('images/', baseURL)).href : noImg
          }
          alt={title}
          sx={{
            objectFit: image ? 'cover' : 'contain',
            objectPosition: 'center',
          }}
        />
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          by{' '}
          <Typography
            color="primary"
            onClick={() => navigate(`/images/by-author/${author._id}`)}
            sx={{ cursor: 'pointer' }}
          >
            {author.displayName}
          </Typography>
        </Typography>
      </CardContent>
      <CardActions>
        {user && (user.role === 'admin' || user._id === author._id) && (
          <Chip
            label={`Uploaded by ${user._id === author._id ? 'you' : author.displayName}`}
            variant="outlined"
            deleteIcon={
              <Tooltip title="Delete" placement="right">
                {deleting ? <CircularProgress size={18} /> : <Delete />}
              </Tooltip>
            }
            onDelete={handleDelete}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default memo(ImageListItem, (prev, next) => prev.id === next.id);
