import { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
} from "lucide-react";

import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Card, CardContent } from "../Components/Card";

const Index = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // CONNECT TO BACKend
  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setAnalyzing(true);

    try {
      const res = await fetch("https://phishing-url-detector-4.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log("API Response",data);

      const prob = Number(data.probability) || 0;

      //  Convert backend response → UI format
      let level = "safe";

       if (data.prediction === "Phishing") {
             level = "dangerous";
       } else if (prob > 0.5) {
            level = "warning";
       }
      
        const flags = data.flags && data.flags.length > 0
          ? data.flags
          : ["No suspicious patterns detected"];

      setResult({
        level: level,
        score: Math.round(prob * 100),
        flags: flags,
      });

      setUrl("");

    } catch (err) {
      console.error("Error:", err);
      alert("Backend connection failed!");
    }

    setAnalyzing(false);
  };

  const resultConfig = result
    ? {
        safe: {
          icon: ShieldCheck,
          label: "Safe",
          desc: "This URL appears to be legitimate.",
          colorClass: "text-green-500",
          glowClass: "border-green-300",
          bgClass: "bg-green-100 dark:bg-green-900",
        },
        warning: {
          icon: AlertTriangle,
          label: "Suspicious",
          desc: "This URL has some suspicious characteristics.",
          colorClass: "text-yellow-500",
          glowClass: "border-yellow-300",
          bgClass: "bg-yellow-100 dark:bg-yellow-900",
        },
        dangerous: {
          icon: ShieldAlert,
          label: "Dangerous",
          desc: "This URL is likely a phishing attempt!",
          colorClass: "text-red-500",
          glowClass: "border-red-300",
          bgClass: "bg-red-100 dark:bg-red-900",
        },
      }[result.level]
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white text-black dark:bg-gray-900 dark:text-white transition-all">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Shield className="w-10 h-10 text-blue-600" />
        <h1 className="text-4xl font-bold tracking-tight">PhishGuard</h1>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-center mb-10 max-w-md">
        Paste any URL below to instantly check if it's a phishing attempt.
      </p>

      {/* Input */}
      <div className="w-full max-w-xl flex gap-3 mb-10">
        <Input
          placeholder="https://example.com/login"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />

        <Button onClick={handleAnalyze} disabled={!url.trim() || analyzing}>
          <Search className="w-4 h-4" />
          {analyzing ? "Scanning…" : "Scan"}
        </Button>
      </div>

      {/* Result */}
      {result && resultConfig && (
        <Card className={`w-full max-w-xl border ${resultConfig.glowClass} bg-white dark:bg-gray-800`}>
          <CardContent className="pt-6 space-y-5">
            
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${resultConfig.bgClass}`}>
                <resultConfig.icon
                  className={`w-8 h-8 ${resultConfig.colorClass}`}
                />
              </div>

              <div>
                <h2 className={`text-2xl font-bold ${resultConfig.colorClass}`}>
                  {resultConfig.label}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {resultConfig.desc}
                </p>
              </div>

              <div className="ml-auto text-right">
                <span className={`text-3xl font-bold ${resultConfig.colorClass}`}>
                  {result.score}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Risk Score
                </p>
              </div>
            </div>

            {/* Risk bar */}
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full ${
                  result.level === "safe"
                    ? "bg-green-500"
                    : result.level === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* Flags */}
            {result.flags && result.flags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm uppercase text-grey-500 dark:text-gray-400 font-bold">
                Why this URL is suspicious?
              </p>

              {result.flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-2 text-sm font-semibold">
                  <ExternalLink className="w-4.5 h-4.5 mt-0.5 text-red-500 " />
                  {flag}
                </div>
              ))}
            </div>
            )}

            {/* {result.flags.length === 0 && (
              <p className="text-sm text-green-400">
                No suspicious patterns detected
              </p>
            )} */}

          </CardContent>
        </Card>
      )}

      <p className="mt-12 text text-gray-500 dark:text-gray-400 text-center max-w-sm">
        AI-driven phishing detection using advanced URL analysis to enhance cybersecurity awareness.
      </p>
    </div>
  );
};

export default Index;