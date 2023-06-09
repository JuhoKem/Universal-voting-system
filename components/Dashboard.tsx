import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import SideBar from "./SideBar";
import { Button, Card, CardActions, CardContent, Container, Grid, Paper, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import {VotingContractAddress} from '../config.js'; //This is the contracts address
import VotingAbi from '../smart contract/build/contracts/VotingContract.json'; //ABI
import {ethers} from 'ethers'
import { useWalletContext } from './WalletProvider';


const mdTheme = createTheme();

interface PanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: PanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Container
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            sx={{ margin: 0 }}
        >{value === index && (
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
        )}
        </Container>
    );
}

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [votingState, setVotingState] = useState(false);
    const [input, setInput] = useState(''); //Input of the addCandidate field
    const [input2, setInput2] = useState(''); //Input of the deleteCandidate field
    const [input3, setInput3] = useState(''); //Input of the addTierA field for address
    const [input4, setInput4] = useState(''); //Input of the addTierT field for tier
    const [candidates, setCandidates] = useState([]);
    const [candidatesCount, setCandidatesCount] = useState(0); //For the number of candidates in the election
    const [tierLevel, setCandidateTier] = useState(""); //For the account's tier
    const [tierText, setTierText] = useState(""); //For the tier text
    const [errorMessage, setErrorMessage] = useState(""); //For errors coming from the smart contract
    const [value, setValue] = useState(0); // Tab value

    const { connected, setIsConnected, accountAddress, setAccountAddress } = useWalletContext();

    /**
     * On tab change
     * @param event 
     * @param newValue 
     */
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { ethereum }: any = window;
            if (ethereum) {
              console.log("Attempting to fetch a list of all the candidates...");
              const provider = new ethers.BrowserProvider(ethereum);
              const signer = await provider.getSigner();
              const VoteContract = new ethers.Contract(
                VotingContractAddress,
                VotingAbi.abi,
                signer
              );
              let allCandidates = await VoteContract.getCandidates();
      
              // Convert candidate ID and votes to strings because they're returned in a "broken format", like 1n instead of 1
              const candidatesWithStrings = allCandidates.map((candidate) => ({
                _candidateId: candidate._candidateId.toString(),
                name: candidate.name,
                votes: candidate.votes.toString(),
                exists: candidate.exists,
              }));
      
              setItems(candidatesWithStrings);
              console.log("Fetched the candidates");
              console.log(candidatesWithStrings);

              const count = await VoteContract.candidatesCount();
              setCandidatesCount(count.toString())
              //const [candidatesCount, setCandidatesCount] = useState(0);
              console.log("Total candidates count:", count.toString());
            } else {
              console.log("ethereum object does not exist!");
            }
          } catch (error) {
            console.log(error);
          }
        };

        
        const setupEventListeners = async () => {
          try {
            console.log("setting up event listeners...");
            const { ethereum }: any = window;
            if (ethereum) {
                const provider = new ethers.BrowserProvider(ethereum)
                const signer = await provider.getSigner()
                const VoteContract = new ethers.Contract(
                    VotingContractAddress,
                    VotingAbi.abi,
                    signer
              );
      
              // Listen for candidates being added
              VoteContract.on("CandidateAdded", (candidateId, name, votes) => {
                console.log("New candidate added:", candidateId.toString(), name, votes.toString());
                setInput("")
                fetchData();
              });
              //listen for candidates being deleted
              VoteContract.on("CandidateDeleted", (candidateId) => {
                console.log("Candidate deleted:", candidateId.toString());
                setInput2("")
                fetchData();
              });
              //listen for votes being added
              VoteContract.on("voteAdded", () => {
                console.log("New vote has been added");
                fetchData();
              });
              //listen for tiers being updated
              VoteContract.on("TierAdded", (address_, tier_) => {
                console.log("A new tier has been added!");
                setInput4("")
                getVoterTier();
              });
              //listen for errors
              VoteContract.on("ErrorOccurred", (errorMessage) => {
                console.log("error!")
                setErrorMessage(errorMessage);
            });
                console.log("Event listeners set up");
            } else {
              console.log("ethereum object does not exist!");
            }
          } catch (error) {
            console.log(error);
          }
        };
        if (connected) {
            fetchData();
            setupEventListeners();
        }
      }, [connected]);
      
      

