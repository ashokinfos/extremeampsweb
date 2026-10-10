'use client';

import { DashboardContent } from '@/shared/layouts/home';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------

const ShippingPolicy = () => (
  <DashboardContent>
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shipping Policy
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Shipping Method"
              secondary="Orders are shipped and delivered through registered domestic courier companies and/or speed post only."
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText
              primary="Processing Time"
              secondary="Orders are delivered within 5 business days from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation, subject to courier company / post office norms."
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  </DashboardContent>
);

export default ShippingPolicy;
