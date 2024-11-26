import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

const navitems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
export default function AppbarGlobal() {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Image src="/logo.jpg" alt="logo" width={50} height={50} style={{ borderRadius: '50%', marginRight: '16px' }}/>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          href="/"
          sx={{
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            color: "inherit",
            letterSpacing: ".2rem",
          }}
        >
          SamuraiSword
        </Typography>
        <Box sx={{ ml: "auto", display: { xs: "block" } }}>
          {navitems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              color="inherit"
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
