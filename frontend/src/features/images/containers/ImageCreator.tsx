import { AddAPhoto, Create } from '@mui/icons-material';
import {
  SelectChangeEvent,
  Box,
  Typography,
  Grid2 as Grid,
  TextField,
  Button,
} from '@mui/material';
import { isAxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
} from 'react';
import { api } from '../../../api';
import FileInput from '../../../components/UI/FileInput/FileInput';
import { ImageMutation, ValidationError } from '../../../types';
import { isValidationError } from '../../../helpers/error-helpers';
import { imagesEndpoint } from '../../../constants';
import { useNavigate } from 'react-router-dom';

const initialData: ImageMutation = {
  title: '',
  image: '',
};

const ImageCreator = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [data, setData] = useState(initialData);
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);

  const getFieldError = (fieldName: string) => {
    if (isValidationError(error) && fieldName in error.errors) {
      return error.errors[fieldName].messages.join('; ');
    }
    return undefined;
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    setError((error) => {
      let _error = error;

      if (error?.errors[e.target.name]) {
        _error = { ...error };
        delete _error.errors[e.target.name];
      }

      return _error;
    });

    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError((error) => {
      let _error = error;

      if (error?.errors[e.target.name]) {
        _error = { ...error };
        delete _error.errors[e.target.name];
      }

      return _error;
    });

    if (e.target.files) {
      const file = e.target.files[0];
      setData((data) => ({ ...data, [e.target.name]: file }));
    }
  };

  const handleSubmit: FormEventHandler = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      try {
        const body = new FormData();
        body.append('title', data.title);
        body.append('image', data.image);

        await api.post(imagesEndpoint, body);
        setData(initialData);
        navigate('/');
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 400) {
          return void setError(e.response.data);
        } else if (isAxiosError(e) && e.response?.data.error) {
          return void enqueueSnackbar(
            `${e.message}: ${e.response.data.error}`,
            {
              variant: 'error',
            },
          );
        } else if (e instanceof Error) {
          return void enqueueSnackbar(e.message, { variant: 'error' });
        }

        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Typography component="h1" variant="h4" gutterBottom>
        Add artist
      </Typography>
      <Box
        py={2}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            '& .MuiGrid2-root': { minHeight: 80 },
          }}
        >
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={data.title}
              onChange={handleChange}
              error={!!getFieldError('title')}
              helperText={getFieldError('title')}
            />
          </Grid>
          <Grid size={12}>
            <FileInput
              required
              fullWidth
              label="Image"
              name="image"
              buttonText="Upload"
              buttonProps={{
                disableElevation: true,
                variant: 'contained',
                startIcon: <AddAPhoto />,
                sx: { px: 5 },
              }}
              value={data.image}
              onChange={handleFileInputChange}
              error={!!getFieldError('image')}
              helperText={getFieldError('image')}
            />
          </Grid>

          <Grid size={12}>
            <Button
              fullWidth
              type="submit"
              loading={loading}
              startIcon={<Create />}
              sx={{ p: 3 }}
              disabled={
                !!(
                  isValidationError(error) &&
                  Object.entries(error.errors).length
                )
              }
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ImageCreator;
