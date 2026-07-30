import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Typography, Box, FormControl, InputLabel
} from '@mui/material';

const transactionsData = [
  { date: '25 JULY 12:30', amount: '-₦10', name: 'YOUTUBE', method: 'VISA **3254', category: 'SUBSCRIPTION' },
  { date: '26 JULY 15:00', amount: '-₦150', name: 'Reserved', method: 'Mastercard **2154', category: 'Shopping' },
  { date: '25 JULY 9:00', amount: '-₦80', name: 'Yaposhika', method: 'Mastercard **2154', category: 'Cafe and Restaurants' },
];

const TransactionsTable = () => {
  const [account, setAccount] = useState('All accounts');
  const [view, setView] = useState('See all');

  return (
    <Box sx={{ bgcolor: 'white', p: 4, width: '100%', boxShadow: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" fontStyle="italic">Recent Transactions</Typography>
        <Box ml={2} display="flex" gap={2}>
          <FormControl variant="outlined" size="small">
            <InputLabel>Account</InputLabel>
            <Select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              label="Account"
            >
              <MenuItem value="All accounts">All accounts</MenuItem>
              {/* Add more account options here if needed */}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small">
            <InputLabel>View</InputLabel>
            <Select
              value={view}
              onChange={(e) => setView(e.target.value)}
              label="View"
            >
              <MenuItem value="See all">See all</MenuItem>
              {/* Add more view options here if needed */}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 500 }} aria-label="transactions table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'red.300' }}>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Name</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionsData.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{transaction.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionsTable;