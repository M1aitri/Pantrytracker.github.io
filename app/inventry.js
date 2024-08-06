'use client'; // Ensure this file is treated as a client component
import { useState, useEffect } from 'react';
import { firestore } from './firebase'; 
import { Box, Typography, Stack, Button } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';

// Component for Inventory Page
export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ overflow: 'hidden' }}
    >
      {/* Navigation and Header */}
      <Box width="100%" bgcolor="#121212" padding={2} textAlign="center">
        <Typography variant="h4" color="#00FFCC">Pantry Tracker</Typography>
      </Box>

      {/* Inventory Table */}
      <Stack width="100%" spacing={2} overflow="auto" padding={2}>
        {inventory.map(({ name, count }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#121212"
            padding={5}
            border="1px solid #333"
          >
            <Typography variant="h6" color="#00FFCC">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" color="#00FFCC">
              {count}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
} 
