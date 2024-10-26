import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography,
  TextField,
} from "@mui/material";
import { useCatch, useEffectAsync } from "../../reactHelper";
import { useTranslation } from "../../common/components/LocalizationProvider";
import PageLayout from "../../common/components/PageLayout";
import useSettingsStyles from "../common/useSettingsStyles";
import { useSelector,useDispatch } from "react-redux";
import { addressActions } from "../../store/addressesDialog";

const EditItemView = ({
  children,
  endpoint,
  item,
  setItem,
  defaultItem,
  validate,
  onItemSaved,
  menu,
  breadcrumbs,
}) => {
  const navigate = useNavigate();
  const classes = useSettingsStyles();
  const t = useTranslation();
const dispatch=useDispatch();
  const { id } = useParams();
  const addressInfo = useSelector((state) => state?.addresses?.items);
  // const [address, setAddress] = useState({addressInfo?.address});
  // console.log(addressInfo, "edit view address info lastly");

  useEffectAsync(async () => {
    if (!item) {
      dispatch(addressActions.clearAddresses());
      if (id) {
        const response = await fetch(`/api/${endpoint}/${id}`);
        if (response.ok) {
          // setItem(await response.json());
          const data = await response.json(); // Parse the response once
          setItem(data);
          // console.log(data);
          data.addressInfo.forEach(address => {
            dispatch(addressActions.addAddress(address));
          });
        } else {
          throw Error(await response.text());
        }
      } else {
        setItem(defaultItem || {});
      }
    }
  }, [id, item, defaultItem]);

  const handleSave = useCatch(async () => {
    let url = `/api/${endpoint}`;
    if (id) {
      url += `/${id}`;
    }
    console.log("Payload being sent:", item);
    const response = await fetch(url, {
      method: !id ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, addressInfo }),
    });

    if (response.ok) {
      if (onItemSaved) {
        onItemSaved(await response.json());
      }
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={menu} breadcrumbs={breadcrumbs}>
      <Container maxWidth="xs" className={classes.container}>
        {item ? (
          children
        ) : (
          <Accordion defaultExpanded>
            <AccordionSummary>
              <Typography variant="subtitle1">
                <Skeleton width="10em" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={-i} width="100%">
                  <TextField />
                </Skeleton>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
        <div className={classes.buttons}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={!item}
          >
            {t("sharedCancel")}
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSave}
            disabled={!item || !validate()}
          >
            {t("sharedSave")}
          </Button>
        </div>
      </Container>
    </PageLayout>
  );
};

export default EditItemView;
