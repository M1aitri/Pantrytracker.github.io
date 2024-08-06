'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Stack, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FFCC',
    },
    secondary: {
      main: '#FF66B2',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
  typography: {
    h2: {
      fontFamily: 'monospace',
      fontSize: '3.5rem',
      fontWeight: 'bold',
      color: '#FF66B2',
      animation: 'typing 2s steps(40, end), blink-caret .75s step-end infinite',
    },
    h5: {
      fontSize: '1.5rem',
      color: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          input: {
            color: 'black',
          },
        },
      },
    },
  },
});

export default function Home() {
  const [Inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'));
    const docs = await getDocs(snapshot);
    const InventoryList = [];
    docs.forEach((doc) => {
      InventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(InventoryList);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = Inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        minHeight="200vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{ overflow: 'hidden', position: 'relative', bgcolor: 'background.default' }}
      >
        <Box
          component="nav"
          width="100vw"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="#121212"
          p={2}
          position="fixed"
          top={0}
          zIndex={1000}
        >
          <Typography variant="h5">Pantry Tracker</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary">Home</Button>
            <Button variant="contained" color="primary">About</Button>
            <Button variant="contained" color="primary">My Pantry</Button>
          </Stack>
        </Box>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#121212',
            }}
          >
            <Typography variant="h6" color="white">Add item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ input: { color: 'black' } }}
              />
              <Button 
                variant="contained" 
                onClick={() => {
                  if (itemName.trim()) {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          width="100%"
          height="50vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          sx={{ position: 'relative', overflow: 'hidden', mt: 8 }}
        >
          <Typography variant="h2" className="typing">
            Pantry Tracker
          </Typography>
          <Typography variant="h5">
            Start tracking now
          </Typography>
        </Box>

        <Box
          width="90%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search for an item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ bgcolor: 'white', input: { color: 'black' } }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ mt: 2 }}
        >
          Add New Item
        </Button>

        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Stack width="50%" spacing={2} overflow="auto" alignItems="center">
            {filteredInventory.map(({ name, count }) => (
              <Box
                key={name}
                width="90%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#121212"
                padding={5}
                border="1px solid #333"
              >
                <Typography variant="h6" color="#00FFCC" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#FFFFFF" textAlign="center">
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
      </Box>

      <style jsx global>{`
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #FF66B2; }
        }

        .typing {
          font-family: 'monospace';
          white-space: nowrap;
          overflow: hidden;
          border-right: 0.15em solid #FF66B2;
          animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
        }
      `}</style>
    </ThemeProvider>
  );
}