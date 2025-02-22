import { FC, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { PopulatedImage } from '../../../types';
import { baseURL } from '../../../constants';
import noImg from '../../../assets/images/no-img.svg';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { useNavigate } from 'react-router-dom';

interface Props {
  item?: PopulatedImage;
  open: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

const ImagePopup: FC<Props> = ({ item, open, onDelete, onClose }) => {
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const [deleting, setDeleting] = useState(false);

  const closeAndNavigate = (url: string) => {
    onClose();
    navigate(url);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await onDelete();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    item && (
      <Dialog
        fullWidth
        maxWidth="xl"
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        })}
        open={open}
        onClose={onClose}
      >
        <Box>
          <DialogContent>
            <Paper
              component="img"
              src={
                item.image
                  ? new URL(item.image, new URL('images/', baseURL)).href
                  : noImg
              }
              alt={item.title}
              sx={{
                aspectRatio: 1.2,
                objectFit: item.image ? 'cover' : 'contain',
                objectPosition: 'center',
              }}
            />
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              by{' '}
              <Typography
                color="primary"
                onClick={() =>
                  closeAndNavigate(`/images/by-author/${item.author._id}`)
                }
                sx={{ cursor: 'pointer' }}
              >
                {item.author.displayName}
              </Typography>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              {user &&
                (user.role === 'admin' || user._id === item.author._id) && (
                  <Button
                    size="small"
                    onClick={handleDelete}
                    loading={deleting}
                  >
                    <Delete />
                  </Button>
                )}
              <Button size="small" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    )
  );
};

export default ImagePopup;
