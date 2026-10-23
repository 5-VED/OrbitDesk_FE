import React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import MuiSelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  disabled = false,
  required = false,
  className = "",
  id,
  suffix,
  sx = {},
  ...props
}) {
  const inputId =
    id ||
    (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
  const hasError = Boolean(error);

  return (
    <FormControl
      fullWidth
      error={hasError}
      disabled={disabled}
      required={required}
      className={`input-wrapper ${className}`}
      sx={{ mb: 2, ...sx }}
    >
      {label && (
        <FormLabel
          htmlFor={inputId}
          sx={{ mb: 0.75, fontSize: "0.875rem", fontWeight: 500 }}
        >
          {label}
        </FormLabel>
      )}
      <OutlinedInput
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        size="small"
        startAdornment={
          Icon ? (
            <InputAdornment position="start">
              <Icon size={18} style={{ opacity: 0.7 }} />
            </InputAdornment>
          ) : null
        }
        endAdornment={
          suffix ? (
            <InputAdornment position="end">{suffix}</InputAdornment>
          ) : null
        }
        sx={{
          borderRadius: 1,
          "& input": { py: 1.25 },
        }}
        {...props}
      />
      {(error || hint) && (
        <FormHelperText sx={{ mt: 0.5, mx: 0 }}>{error || hint}</FormHelperText>
      )}
    </FormControl>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  rows = 4,
  className = "",
  id,
  sx = {},
  ...props
}) {
  const inputId =
    id ||
    (label
      ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`
      : undefined);
  const hasError = Boolean(error);

  return (
    <FormControl
      fullWidth
      error={hasError}
      disabled={disabled}
      required={required}
      className={`input-wrapper ${className}`}
      sx={{ mb: 2, ...sx }}
    >
      {label && (
        <FormLabel
          htmlFor={inputId}
          sx={{ mb: 0.75, fontSize: "0.875rem", fontWeight: 500 }}
        >
          {label}
        </FormLabel>
      )}
      <OutlinedInput
        id={inputId}
        multiline
        rows={rows}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        size="small"
        sx={{
          borderRadius: 1,
        }}
        {...props}
      />
      {(error || hint) && (
        <FormHelperText sx={{ mt: 0.5, mx: 0 }}>{error || hint}</FormHelperText>
      )}
    </FormControl>
  );
}

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  error,
  hint,
  disabled = false,
  required = false,
  className = "",
  id,
  sx = {},
  ...props
}) {
  const inputId =
    id ||
    (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
  const hasError = Boolean(error);

  return (
    <FormControl
      fullWidth
      error={hasError}
      disabled={disabled}
      required={required}
      className={`input-wrapper ${className}`}
      sx={{ mb: 2, ...sx }}
    >
      {label && (
        <FormLabel
          htmlFor={inputId}
          sx={{ mb: 0.75, fontSize: "0.875rem", fontWeight: 500 }}
        >
          {label}
        </FormLabel>
      )}
      <MuiSelect
        id={inputId}
        value={value ?? ""}
        onChange={onChange}
        displayEmpty
        size="small"
        sx={{
          borderRadius: 1,
          "& .MuiSelect-select": { py: 1.25 },
        }}
        renderValue={(selected) => {
          if (selected === "" || selected === undefined || selected === null) {
            return (
              <Box component="span" sx={{ color: "text.tertiary" }}>
                {placeholder}
              </Box>
            );
          }
          const match = options.find(
            (opt) => String(opt.value) === String(selected),
          );
          return match ? match.label : selected;
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem value="">
            <Box component="span" sx={{ color: "text.tertiary" }}>
              {placeholder}
            </Box>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {(error || hint) && (
        <FormHelperText sx={{ mt: 0.5, mx: 0 }}>{error || hint}</FormHelperText>
      )}
    </FormControl>
  );
}
