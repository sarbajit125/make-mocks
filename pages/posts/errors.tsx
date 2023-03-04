import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";


export default function CustomErrPage() {
    const router = useRouter()
    return(
        <Container maxWidth="sm">
            <Typography variant="h1">
                    Something went wrong
            </Typography>
            <Typography variant="h4">
                error message will be displayed here
            </Typography>
            <Button onClick={() => router.back()}>
                Please try again
            </Button>
        </Container>
    )
}