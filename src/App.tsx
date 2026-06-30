import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./createClient";

// Definisi interface agar TypeScript tidak komplain
interface Module {
  id: number;
  title: string;
  description: string;
  video_url: string;
  xp_reward: number;
}

function App() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        setLoading(true);
        // Mengambil data dari tabel modules yang kamu buat di Supabase
        const { data, error } = await supabase
          .from("modules")
          .select("*");

        if (error) {
          throw error;
        }

        if (data) {
          setModules(data as Module[]);
        }
      } catch (err) {
        console.error("Gagal mengambil data modul:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Eco-Guardians: Zona Belajar</h1>
      <hr />
      
      {loading ? (
        <p>Sedang memuat data dari Supabase...</p>
      ) : (
        <div>
          <p>Berhasil membaca <strong>{modules.length}</strong> modul dari database.</p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
            {modules.map((mod) => (
              <div key={mod.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", width: "300px" }}>
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <p style={{ color: "green", fontWeight: "bold" }}>+{mod.xp_reward} XP Reward</p>
                <a href={mod.video_url} target="_blank" rel="noreferrer">Tonton Video</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;