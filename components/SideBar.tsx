import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { signOut, useSession } from 'next-auth/react';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

//styled(Component, [options])(styles) => Component

const AppBar = styled(MuiAppBar, { 
    shouldForwardProp: (prop) => prop !== 'open' 
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function SideBar() {
    const [open, setOpen] = React.useState(true);
    const [metamask, setMetamask] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState(null);
    const { data: session } = useSession({ required: true });

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const connectWallet = async () => {
        if (!metamask) {
            console.log("not connected");
            return;
        }
        try {
            const { ethereum }: any = window;
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccountAddress(accounts[0]);
            const bal = await provider.getBalance(accounts[0]);
            console.log(bal)
            setIsConnected(true);
        } catch (err) {
            console.error(err);
            setIsConnected(false);
        }

    };

    useEffect(() => {
        const { ethereum }: any = window;
        const checkAvailability = async () => {
            console.log("checking metamask availability")
            if (!ethereum) {
                setMetamask(false);
            }
            setMetamask(true);
            if (!provider) {
                setProvider(new ethers.BrowserProvider(ethereum));
            }
        }
        checkAvailability();
    }, [provider]);

    return (
        <>
            <AppBar position="absolute" open={open}>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}><MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                        >Dashboard - {accountAddress} - {session && session.user.email}
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                    >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton onClick={async () => await connectWallet() } >
                            <ListItemIcon>
                                <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <ListItemText primary="Link wallet" />
                        </ListItemButton>
                        <ListItemButton onClick={() => session ? signOut() : console.log("not signed in..")}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </>
                    <Divider sx={{ my: 1 }} />
                </List>
            </Drawer>
        </>
    );
}