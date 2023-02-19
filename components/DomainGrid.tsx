import React from "react";
import {
    Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getAllDomains } from "../DTO/queryHooks";

function DomainGrid() {
  const {data: list, isSuccess, isError, isLoading} = getAllDomains()
  const renderView =  () => {
    if (isSuccess) {
      return (

      <div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          style={{
            marginTop: 20,
            padding: 5
          }}
        >
          {list.map((item) => (
            <Grid item xs={2} sm={4} md={4} key={item.id}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2">{item.desc}</Typography>
                </CardContent>
                <CardActions>
                  <Link passHref href={{
                    pathname:'/mocks',
                    query: {id: item.id}
                  }}>
                  <Button size="small" onClick={() => console.log("hello")}>
                      Open
                  </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      )
    } else if (isLoading) {
      return (
        <div>
          isLoading
        </div>
      )
  
    } else if (isError) {
      return (
        <div>
          isError
        </div>
      )
  
    } else {
      return (
        <div>
          something went wrong
        </div>
      )
    }
  }
  return (
    <>
    {renderView()}
    </>
  )
}
export default DomainGrid;
