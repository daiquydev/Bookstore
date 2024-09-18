"use client";

import {
  AccordionDetails,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary } from "./AccordionCustom";
import axios from "axios";
import { useEffect, useState } from "react";
import { IBook } from "../../types/book";
import FindBookAutocomplete from "./FindBookAutocomplete";
import { InputListing } from "./InputListing";
import GenreAutocomplete from "./GenreAutocomplete";
import { useStoreAlert } from "../../hooks/alert";
import { onSubmitService, getAllBooksService } from "@/api/create/createBookService";

const addBookDefault: IBook = {
  title: "Thêm mới sách",
  id: -1,
  isbn: "",
  authors: [],
  languageCode: "",
  genre: [],
  publisher: "",
  publishedDate: "",
  pageCount: undefined,
  size: "",
};
const CreateBook = ({
  updateBookId,
}: {
  updateBookId: (bookId: number | string | undefined) => void;
}) => {
  const [options, setOptions] = useState<readonly IBook[]>([addBookDefault]);
  const [open, setOpen] = useState(false);
  const { callAlert } = useStoreAlert();
  const methods = useForm<IBook>();
  const { handleSubmit, getValues } = methods;
  const id = getValues("id");

  const loading = open && options.length === 0;
  const onSubmit: SubmitHandler<IBook> = async (value) => {
    if (value?.id !== -1 && value?.id !== 0) {
      updateBookId(value?.id);
      return callAlert("Chọn sách thành công");
    }
    const {
      authors,
      genre,
      isbn,
      languageCode,
      pageCount,
      publishedDate,
      publisher,
      size,
      title,
    } = value;

    let data = JSON.stringify({
      isbn,
      title,
      authors: [authors],
      publisher,
      languageCode,
      genre: genre.map((item) => (typeof item === 'string' ? item : item.name)),
      publishedDate,
      size,
      pageCount,
    });
    const response = await onSubmitService(data);
    if (response?.ok) {
      console.log(JSON.stringify(response));
      updateBookId(response?.id);
      callAlert("Tạo sách thành công");
    }
  };
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    const getAllBook = async () => {    
      const response = await getAllBooksService();
      if (response) {        
        if (active) {
          setOptions([addBookDefault, ...response]);
        }
      }
      else {
        console.log('Error fetching data:', response?.error);
      }
    }
    getAllBook();
    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ borderBottom: 1, borderBottomColor: "lightgray" }}
          >
            Sách
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FindBookAutocomplete
                  open={open}
                  options={options}
                  setOpen={setOpen}
                  setOptions={setOptions}
                />
              </Grid>

              <Grid item xs={6}>
                <InputListing label="Tiêu đề" name="title" required />
              </Grid>
              <Grid item xs={6}>
                <InputListing label="Tác giả" name="authors" required />
              </Grid>
              <Grid item xs={12}>
                <GenreAutocomplete />
              </Grid>
              <Grid item xs={4}>
                <InputListing label="Nhà xuất bản" name="publisher" required />
              </Grid>
              <Grid item xs={4}>
                <InputListing
                  label="Số trang"
                  name="pageCount"
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={4}>
                <InputListing label="Kích thước" name="size" />
              </Grid>
              <Grid item xs={4}>
                <InputListing label="ISBN" name="isbn" required />
              </Grid>
              <Grid item xs={4}>
                <InputListing
                  label="Ngày phát hành"
                  name="publishedDate"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <InputListing label="Ngôn ngữ" name="languageCode" required />
              </Grid>
            </Grid>
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"flex-end"}
              mt={2}
            >
              <Button
                variant="outlined"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {id == -1 ? `Tạo sách` : `Chọn sách`}
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </form>
    </FormProvider>
  );
};

export default CreateBook;
