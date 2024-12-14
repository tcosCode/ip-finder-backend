import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Middleware para habilitar CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://geeks-for-geeks-react-projects.vercel.app"
        : "*",
    methods: "GET, POST",
  })
);

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://vercel.live"],
        scriptSrcElem: ["'self'", "https://vercel.live"], // Allow scripts in <script> elements
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "https://ip-api.com"],
        // Add other directives if necessary
      },
    },
  })
);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the IP Finder Backend");
});

app.get("/ip", async (req, res) => {
  const ip = req.query.ip || "";
  const isValidIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip); // Validación básica de IP

  const endpoint = isValidIp
    ? `http://ip-api.com/json/${ip}`
    : "http://ip-api.com/json/";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching IP data:", error.message);
    res
      .status(500)
      .json({ error: "Error fetching IP data", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
