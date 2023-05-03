import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import SideBar from "./SideBar";
import { Container, Grid, Paper, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';

const mdTheme = createTheme();

export default function Dashboard() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const items1 = [{ message: "Testi1" }]
            setItems(items1);
        }
        if (true) {
            console.log("session alive, fetching data...");
            fetchData();
        }

    }, []);

return (
    <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <SideBar />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {items && items.map((post: any) => (
                        <Grid key={post.message} item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                        {post.message}
                        </Paper>
                    </Grid>
                    ))}
                </Grid>
            </Container>
            </Box>
        </Box>
    </ThemeProvider>
);

}