import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import SideBar from "./SideBar";
import { Button, Card, CardActions, CardContent, Container, Grid, Paper, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const mdTheme = createTheme();

interface PanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: PanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >{value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [votingState, setVotingState] = useState(false);

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

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
            <Container maxWidth="lg" sx={{ mt: 14, mb: 4, ml: 10 }}>
                <Grid container spacing={3} sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography component="h1"
                        variant="h5"
                        color="inherit"
                        sx={{ mb: 5 }}>Universal voting system </Typography>
                    <Button sx={{ width: "50%"}} variant='contained' onClick={() => setVotingState(!votingState)}>{votingState ? "Stop voting" : "Start voting"}</Button>
                </Grid>
            </Container>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Candidate management" />
                    <Tab label="Voting" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, ml: 0 }}>
                <Grid container spacing={3}>
                    <TextField label='Candidate name'></TextField>
                    <Button variant='contained' disabled={votingState}>Add</Button>
                </Grid>
            </Container>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, ml: 0 }}>
                <Grid container spacing={3}>
                    {items && items.map((candidate: any) => (
                        <Grid key={candidate.name} item xs={12} md={4} lg={3}>
                                <Card sx={{ minWidth: 275 }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Candidate
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                        {candidate.name}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        </Typography>
                                        <Typography variant="body2">
                                        Votes: {candidate.votes}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button disabled={!votingState}>Vote</Button>
                                    </CardActions>
                                    </Card>
                        
                    </Grid>
                    ))}
                </Grid>
            </Container>
            </TabPanel>
            



            </Box>
        </Box>
    </ThemeProvider>
);

}