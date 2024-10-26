

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDispatch } from "react-redux";
import { addressActions } from "../../store/addressesDialog";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(3),
  },
  inputRow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  inputField: {
    flex: 1,
  },
  mapContainer: {
    width: "100%",
    height: "500px", // Ensure the height is set
  },
}));

const AddAddressMapModal = ({ open, onClose }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const initializedRef = useRef(false);
  
  const [inputValues, setInputValues] = useState({
    addressTitle: "",
    addressLine: "", // Fixed key from addressTitle to addressLine
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (key) => (event) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
  };

  const handleAddValue = () => {
    console.log('Dispatching address: add address map modal', inputValues);

    dispatch(addressActions.addAddress(inputValues));
console.log(inputValues,"bug starts")
    setInputValues({ addressTitle: "", addressLine: "", latitude: "", longitude: "" });

    // const lat = parseFloat(inputValues.latitude);
    // const lng = parseFloat(inputValues.longitude);
    // if (mapInstanceRef.current && !isNaN(lat) && !isNaN(lng)) {
    //   mapInstanceRef.current.flyTo({ center: [lng, lat], zoom: 12 });
    // }
    onClose()
    // if (Object.values(inputValues).every((value) => value.trim() !== "")) {
    
    // }
  };


  useEffect(() => {
    console.log("Modal is opening");

    const initializeMap = () => {
      if (!mapContainerRef.current || initializedRef.current) return;

      const userLatitude = parseFloat(localStorage.getItem("user_latitude"));
      const userLongitude = parseFloat(localStorage.getItem("user_longitude"));

      if (isNaN(userLatitude) || isNaN(userLongitude)) return;

      mapInstanceRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [userLongitude, userLatitude],
        zoom: 7,
      });

      new Marker()
        .setLngLat([userLongitude, userLatitude])
        .addTo(mapInstanceRef.current);

      mapInstanceRef.current.on("load", () => {
        console.log("Map loaded successfully!");
        initializedRef.current = true; // Set initialized flag to true
      });

      mapInstanceRef.current.on("click", (event) => {
        const { lng, lat } = event.lngLat;
        fetchAddress(lng, lat);
      });
    };

    if (!open || initializedRef.current) return;

    const timeoutId = setTimeout(() => {
      initializeMap();
    }, 100);
console.log("map running")
    return () => clearTimeout(timeoutId);
  }, [open]);


  const fetchAddress = async (lng, lat) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (response.ok) { // Check if the response is okay
        const newName = data?.name || "No Title"; // Get the display name
        const newStreet = data?.display_name || "No street name"; // Get the street name

        // Update state with the new values
        setInputValues(() => ({
          addressTitle: newName, // Set name
          addressLine: newStreet, // Set street
          latitude: lat.toFixed(6), // Set latitude
          longitude: lng.toFixed(6), // Set longitude
        }));
      } else {
        console.error("Error fetching the address:", data);
      }
    } catch (error) {
      console.error("Error fetching the address:", error);
    }
  };

  const placeholders = ["Address Title", "Address Line", "Latitude", "Longitude"];

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>Select Address</DialogTitle>
      <DialogContent className={classes.details}>
        <FormControl>
          <div ref={mapContainerRef} className={classes.mapContainer} />
        </FormControl>
        <FormControl fullWidth>
          <div className={classes.inputRow}>
            {Object.keys(inputValues).map((key, index) => (
              <TextField
                fullWidth
                key={key} // Use key directly instead of index
                className={classes.inputField}
                variant="outlined"
                value={inputValues[key]}
                onChange={handleInputChange(key)}
                placeholder={placeholders[index]}
              />
            ))}
          </div>
        </FormControl>
      </DialogContent>
      <DialogActions style={{ marginTop: "16px", marginRight: "20px" }}>
        <Button onClick={handleAddValue} variant="contained" color="primary">
          Add
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAddressMapModal;

