import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function PropertyViewer3D() {
  const API_URL = import.meta.env.VITE_API_URL;
  const SERVER_URL = API_URL.replace("/api", "");
  const mountRef = useRef(null);
  const sectionRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);

  // ── Intersection Observer ─────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Three.js ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isVisible || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);


    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(1, 2, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8080ff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.5, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Floor grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x333355, 0x222244);
    scene.add(gridHelper);

    // Load GLB
    const loader = new GLTFLoader();
    loader.load(
      `${SERVER_URL}/uploads/model/scene.gltf`,
      (gltf) => {
        const model = gltf.scene;

        // Center and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y = 0;

        model.traverse(node => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        scene.add(model);
        setIsLoaded(true);
        setLoadError(false);
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (error) => {
        console.error("Failed to load scene.glb:", error);
        setLoadError(true);
        setIsLoaded(true);
      }
    );

    // Animate
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="w-full rounded-2xl overflow-hidden bg-gray-950 aspect-[16/7] relative  border shadow-sm border-gray-100">

      {/* Three.js mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Before visible — scroll prompt */}
      {!isVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">Scroll down to load 3D view</p>
        </div>
      )}

      {/* Loading progress */}
      {isVisible && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-950/90 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-6 h-6">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium mb-2">Loading 3D Model...</p>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-white/40 text-xs mt-1">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {isLoaded && loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-950/80 pointer-events-none">
          <p className="text-white/60 text-sm">Failed to load 3D model.</p>
          <p className="text-white/30 text-xs">Make sure scene.glb is in your uploads folder.</p>
        </div>
      )}

      {/* Controls hint */}
      {isLoaded && !loadError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none">
          <span className="text-white/60 text-xs flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
            Drag to rotate
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/60 text-xs">Scroll to zoom</span>
        </div>
      )}

      {/* Top label */}
      {isLoaded && !loadError && (
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <p className="text-white text-xs font-medium">3D Property Tour</p>
        </div>
      )}
    </div>
  );
}