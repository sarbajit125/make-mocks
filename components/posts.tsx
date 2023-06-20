import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import {
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Box,
  TextField,
  TablePagination,
  AlertColor,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useContext, useState } from "react";
import ConfirmModal from "./confirmModal";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import { APIManager } from "../api/apiManager";
import { GetAllRoutes } from "../DTO/queryHooks";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import ShowToast from "./showToast";
import { APIResponseErr, RoutesResponse } from "../DTO/components";
import { RoutePageContext } from "../contexts/pageContext";

export function EnhancedPosts() {
  const router = useRouter();
  
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["deleteMock"],
    mutationFn: (id: string) => APIManager.sharedInstance().deleteRoute(id),
    onSuccess(data, _variables, _context) {
      queryClient.invalidateQueries("mocks");
      setToastmsg(data.message);
      setToastColor("success");
      setOpen(true);
    },
    onError(error, _variables, _context) {
      handleError(error)
    },
  });
  const {setMockCuid, setMockPage, toggleIsCreate} = useContext(RoutePageContext)
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [page_number, setNewPage] = useState<number>(1);
  const [page_size, setPageSize] = useState<number>(5);
  const [searchTxt, setSearch] = useState<string>("");
  const domainId = typeof router.query.id === "string" ? router.query.id : "";
  const { data, isSuccess, isLoading, isError, error } = GetAllRoutes(
    page_number,
    page_size,
    domainId,
    searchTxt
  );
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastmsg] = useState("");
  const [toastColor, setToastColor] = useState<AlertColor>("success");

  const renderRoutes = (data: RoutesResponse) => {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", pt: 4 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 5 },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" component="div">
              {data.routeCount} Routes available
            </Typography>
          </Box>
          <Box>
            <TextField
              placeholder="Search.."
              size="small"
              sx={{ pr: 2 }}
              value={searchTxt}
              onChange={(event) => {
                handleFilter(event.target.value);
              }}
            />
            <Tooltip title="Create new Mock">
              <Link
                href={{
                  pathname: `/posts/create-mock`,
                  query: { isCreate: true, groupName: data.domain },
                }}
                style={{ textDecoration: "none" }}
                prefetch={false}
                passHref
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    toggleIsCreate(true)
                    setMockCuid(uuidv4())
                    setMockPage({
                      domain: data.domain,
                      endpoint: "/",
                      id: uuidv4(),
                      response: "// some response here",
                      statusCode: 200,
                      title: '',
                      type: 'POST',
                    })
                  }}
                >
                  Add Route
                </Button>
              </Link>
            </Tooltip>
          </Box>
        </Toolbar>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Request type</TableCell>
                <TableCell>Status code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.routes.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.endpoint}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.statusCode}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit the mock">
                        <IconButton onClick={() => {
                           toggleIsCreate(false)
                           setMockCuid(row.id)
                           setMockPage(row)
                           router.push(`/posts/${row.id}`)
                        }}>
                          <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete the Mock">
                      <IconButton onClick={() => callModal(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={data.routeCount}
          rowsPerPage={page_size}
          page={page_number - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ConfirmModal
          id={deleteId}
          open={showModal}
          title={"Delete the route"}
          desc={"Are you sure you want to delete the route ?"}
          actionBtnTitle={"Delete"}
          actionBtnCallback={(id: string) => {
            setShowModal(false);
            deleteMutation.mutate(id);
          }}
          cancelBtnTitle={"Cancel"}
          cancelBtnAction={() => {
            setShowModal(false);
          }}
        />
      </Paper>
    );
  };
  function handleFilter(inputTxt: string) {
    setSearch(inputTxt);
  }
  function callModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setNewPage(1);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(newPage + 1);
    setNewPage(newPage + 1);
  };
  const handleClickAway = () => {
    setShowModal(false);
  };

  const handleError = (error: unknown) => {
    if (error instanceof APIResponseErr) {
      setToastmsg(error.message)
    } else {
      setToastmsg('Something went wrong')
    }
    setToastColor('error')
    setOpen(true)
    return <></>
  }
  return (
    <Paper>
      {isSuccess ? renderRoutes(data) : null}
      {isLoading || deleteMutation.isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading || deleteMutation.isLoading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}
      {isError ? handleError(error) : null}
      <ShowToast
        message={toastMsg}
        open={open}
        onClose={handleClose}
        color={toastColor}
        onCrossClick={handleClose}
      />
    </Paper>
  );
}
