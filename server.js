const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set these in Render Environment Variables.
// Do NOT commit the real flag or production token to GitHub.
const REAL_FLAG = process.env.REAL_FLAG;
const WEBFALL_TOKEN = process.env.WEBFALL_TOKEN || "webfall";

// ---------------------------------------------------------------------------
// CTF INTENTIONAL VULNERABILITY
// This merge function is deliberately unsafe for the challenge.
// A contestant can reach it through POST /api/thread and pollute
// Object.prototype using a JSON "__proto__" property.
// ---------------------------------------------------------------------------
function unsafeMerge(target, source) {
  if (!source || typeof source !== "object") return target;

  for (const key of Object.keys(source)) {
    const value = source[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // INTENTIONAL: do not use Object.create(null) or hasOwnProperty guards.
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      unsafeMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

const relayState = {
  meta: {
    node: "WF-7",
    phase: "dormant"
  }
};

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Normal-looking endpoint used by the frontend.
app.get("/api/pulse", (req, res) => {
  res.set("X-WebFall-Trace", "WF/7");
  res.json({
    status: "nominal",
    relay: "quiet",
    trace: "7f-2a"
  });
});

// Decoy endpoint. It looks interesting but is not the intended route.
app.get("/api/thread/status", (req, res) => {
  res.json({
    status: "sealed",
    message: "Thread telemetry is restricted."
  });
});

// ---------------------------------------------------------------------------
// Intended vulnerability sink.
// The response deliberately does not tell contestants that pollution worked.
// ---------------------------------------------------------------------------
app.post("/api/thread", (req, res) => {
  unsafeMerge(relayState, req.body);

  res.set("X-WebFall-Trace", "WF/7");
  res.status(202).json({
    accepted: true,
    message: "Relay mutation queued."
  });
});

// A subtle diagnostic endpoint. It is useful only after contestants discover it.
app.get("/internal/echo", (req, res) => {
  const probe = {};

  res.json({
    inherited: probe.isAdmin === true,
    phase: relayState.phase,
    checksum: "WF-7"
  });
});

// A second decoy that prevents simply guessing the final route.
app.get("/api/omega", (req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "No omega relay is registered."
  });
});

// Final gate. It requires BOTH the polluted inherited property and the
// token discovered through the challenge's encoded clue.
app.get("/api/node", (req, res) => {
  const session = {};

  if (session.isAdmin !== true) {
    return res.status(403).json({
      status: "LOCKED",
      message: "Relay authorization missing."
    });
  }

  if (req.query.token !== WEBFALL_TOKEN) {
    return res.status(401).json({
      status: "DENIED",
      message: "Invalid relay token."
    });
  }

  if (!REAL_FLAG) {
    return res.status(500).json({
      status: "MISCONFIGURED",
      message: "Challenge operator has not configured REAL_FLAG."
    });
  }

  return res.json({
    status: "WEBFALL_UNLOCKED",
    flag: REAL_FLAG
  });
});

// robots.txt is intentionally generated server-side.
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(
`User-agent: *
Disallow: /signal-cache/
Disallow: /api/thread/status

# The old archive was never meant to be indexed.
`
  );
});

// Hidden-but-discoverable archive clue.
// The token is encoded rather than written plainly.
// /api/thread and /internal/echo are encoded too.
app.get("/signal-cache/manifest.json", (req, res) => {
  res.json({
    archive: "WF7",
    relay: "L2FwaS90aHJlYWQ=",
    diagnostic: "L2ludGVybmFsL2VjaG8=",
    terminal: "L2FwaS9ub2Rl",
    key: "d2ViZmFsbA==",
    note: "base64 fields are legacy relay labels"
  });
});

// Catch-all: serve the frontend.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`CATACLYSM // WEBFALL listening on port ${PORT}`);
});