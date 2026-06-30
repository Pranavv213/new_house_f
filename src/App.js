import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    area: "",
    bedrooms: "",
    bathrooms: "",
    house_age: "",
    distance_from_city: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      name: "area",
      label: "Area",
      placeholder: "1900",
      unit: "sq ft"
    },
    {
      name: "bedrooms",
      label: "Bedrooms",
      placeholder: "3",
      unit: "rooms"
    },
    {
      name: "bathrooms",
      label: "Bathrooms",
      placeholder: "2",
      unit: "baths"
    },
    {
      name: "house_age",
      label: "House Age",
      placeholder: "5",
      unit: "years"
    },
    {
      name: "distance_from_city",
      label: "Distance From City",
      placeholder: "4",
      unit: "km"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setPrediction(null);
    setError("");

    const hasEmptyField = Object.values(formData).some((value) => value === "");

    if (hasEmptyField) {
      setError("Please fill all fields before predicting.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://34.56.128.113:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          area: Number(formData.area),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          house_age: Number(formData.house_age),
          distance_from_city: Number(formData.distance_from_city)
        })
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch (err) {
      setError("Could not get prediction. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.left}>
          <div style={styles.badge}>Smart Real Estate AI</div>

          <h1 style={styles.title}>
            Estimate your home value with richer property data.
          </h1>

          <p style={styles.subtitle}>
            Add area, bedrooms, bathrooms, property age, and distance from city
            to generate a machine learning price estimate.
          </p>

          <div style={styles.stats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>5</span>
              <span style={styles.statLabel}>Input Features</span>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statNumber}>AI</span>
              <span style={styles.statLabel}>Neural Network</span>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statNumber}>Live</span>
              <span style={styles.statLabel}>FastAPI Result</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <p style={styles.cardKicker}>Prediction Panel</p>
            <h2 style={styles.cardTitle}>House Price Predictor</h2>
          </div>

          <form onSubmit={handlePredict} style={styles.form}>
            {fields.map((field) => (
              <label key={field.name} style={styles.field}>
                <span style={styles.label}>{field.label}</span>

                <div style={styles.inputWrap}>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    style={styles.input}
                    min="0"
                  />
                  <span style={styles.unit}>{field.unit}</span>
                </div>
              </label>
            ))}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Predict Price"}
            </button>
          </form>

          {error && <div style={styles.error}>{error}</div>}

          {prediction !== null && (
            <div style={styles.result}>
              <p style={styles.resultLabel}>Estimated Price</p>
              <div style={styles.resultValue}>{prediction} lakhs</div>
              <p style={styles.resultHint}>
                Based on the five property features you entered.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at top left, #dbeafe 0, transparent 32%), radial-gradient(circle at bottom right, #ccfbf1 0, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  shell: {
    width: "100%",
    maxWidth: "1120px",
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: "36px",
    alignItems: "center"
  },
  left: {
    padding: "20px"
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(37, 99, 235, 0.1)",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: "22px"
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "54px",
    lineHeight: 1,
    maxWidth: "680px"
  },
  subtitle: {
    margin: "24px 0 0",
    color: "#475569",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "560px"
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginTop: "36px",
    maxWidth: "560px"
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    backdropFilter: "blur(18px)"
  },
  statNumber: {
    display: "block",
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: 900,
    marginBottom: "6px"
  },
  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  card: {
    background: "rgba(255, 255, 255, 0.86)",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: "30px",
    boxShadow: "0 30px 100px rgba(15, 23, 42, 0.18)",
    padding: "34px",
    backdropFilter: "blur(24px)"
  },
  cardHeader: {
    marginBottom: "24px"
  },
  cardKicker: {
    margin: "0 0 8px",
    color: "#0891b2",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  cardTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "30px",
    lineHeight: 1.15
  },
  form: {
    display: "grid",
    gap: "16px"
  },
  field: {
    display: "grid",
    gap: "8px"
  },
  label: {
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "18px",
    padding: "0 16px",
    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)"
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "15px 0",
    fontSize: "16px",
    color: "#0f172a",
    background: "transparent"
  },
  unit: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap"
  },
  button: {
    marginTop: "6px",
    border: "none",
    borderRadius: "18px",
    padding: "17px 20px",
    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 900,
    boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)"
  },
  error: {
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: 700
  },
  result: {
    marginTop: "24px",
    padding: "24px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
    color: "#ffffff",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)"
  },
  resultLabel: {
    margin: 0,
    color: "#a5f3fc",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  resultValue: {
    marginTop: "10px",
    fontSize: "42px",
    fontWeight: 950,
    lineHeight: 1
  },
  resultHint: {
    margin: "12px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5
  }
};

export default App;