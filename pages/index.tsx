import Button from "@mui/material/Button";
import { Box, Container, CssBaseline, Paper, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const mdTheme = createTheme();

export default function Home() {
  const router = useRouter();
  //const [session, setSession] = useState(false);
  const { data: session } = useSession();
  

  if (session) {
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
                >Please sign in
              </Typography>
              <Button onClick={() => signIn()}>Sign in</Button>
        </Paper>
        </Box>
        
        </Container>
      </ThemeProvider>
    </>
  );
}
