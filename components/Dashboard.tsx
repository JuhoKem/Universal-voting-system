import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import SideBar from "./SideBar";
import { Button, Card, CardActions, CardContent, Container, Grid, Paper, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const mdTheme = createTheme();

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [votingState, setVotingState] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const items1 = [{ name: "Test Candidate", votes: 5 }]
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
            <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
                <Grid container spacing={3}>
                    <TextField label='Candidate name'></TextField>
                    <Button variant='contained' disabled={votingState}>Add</Button>
                </Grid>
            </Container>

            <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
                <Grid container spacing={3}>
                    <Typography></Typography>
                    <Button variant='contained' onClick={() => setVotingState(!votingState)}>{votingState ? "Stop voting" : "Start voting"}</Button>
                </Grid>
            </Container>
            <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
                <Grid container spacing={3}>
                    {items && items.map((candidate: any) => (
                        <Grid key={candidate.name} item xs={12} md={4} lg={3}>
                        <Card
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                            <CardContent>
                                <Typography variant='h5'>{candidate.name}</Typography>
                                <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">Votes: {candidate.votes}</Typography>
                                <br></br>
                                <br></br>
                            </CardContent>
                            <CardActions>
                                <Button disabled={!votingState}>Vote</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Container>
            </Box>
        </Box>
    </ThemeProvider>
);

}