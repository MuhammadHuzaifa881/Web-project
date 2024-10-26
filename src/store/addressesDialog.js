import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'addresses',
  initialState: {
    items: [],
  },
  // reducers: {
  //   addAddress(state, action) {
  //     console.log(action.payload,"action payload")
  //     console.log('Before adding:', state.items);  // Log current items before adding
  //     state.items.push(action.payload);  // Add new address to the array
  //     console.log("new array", state.items.push(action.payload))
  //     console.log('After adding:', state.items); 
  //   },
  //   deleteAddress(state, action) {
  //     state.items = state.items.filter((_, index) => index !== action.payload); // Remove address by index
  //   },
  //   clearAddresses(state) {
  //     state.items = []; // Clear all addresses
  //   },
  // },
  reducers: {
    addAddress(state, action) {
      // console.log(action.payload, "action payload");
      // console.log('Before adding: in address dialog', state.items);  // Log current items before adding

      // Check for duplicates
      const isDuplicate = state.items.some(
        (item) => item.addressTitle === action.payload.addressTitle && 
                  item.addressLine === action.payload.addressLine
      );
console.log(isDuplicate,"is duplicate")
      if (!isDuplicate) {
        state.items.push(action.payload);  // Add new address to the array
        // console.log('After adding:', Array.from(state.items));
      } else {
        console.log('Duplicate address not added.');
      }
    },
    deleteAddress(state, action) {
      state.items = state.items.filter((_, index) => index !== action.payload); // Remove address by index
    },
    clearAddresses(state) {
      state.items = []; // Clear all addresses
    },
  },
});

export { actions as addressActions };
export { reducer as addressesReducer };


