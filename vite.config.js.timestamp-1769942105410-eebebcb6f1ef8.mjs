// vite.config.js
import { defineConfig } from "file:///D:/ai-driver-safety-monitor/node_modules/vite/dist/node/index.js";
import react from "file:///D:/ai-driver-safety-monitor/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "mediapipe_workaround",
      transform(code, id) {
        if (id.includes("@mediapipe/face_mesh/face_mesh.js")) {
          return {
            code: code + "\nexports.FaceMesh = FaceMesh;\nexports.Facemesh = Facemesh;",
            map: null
          };
        }
        return null;
      }
    }
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1kcml2ZXItc2FmZXR5LW1vbml0b3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLWRyaXZlci1zYWZldHktbW9uaXRvclxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktZHJpdmVyLXNhZmV0eS1tb25pdG9yL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcIm1lZGlhcGlwZV93b3JrYXJvdW5kXCIsXHJcbiAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xyXG4gICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIkBtZWRpYXBpcGUvZmFjZV9tZXNoL2ZhY2VfbWVzaC5qc1wiKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY29kZTogY29kZSArIFwiXFxuZXhwb3J0cy5GYWNlTWVzaCA9IEZhY2VNZXNoO1xcbmV4cG9ydHMuRmFjZW1lc2ggPSBGYWNlbWVzaDtcIixcclxuICAgICAgICAgICAgbWFwOiBudWxsLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBleGNsdWRlOiBbXCJsdWNpZGUtcmVhY3RcIl0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVEsU0FBUyxvQkFBb0I7QUFDcFMsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixVQUFVLE1BQU0sSUFBSTtBQUNsQixZQUFJLEdBQUcsU0FBUyxtQ0FBbUMsR0FBRztBQUNwRCxpQkFBTztBQUFBLFlBQ0wsTUFBTSxPQUFPO0FBQUEsWUFDYixLQUFLO0FBQUEsVUFDUDtBQUFBLFFBQ0Y7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
