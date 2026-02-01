import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "mediapipe_workaround",
      transform(code, id) {
        if (id.includes("@mediapipe/face_mesh/face_mesh.js")) {
          return {
            code: code + "\nexports.FaceMesh = globalThis.FaceMesh;\nexports.Facemesh = globalThis.FaceMesh;",
            map: null,
          };
        }
        return null;
      },
    },
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
