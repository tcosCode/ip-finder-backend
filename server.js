import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: "https://geeks-for-geeks-react-projects.vercel.app",
    methods: "GET, POST",
  })
);

// Configurar Helmet para CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://vercel.live"],
      },
    },
  })
);

const PORT = process.env.PORT || 3000;

app.get("/ip", async (req, res) => {
  const ip = req.query.ip || ""; // Lee la IP de la query string
  const endpoint = ip
    ? `http://ip-api.com/json/${ip}`
    : "http://ip-api.com/json/";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching IP data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
