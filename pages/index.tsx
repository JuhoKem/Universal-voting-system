import Button from "@mui/material/Button";
import { Box, CircularProgress, Container, CssBaseline, Paper, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

const mdTheme = createTheme();

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  

  if (session && status === "authenticated") {
    console.log("redirecting..")
    router.push("/dashboard");
  }

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Paper sx={{
              backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
                width: '50vw',
                height: '25vh',
                display: 'flex',
                flexDirection: 'column',  
                alignItems: 'center', }}>
              <Typography
                component="h1"
                variant="h2"
                noWrap
                sx={{ flexGrow: 1 }}
                >Universal voting app
              </Typography>
              <Typography
                component="h1"
                variant="h6"
                noWrap
                sx={{ flexGrow: 1 }}
                >{status !== "loading" ? "Please sign in" : <CircularProgress />}
              </Typography>
              <Button onClick={() => signIn()}>Sign in</Button>
        </Paper>
        </Box>
        
        </Container>
      </ThemeProvider>
    </>
  );
}
