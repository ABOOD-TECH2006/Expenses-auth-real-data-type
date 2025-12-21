import { TextField } from "@mui/material";

interface ExpensesSearchProps {
  value: string;
  onChange: (val: string) => void;
}

const ExpensesSearch: React.FC<ExpensesSearchProps> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search by Title"
      variant="outlined"
      fullWidth
      sx={{
        mb: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "#ffffff",
          "&.Mui-focused fieldset": { borderColor: "#6a11cb" },
        },
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ExpensesSearch;
