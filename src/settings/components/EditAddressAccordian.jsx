import React, { useState } from "react";

import {
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "../../common/components/LocalizationProvider";
import useSettingsStyles from "../common/useSettingsStyles";
import AddAddressAttributeDialog from "./AddAddressAttributeDialog";
import { useSelector } from "react-redux";
import useFilter from "../../main/useFilter";
import usePersistedState from "../../common/util/usePersistedState";

const EditAddressAccordian = ({
  attribute,

}) => {
  const classes = useSettingsStyles();
  const t = useTranslation();

  const [addDialogShown, setAddDialogShown] = useState(false);
  const handleopen=()=>{
    setAddDialogShown(true)
  }
  const handleClose=()=>{
    setAddDialogShown(false);
  }
  const positions = useSelector((state) => state.session.positions);

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  });
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);


  useFilter(keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  return (
    <Accordion defaultExpanded={!!attribute}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t("sharedAddress")}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleopen}
          startIcon={<AddIcon />}
        >
          {t("sharedAddAddress")}
        </Button>
        <AddAddressAttributeDialog open={addDialogShown} handleClose={handleClose} filteredPositions={filteredPositions} />
      </AccordionDetails>
    </Accordion>
  );
};

export default EditAddressAccordian;
