import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/tasks', { params });
    return res.data.tasks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/tasks', data);
    return res.data.task;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(`/tasks/${id}/status`, { status });
    return res.data.task;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      });
  },
});

export default taskSlice.reducer;