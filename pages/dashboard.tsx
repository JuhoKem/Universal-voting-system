import Dashboard from "@/components/Dashboard";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function DashboardView({ serverData }: any) {
  if (true) {
    return (
      <Dashboard {...serverData} />
    );
  }

  return (
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
          >Not signed in, you need to <Link href="/">Login</Link>
        </Typography>
  )
}