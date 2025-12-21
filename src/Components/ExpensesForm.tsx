import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addExpenseFirebase } from "../redux/slices/expenses-slice";
import toast from "react-hot-toast";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";

interface ExpenseFormData {
  title: string;
  date: string;
  value: number;
  description: string;
}

interface ExpensesFormProps {
  isloading: boolean;
}

const ExpensesForm: React.FC<ExpensesFormProps> = ({ isloading }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormData>();

  const onSubmit: SubmitHandler<ExpenseFormData> = async (data) => {
    setLoading(true);
    try {
      await dispatch(addExpenseFirebase(data)).unwrap();
      toast.success("Expense added successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to add expense");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
    >
      {loading || isloading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("date", { required: "Date is required" })}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
          <TextField
            label="Value"
            type="number"
            {...register("value", { required: "Value is required", valueAsNumber: true })}
            error={!!errors.value}
            helperText={errors.value?.message}
          />
          <TextField
            label="Description"
            {...register("description", { required: "Description is required" })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <Button
            type="submit"
            sx={{ fontWeight: 600, fontSize: "20px" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default ExpensesForm;
