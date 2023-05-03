import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";


export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(false);

  if (session) {
    router.push("/dashboard");
  }

  return (
    <>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
        >Not signed in
      </Typography>
      
      <Button onClick={() => setSession(!session)}>Sign in</Button>
    </>
  );
}
