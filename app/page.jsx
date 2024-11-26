'use client';

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";

const AnimatedButton = styled(Button)(({ theme, clicked }) => ({
  transition: "transform 0.3s",
  transform: clicked ? "scale(1.1)" : "scale(1)",
}));

const CodeContainer = styled("div")({
  display: "flex",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: "4px",
  overflow: "hidden",
});

const LineNumbers = styled("div")({
  backgroundColor: "#f0f0f0",
  padding: "10px",
  textAlign: "right",
  userSelect: "none",
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.5",
});

const CodeTextArea = styled("textarea")({
  border: "none",
  outline: "none",
  resize: "vertical",
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  padding: "10px",
  width: "100%",
  height: "300px",
});

export default function Home() {
  const [code, setCode] = useState("");
  const [clicked, setClicked] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(["1"]);

  useEffect(() => {
    const lines = code.split("\n").length;
    const newLineNumbers = Array.from({ length: lines }, (_, index) => index + 1);
    setLineNumbers(newLineNumbers);
  }, [code]);

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4">Compilador de Código C</Typography>

      <Box mt={2}>
        <Typography variant="h6">Escribe o sube tu código C</Typography>
        <Box mt={2}>
          <CodeContainer>
            <LineNumbers>
              {lineNumbers.map((number) => (
                <div key={number}>{number}</div>
              ))}
            </LineNumbers>
            <CodeTextArea
              value={code}
              onChange={handleInputChange}
              spellCheck="false"
            />
          </CodeContainer>
        </Box>
      </Box>

      <Box mt={2}>
        <input
          accept=".c"
          type="file"
          onChange={handleFileUpload}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <AnimatedButton
          variant="contained"
          color="primary"
          clicked={clicked ? 1 : 0}
          onClick={handleSubmitCode}
        >
          Enviar Código
        </AnimatedButton>
      </Box>

      
    </div>
  );
}
