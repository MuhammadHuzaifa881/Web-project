// object code
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddAddressMapModal from "./AddAddressMapModal";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(3),
    height: "200px",
  },
}));

const AddAddressAttributeDialog = ({ open, handleClose }) => {
  const classes = useStyles();
  const addedValues = useSelector((state) => state?.addresses?.items || []);
  // console.log(addedValues, "show data in table");
  const [mapModal, setMapModal] = useState(false);

  const handleMapOpen = () => {
    setMapModal(true);
  };

  const handleMapClose = () => {
    setMapModal(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogContent className={classes.details}>
        <table
          style={{
            width: "100%",
            marginTop: "16px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #000", textAlign: "left" }}>
              <th style={{ padding: "8px", fontWeight: "bolder" }}>ID</th>
              <th style={{ padding: "8px", fontWeight: "bolder" }}>Title</th>
              <th style={{ padding: "8px", fontWeight: "bolder" }}>
                Address Line
              </th>
              <th style={{ padding: "8px", fontWeight: "bolder" }}>Latitude</th>
              <th style={{ padding: "8px", fontWeight: "bolder" }}>
                Longitude
              </th>
              {/* <th style={{ padding: "8px", fontWeight: "bolder" }}>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {addedValues.flat().length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "8px", textAlign: "center" }}>
                  No address found
                </td>
              </tr>
            ) : (
              addedValues.flat().map((value, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  
                  <td style={{ padding: "8px" }}>{index + 1}</td>
                  <td style={{ padding: "8px" }}>{value?.addressTitle}</td>
                  <td style={{ padding: "8px" }}>{value?.addressLine}</td>
                  <td style={{ padding: "8px" }}>{value?.latitude}</td>
                  <td style={{ padding: "8px" }}>{value?.longitude}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <AddAddressMapModal open={mapModal} onClose={handleMapClose} />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleMapOpen}>
          Add New Address
        </Button>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAddressAttributeDialog;
