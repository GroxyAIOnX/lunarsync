const { createBareServer } = require("@tomphttp/bare-server-node");
const express = require("express");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const path = require("path");

// Initialize once
let app;
let bare;
let initialized = false;

function initializeApp() {
  if (initialized) return;
  
  bare = createBareServer("/bare/");
  app = express();

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, "../../public")));
  app.use("/uv/", express.static(uvPath));

  // Error handler for 404s
  app.use((req, res) => {
    res.status(404);
    try {
      res.sendFile(path.join(__dirname, "../../public/404.html"));
    } catch (err) {
      res.send("<h1>404 - Not Found</h1>");
    }
  });

  initialized = true;
}

// Netlify Functions handler
exports.handler = async (event, context) => {
  initializeApp();

  // Handle the request through Express
  return new Promise((resolve, reject) => {
    // Set context to allow functions to complete
    context.callbackWaitsForEmptyEventLoop = false;

    // Create a mock response object
    const chunks = [];
    const res = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: "",
      _chunks: [],
      _headers: {},
      
      setHeader(name, value) {
        this._headers[name] = value;
      },
      
      end(data) {
        if (data) this._chunks.push(data);
        this.body = Buffer.concat(
          this._chunks.map(chunk => 
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
          )
        ).toString("utf8");
        
        this.headers = this._headers;
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
      
      write(data) {
        this._chunks.push(data);
        return true;
      },
      
      send(data) {
        if (typeof data === "object") {
          this.setHeader("Content-Type", "application/json");
          this.body = JSON.stringify(data);
        } else {
          this.body = data;
        }
        this.end();
      },
      
      status(code) {
        this.statusCode = code;
        return this;
      },
      
      sendFile(filepath) {
        try {
          const fs = require("fs");
          const content = fs.readFileSync(filepath, "utf8");
          this.send(content);
        } catch (err) {
          this.statusCode = 404;
          this.send("<h1>404 - Not Found</h1>");
        }
      },
    };

    try {
      app(
        {
          method: event.httpMethod,
          url: event.path,
          headers: event.headers,
          body: event.body,
        },
        res
      );
    } catch (err) {
      console.error("Error:", err);
      resolve({
        statusCode: 500,
        headers: { "Content-Type": "text/html" },
        body: "<h1>500 - Internal Server Error</h1>",
      });
    }
  });
};
