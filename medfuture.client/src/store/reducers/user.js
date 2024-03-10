// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    role:"",
    email:"",
    user_id:"",
    email_verified:"",
    name:"",
    picture:""
};

// ==============================|| SLICE - USER ||============================== //

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.openItem = action.payload.openItem;
        },

        activeComponent(state, action) {
            state.openComponent = action.payload.openComponent;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload.drawerOpen;
        },

        openComponentDrawer(state, action) {
            state.componentDrawerOpen = action.payload.componentDrawerOpen;
        }
    }
});

export default userSlice.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer } = userSlice.actions;
