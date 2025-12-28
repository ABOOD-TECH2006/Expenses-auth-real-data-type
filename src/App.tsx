/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Skeleton,
  TextField,
  Button,
  keyframes,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

import ExpensesForm from "./Components/ExpensesForm";
import ExpensesTable from "./Components/ExpensesTable";

import { fetchExpenses } from "./redux/slices/expenses-slice";
import { authActions } from "./redux/slices/auth-slice";
import type { Expense } from "./redux/slices/expenses-slice";

// Typed Redux hooks
import { useAppDispatch, useAppSelector } from "./redux/hooks";

// Import main image
import MainImage from "./resources/Images/m1.png";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { expenses, loading } = useAppSelector((state) => state.expenses);

  const [fakeLoading, setFakeLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    dispatch(fetchExpenses());
    const timer = setTimeout(() => setFakeLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const isLoading = loading || fakeLoading;

  const filteredExpenses = useMemo<Expense[]>(() => {
    return expenses.filter((expense) =>
      expense.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [expenses, search]);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    dispatch(authActions.logout());
    toast.success("You have successfully logged out");
    navigate("/login", { replace: true });
  };

  // Bubble animation
  const rise = keyframes`
    0% { transform: translateY(0) scale(1); opacity: 0.4; }
    50% { opacity: 0.6; }
    100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
  `;

  const bubbles = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = 10 + Math.random() * 10;
    const opacity = 0.3 + Math.random() * 0.4;

    return (
      <Box
        key={i}
        sx={{
          position: "absolute",
          bottom: "-100px",
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: `rgba(255,255,255,${opacity})`,
          animation: `${rise} ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "linear-gradient(180deg, #e0eaff, #f0f4ff)",
        fontFamily: "Inter, Roboto, Poppins, sans-serif",
        p: { xs: 2, md: 0 },
      }}
    >
      <Toaster
        position="top-left"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.95rem",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: { style: { background: "#ffffffff", color: "#000" } },
          error: { style: { background: "#ff416c", color: "#fff" } },
        }}
      />
      {bubbles}

      {/* Logout */}
      <Box sx={{ position: "fixed", top: 20, right: 20, zIndex: 10 }}>
        <Button
          onClick={handleLogout}
          sx={{
            px: 2,
            py: 1.5,
            fontWeight: 400,
            fontSize: "0.8rem",
            letterSpacing: 1,
            borderRadius: 50,
            color: "#ffffff",
            background:
              "linear-gradient(135deg, #667eea, #764ba2, #6a11cb, #43cea2)",
            backgroundSize: "400% 400%",
            boxShadow:
              "0 6px 20px rgba(104, 76, 199, 0.5), 0 0 10px rgba(67, 206, 162, 0.4) inset",
            textTransform: "uppercase",
            transition: "all 0.4s ease",
            "&:hover": { filter: "brightness(1.1)" },
            "&:active": { filter: "brightness(1.05)" },
          }}
        >
          Sign Out
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Hero */}
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={4} mb={4}>
          <Box
            flex={1}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              minHeight: { xs: 150, sm: 200, md: 250 },
              width: "100%",
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{ height: { xs: 150, sm: 200, md: 250 }, minHeight: 150, borderRadius: 1 }}
              />
            ) : (
              // <h1>f45sf45sf</h1>
              <img src={MainImage} alt="Main Visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </Box>

          <Box
            flex={1}
            sx={{
              p: 2,
              borderLeft: { md: "4px solid #6776af" },
              minHeight: { xs: 100, sm: 150, md: 200 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="text"
                  sx={{
                    width: { xs: "100%", sm: "80%", md: "70%" },
                    height: { xs: 40, sm: 45, md: 50 },
                    mb: 1,
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: { xs: "100%", sm: "95%", md: "90%" },
                    height: { xs: 25, sm: 28, md: 30 },
                  }}
                />
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome to Expenses Manager
                </Typography>
                <Typography color="text.secondary">
                  Track your expenses in real-time using Firebase and Redux Toolkit.
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <ExpensesForm isloading={isLoading} />

        <TextField
          label="Search by Title"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3, backgroundColor: "#fff" } }}
        />

        <Box sx={{ overflowX: "auto" }}>
          <ExpensesTable Expenses={filteredExpenses} loading={isLoading} />
        </Box>
      </Container>
    </Box>
  );
};

export default App;
