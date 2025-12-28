/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import ExpensesRow from "./ExpensesRowBody";

// Define TypeScript types for expense
export interface Expense {
  firebaseId: string;
  title: string;
  date: string;
  value: number;
  description: string;
  // add other fields if needed
}

interface ExpensesTableProps {
  Expenses: Expense[];
  loading: boolean;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ Expenses, loading }) => {
  return (
    <TableContainer
      component={Paper}
      elevation={6}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        minWidth: "600px",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ background: "linear-gradient(90deg, #6a11cb, #2575fc)" }}>
            {["Title", "Date", "Value", "Description", "Actions"].map((head) => (
              <TableCell
                key={head}
                sx={{
                  color: "#000",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  fontFamily: "Inter, Roboto, Poppins, sans-serif",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableCell key={i} sx={{ verticalAlign: "middle" }}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : Expenses.map((expense, index) => (
                <TableRow
                  key={expense.firebaseId}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <ExpensesRow expense={expense} />
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpensesTable;
