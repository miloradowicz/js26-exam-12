import { isAxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Box, Button, Grid2 as Grid, Stack, Typography } from '@mui/material';

import { ImageSet, PopulatedImage } from '../../../types';
import { api } from '../../../api';
import { clear, selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import ImageListItem from '../components/ImageListItem';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { imagesEndpoint, signInRoute } from '../../../constants';
import { hasMessage } from '../../../helpers/error-helpers';
import ImagePopup from '../components/ImagePopup';
import { useAppSelector } from '../../../app/hooks';

interface Props {
  authorId?: string;
}

const ImagesViewer: FC<Props> = ({ authorId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ImageSet>();
  const [popup, setPopup] = useState(false);
  const [popupItem, setPopupItem] = useState<PopulatedImage>();

  const load = useCallback(async () => {
    try {
      setLoading(true);

      let params = {};
      if (authorId) {
        params = { author: authorId };
      } else if (id) {
        params = { author: id };
      }

      const { data } = await api.get<ImageSet>(imagesEndpoint, {
        params,
      });
      setData(data);
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        if (e.response.status === 401) {
          dispatch(clear());
          return void navigate(signInRoute);
        } else if (e.response.status === 404) {
          return void setData(undefined);
        }

        enqueueSnackbar(`${e.message}: ${e.response.data.error}`, {
          variant: 'error',
        });
      } else if (hasMessage(e)) {
        enqueueSnackbar(e.message, { variant: 'error' });
      }

      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, authorId, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleClick = async (item: PopulatedImage) => {
    setPopupItem(item);
    setPopup(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${imagesEndpoint}/${id}`);
      load();
    } catch (e) {
      if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, {
          variant: 'error',
        });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      console.error(e);
    }
  };

  const handleClose = () => {
    setPopup(false);
    setPopupItem(undefined);
  };

  return (
    <>
      <Loader open={loading} />
      <ImagePopup
        open={popup}
        item={popupItem}
        onDelete={async () => {
          if (popupItem) await handleDelete(popupItem._id);
        }}
        onClose={handleClose}
      />
      <Box maxWidth="md" mx="auto">
        <Stack direction="row" justifyContent="space-between">
          <Typography component="h1" variant="h4" gutterBottom>
            {user && (user._id === authorId || (!authorId && user._id === id))
              ? 'My images'
              : data?.title
                ? `${data.title}'s images`
                : 'Images'}
          </Typography>
          {user &&
            (user._id === authorId || (!authorId && user._id === id)) && (
              <Button
                variant="outlined"
                onClick={() => navigate('/images/new')}
              >
                Add new image
              </Button>
            )}
        </Stack>
        {!loading && (
          <Grid container spacing={1} py={2} justifyContent={{ sx: 'center' }}>
            {data?.images.length ? (
              data.images.map((x) => (
                <Grid key={x._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ImageListItem
                    id={x._id}
                    author={x.author}
                    title={x.title}
                    image={x.image}
                    onClick={() => handleClick(x)}
                    onDelete={() => handleDelete(x._id)}
                  />
                </Grid>
              ))
            ) : (
              <Typography fontStyle="italic">Nothing here yet.</Typography>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default ImagesViewer;