//Function for adding a new candidate to the blockchain
const AddNewCandidate = async e => {
    e.preventDefault() //no empty forms

    let newCandidate = {
        candidateName: input
    }

    try{
        const {ethereum}: any = window
        if (ethereum){
            console.log("Attemping to add a new candidate: ", newCandidate)
            const provider = new ethers.BrowserProvider(ethereum)
            const signer = await provider.getSigner()
            const VoteContract = new ethers.Contract(
                VotingContractAddress,
                VotingAbi.abi,
                signer
            )

            VoteContract.addCandidate(newCandidate.candidateName)
            .then(res => {
                setCandidates([...candidates, newCandidate])
                console.log('Added new candidate')
            })
            .catch(err =>{
                console.log(err)
            })
        }else {
            console.log('ethereum object does not exist!')
        }
    } catch(error){
        console.log(error)
    }

};


//Function for deleting a candidate
const DeleteCandidate = async e => {
    e.preventDefault() //no empty forms

    let deleteCandidate = {
        candidateId: input2
    }
    try{
        const {ethereum}: any = window
        if (ethereum){
            console.log("Attemping to delete a candidate: ", deleteCandidate)
            const provider = new ethers.BrowserProvider(ethereum)
            const signer = await provider.getSigner()
            const VoteContract = new ethers.Contract(
                VotingContractAddress,
                VotingAbi.abi,
                signer
            )

            VoteContract.deleteCandidate(deleteCandidate.candidateId)
            .then(res => {
                setCandidates([...candidates, deleteCandidate])
                console.log('Deleted candidate')
            })
            .catch(err =>{
                console.log(err)
            })
        }else {
            console.log('ethereum object does not exist!')
        }
    } catch(error){
        console.log(error)
    }
};


      //Function for voting a candidate
    const VoteCandidate = async (candidateId: number) => {
        try{
            const {ethereum}: any = window
            if (ethereum){
                console.log("Attemping to vote id: ", candidateId)
                const provider = new ethers.BrowserProvider(ethereum)
                const signer = await provider.getSigner()
                const VoteContract = new ethers.Contract(
                    VotingContractAddress,
                    VotingAbi.abi,
                    signer
                )
                VoteContract.vote(candidateId)
                .then(res => {
                    //setCandidates([...candidates, newCandidate])
                    console.log('Added a new vote')
                })
                .catch(err =>{
                    console.log(err)
                })
            }else {
                console.log('ethereum object does not exist!')
             }
        } catch(error){
            console.log(error)
        }
    
    };
    
    //Function for Adding a tier to a voter
    const _AddTier = async e => {
        e.preventDefault() //no empty forms

        let addTierTo = {
            voterAddress: input3,
            voterTier: input4
        }
        try{
            const {ethereum}: any = window
            if (ethereum){
                console.log("Attemping to add tier", addTierTo.voterTier, " to: ", addTierTo.voterAddress)
                const provider = new ethers.BrowserProvider(ethereum)
                const signer = await provider.getSigner()
                const VoteContract = new ethers.Contract(
                    VotingContractAddress,
                    VotingAbi.abi,
                    signer
                )

                VoteContract.addTier(addTierTo.voterAddress, addTierTo.voterTier)
                .then(res => {
                    console.log('Added tier')
                })
                .catch(err =>{
                    console.log(err)
                })
            }else {
                console.log('ethereum object does not exist!')
            }
        } catch(error){
            console.log(error)
        }
    };

    //get the candidate count
    const getVoterTier = async () => {

        let checkTier = {
            voterAddress: input3
        }

        try {

            const {ethereum}: any = window
            if (ethereum){
                const provider = new ethers.BrowserProvider(ethereum)
                const signer = await provider.getSigner()
                const VoteContract = new ethers.Contract(
                    VotingContractAddress,
                    VotingAbi.abi,
                    signer
                )

          const tier = await VoteContract.tiers(checkTier.voterAddress);
          let tierString = tier.toString();
          let tierOne = "1"
          setTierText(checkTier.voterAddress.toString() + "'s tier:")
          if (tierString > 0){
            setCandidateTier(tier.toString())
          }
          else{
            setCandidateTier(tierOne)
          }
          //const [candidatesCount, setCandidatesCount] = useState(0);
          console.log("The voter's tier:", tier.toString());
        }
      } catch (error) {
        console.log(error);
        setCandidateTier("")
      }
    };

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
                        sx={{ mb: 5, ml: 0 }}>Universal voting system </Typography>
                </Grid>
            </Container>
            {/*Error messages */}
            {errorMessage && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Error</h3>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage("")}>Close</button>
                    </div>
                </div>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Voting" />
                    <Tab label="Management" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {connected ? (
                    <Container maxWidth="lg" sx={{ mt: 5, mb: 5, ml: 0 }}>
                        <Grid container spacing={3}>
                            {/*Mapping of all the candidates*/}
                            {items.length > 0 ? (
                                items.map((candidate: any) => (
                                    <Grid key={candidate._candidateId} item xs={12} md={4} lg={3}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: 280,
                                        }}
                                        >
                                        <CardContent>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Candidate {candidate._candidateId}
                                            </Typography>
                                        <Typography variant='h5' component="div">{candidate.name}</Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
                                        <Typography variant="body2">
                                            Votes: {candidate.votes}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                        <Button variant='contained' onClick={() => VoteCandidate(candidate._candidateId)}>Vote</Button>
                                        </CardActions>
                                        </Card>
                                    </Grid>
                            ))
                            ) : (
                            <Typography>No candidates found.</Typography>
                            )}
                    </Grid>
                </Container>
                ) : <Typography>Please connect your wallet first.</Typography>}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {connected ? (
                    <>
                        <Typography 
                            component="h2"
                            variant="h6"
                            color="inherit"
                            sx={{ mb: 5, ml: 0 }}>Candidate management
                        </Typography>
                        <Typography>Number of candidates: {candidatesCount}</Typography>
                        <Container maxWidth="lg" sx={{ mt: 5, mb: 5, ml: 0 }}>
                            <Grid container spacing={3} sx={{ display: "flex", flexDirection: "column", width: '50%' }}>
                                <TextField label='Candidate name' id="addCand" value={input} onChange={ e => setInput(e.target.value)} ></TextField>
                                <Grid item/> 
                                <Button variant='contained' disabled={votingState} onClick={AddNewCandidate}>Add</Button>
                                <Grid item sx={{ width: '10%' }} /> 
                                <TextField label='Candidate id' id="delCand" value={input2} onChange={ e => setInput2(e.target.value)}></TextField>
                                <Grid item/>
                                <Button variant='contained' disabled={votingState} onClick={DeleteCandidate}>Delete</Button>
                                <Grid item/>
                                
                            </Grid>
                        </Container>
                        {/*The button for adding a tier to a voter  */}
                        <Typography component="h2"
                                    variant="h6"
                                    color="inherit"
                                    sx={{ mb: 5, ml: 0 }}>Voter tier management</Typography>
                        <Container maxWidth="lg" sx={{ mt: 5, mb: 5, ml: 0 }}>
                            <Grid container spacing={3}>
                                <TextField label='Voter address' id="tierAdderA" sx={{ width: '40%' }} value={input3} onChange={ e => setInput3(e.target.value)}></TextField>
                                <Grid item/>
                                <Button variant='contained' onClick={() => getVoterTier()}>Check Tier</Button>
                                <Grid item sx={{ width: '5%' }} />
                                <TextField label='Tier' id="tierAdderT" value={input4} onChange={ e => setInput4(e.target.value)}></TextField>
                                <Grid item/>
                                <Button variant='contained' disabled={votingState} onClick={_AddTier}>Add Tier</Button>
                            </Grid>
                            <Typography>{tierText} {tierLevel}</Typography>
                        </Container>
            </>) : <Typography>Please connect your wallet first.</Typography> }
            </TabPanel>
            </Box>
        </Box>
    </ThemeProvider>
);

}