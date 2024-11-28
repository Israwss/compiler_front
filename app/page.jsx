'use client';

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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

  const handleSubmitCode = async () => {
    setClicked(true);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("http://localhost:8000/compile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.details);
        console.log(data);
      } else {
        setError(data.detail || "Ocurrió un error al procesar el código.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
      setClicked(false);
    }
  };


  console.log(results?.execution_result?.program_output);



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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar Código"}
        </AnimatedButton>
      </Box>

      <Box mt={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {results && (
          <Box>
            {results.syntax_passed && (
              <Typography variant="h6" style={{ color: "green" }}>
                Análisis sintáctico pasado
              </Typography>
            )}

            {results.semantic_errors?.length > 0 && (
              <Alert severity="error">
                <Typography variant="h6">Errores Semánticos:</Typography>
                <ul>
                  {results.semantic_errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {results.syntax_passed && results.semantic_errors?.length === 0 && (
              <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Funciones</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre>{JSON.stringify(results.functions, null, 2)}</pre>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Símbolos</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre>{JSON.stringify(results.symbols, null, 2)}</pre>
                  </AccordionDetails>
                </Accordion>










                <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography>Programa Analizado</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <pre>
      {results?.execution_result?.program_output || "No hay datos para mostrar."}
    </pre>
  </AccordionDetails>
</Accordion>


              </>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}


