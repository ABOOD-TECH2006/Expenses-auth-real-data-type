/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React from "react";
import { TableCell, IconButton, Tooltip, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import { useAppDispatch } from "../redux/hooks";
import { deleteExpenseFirebase, updateExpenseFirebase } from "../redux/slices/expenses-slice";

export interface Expense {
  firebaseId: string;
  title: string;
  date: string;
  value: number;
  description: string;
}

interface ExpensesRowProps {
  expense: Expense;
}

const ExpensesRow: React.FC<ExpensesRowProps> = ({ expense }) => {
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete expense?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      await dispatch(deleteExpenseFirebase(expense.firebaseId));
      toast.success("Expense deleted");
    }
  };

  const handleEdit = async () => {
    const { value: updates } = await Swal.fire({
      title: "Edit Expense",
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        ">
          <input id="title" class="swal2-input" value="${expense.title}" />
          <input id="date" type="date" class="swal2-input" value="${expense.date}" />
          <input id="value" type="number" class="swal2-input" value="${expense.value}" />
          <input id="description" class="swal2-input" value="${expense.description}" />
        </div>
      `,
      preConfirm: () => ({
        title: (document.getElementById("title") as HTMLInputElement).value,
        date: (document.getElementById("date") as HTMLInputElement).value,
        value: +(document.getElementById("value") as HTMLInputElement).value,
        description: (document.getElementById("description") as HTMLInputElement).value,
      }),
      showCancelButton: true,
    });

    if (updates) {
      await dispatch(
        updateExpenseFirebase({
          firebaseId: expense.firebaseId,
          updatedExpense: updates,
        })
      );
      toast.success("Expense updated");
    }
  };

  return (
    <>
      <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{expense.title}</TableCell>
      <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{expense.date}</TableCell>
      <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{expense.value}</TableCell>
      <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>{expense.description}</TableCell>
      <TableCell sx={{ textAlign: "center", verticalAlign: "middle" }}>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title="Edit">
            <IconButton
              onClick={handleEdit}
              color="primary"
              sx={{
                "&:hover": {
                  background: "rgba(106,17,203,0.1)",
                  boxShadow: "0 6px 15px rgba(106,17,203,0.2)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={handleDelete}
              color="error"
              sx={{
                "&:hover": {
                  background: "rgba(255,0,0,0.1)",
                  boxShadow: "0 6px 15px rgba(255,0,0,0.2)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </>
  );
};

export default ExpensesRow;
