import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

export const saveAnnotation = createAsyncThunk('annotations/save', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/annotations', data);
    return res.data.annotation;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAnnotations = createAsyncThunk('annotations/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/annotations', { params });
    return res.data.annotations;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const annotationSlice = createSlice({
  name: 'annotations',
  initialState: { annotations: [], current: null, loading: false, error: null },
  reducers: {
    setCurrentAnnotation: (state, action) => { state.current = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotations.fulfilled, (state, action) => {
        state.annotations = action.payload;
      })
      .addCase(saveAnnotation.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { setCurrentAnnotation } = annotationSlice.actions;
export default annotationSlice.reducer;