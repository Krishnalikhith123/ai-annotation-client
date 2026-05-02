import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/projects');
    return res.data.projects;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/projects', data);
    return res.data.project;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/projects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export default projectSlice.reducer;