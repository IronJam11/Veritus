import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

import { TrendingUp, TrendingDown, Music, Palette, Camera, Heart, Star, Play, Users, DollarSign, BarChart3, Activity, Mic, Video, BookOpen, Gamepad2 } from 'lucide-react';

const Trading3DChart = ({ isDarkMode = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const themeClasses = {
    bg: isDarkMode ? 'bg-gradient-to-br from-neutral-900 via-black to-neutral-800' : 'bg-gradient-to-br from-neutral-50 via-white to-neutral-100',
    cardBg: isDarkMode ? 'from-neutral-800/50 to-neutral-900/50' : 'from-white/50 to-neutral-100/50',
    text: isDarkMode ? 'text-white' : 'text-black',
    textMuted: isDarkMode ? 'text-neutral-400' : 'text-neutral-600',
    border: isDarkMode ? 'border-neutral-700' : 'border-neutral-300',
    accent: isDarkMode ? 'from-white to-neutral-300' : 'from-black to-neutral-700'
  };

  // Asset types that will be positioned around the graph
  const assetTypes = [
    { name: 'Music', icon: Music, color: 'text-pink-400', value: '$2.4M', change: '+12.3%' },
    { name: 'Art', icon: Palette, color: 'text-purple-400', value: '$1.8M', change: '+8.7%' },
    { name: 'Photography', icon: Camera, color: 'text-blue-400', value: '$1.2M', change: '+15.2%' },
    { name: 'Poetry', icon: BookOpen, color: 'text-green-400', value: '$890K', change: '+6.4%' },
    { name: 'Video', icon: Video, color: 'text-red-400', value: '$3.1M', change: '+22.1%' },
    { name: 'Podcast', icon: Mic, color: 'text-yellow-400', value: '$1.5M', change: '+9.8%' },
    { name: 'NFT', icon: Star, color: 'text-orange-400', value: '$2.8M', change: '+18.5%' },
    { name: 'Gaming', icon: Gamepad2, color: 'text-indigo-400', value: '$1.9M', change: '+11.2%' },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with enhanced performance
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(600, 600);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Creative asset data - representing different types of assets distributed around graph
    const assetData = [];
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0xff9ff3, 0x54a0ff, 0xe17055, 0x6c5ce7];

    // Main graph trajectory data
    for (let i = 0; i < 120; i++) {
      const angle = (i / 120) * Math.PI * 6;
      const radius = 8 + Math.sin(i * 0.08) * 4;
      const baseValue = Math.sin(i * 0.06) * 6;
      const noise = (Math.random() - 0.5) * 1.5;
      const trend = Math.sin(i * 0.04) * 3;

      assetData.push({
        x: Math.cos(angle) * radius,
        y: baseValue + noise + trend,
        z: Math.sin(angle) * radius,
        value: Math.random() * 8000 + 1000,
        popularity: Math.random() * 100 + 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        shares: Math.floor(Math.random() * 15000) + 2000
      });
    }

    // Main asset trajectory with dynamic colors and enhanced styling
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(assetData.length * 3);
    const lineColors = new Float32Array(assetData.length * 3);

    assetData.forEach((asset, index) => {
      linePositions[index * 3] = asset.x;
      linePositions[index * 3 + 1] = asset.y;
      linePositions[index * 3 + 2] = asset.z;

      const color = new THREE.Color(asset.color);
      lineColors[index * 3] = color.r;
      lineColors[index * 3 + 1] = color.g;
      lineColors[index * 3 + 2] = color.b;
    });

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 8,
      transparent: true,
      opacity: 0.9
    });

    const assetTrajectory = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(assetTrajectory);

    // Enhanced asset value bars around the graph
    const valueBars: THREE.Mesh[] = [];
    assetData.forEach((asset, index) => {
      if (index % 3 === 0) {
        const barHeight = (asset.value / 8000) * 8;
        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, barHeight, 12);
        const barMaterial = new THREE.MeshPhongMaterial({
          color: asset.color,
          transparent: true,
          opacity: 0.8,
          emissive: asset.color,
          emissiveIntensity: 0.15,
          shininess: 100
        });

        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.set(asset.x, -6 + (barHeight / 2), asset.z);
        bar.castShadow = true;
        bar.receiveShadow = true;
        valueBars.push(bar);
        scene.add(bar);
      }
    });

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(
      isDarkMode ? 0x302560 : 0x504080,
      isDarkMode ? 0.4 : 0.5
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(
      isDarkMode ? 0xffffff : 0x999999,
      isDarkMode ? 1.8 : 1.2
    );
    mainLight.position.set(25, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    scene.add(mainLight);

    // Multiple colored accent lights orbiting the scene
    interface LightUserData {
      originalAngle: number;
      index: number;
    }

    interface PointLightWithUserData extends THREE.PointLight {
      userData: LightUserData;
    }

    const accentLights: PointLightWithUserData[] = [];
    colors.forEach((color, index) => {
      const light = new THREE.PointLight(color, 0.6, 40);
      const angle = (index / colors.length) * Math.PI * 2;
      light.position.set(
        Math.cos(angle) * 20,
        Math.sin(index * 0.7) * 8,
        Math.sin(angle) * 20
      );
      light.userData = { originalAngle: angle, index: index };
      accentLights.push(light as PointLightWithUserData);
      scene.add(light);
    });

    // Enhanced circular grid system
    const mainGrid = new THREE.PolarGridHelper(
      25, 20, 12, 80,
      isDarkMode ? 0x444444 : 0x888888,
      isDarkMode ? 0x222222 : 0xbbbbbb
    );
    mainGrid.position.y = -8;
    scene.add(mainGrid);

    // Camera positioning for optimal graph viewing
    camera.position.set(30, 18, 30);
    camera.lookAt(0, 2, 0);

    // Enhanced animation loop
    let animationTime = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      animationTime += 0.006;

      // Smooth scene rotation to showcase the graph
      scene.rotation.y += 0.0015;

      // Animate value bars with the graph rhythm
      interface BarWithMaterial extends THREE.Mesh {
        material: THREE.MeshPhongMaterial;
      }

      const valueBarsTyped = valueBars as BarWithMaterial[];

      valueBarsTyped.forEach((bar, index) => {
        const offset = index * 0.15;
        bar.material.emissiveIntensity = 0.15 + Math.sin(animationTime * 3.5 + offset) * 0.12;
        bar.rotation.y += 0.008;

        // Slight height variation
        const scaleY = 1 + Math.sin(animationTime * 2 + offset) * 0.1;
        bar.scale.y = scaleY;
      });

      // Animate main trajectory with enhanced effects
      assetTrajectory.material.opacity = 0.85 + Math.sin(animationTime * 1.2) * 0.1;
      assetTrajectory.rotation.y += 0.001;

      // Dynamic accent lights creating atmosphere around graph
      accentLights.forEach((light, index) => {
        const userData = light.userData;
        const angle = animationTime * 0.4 + userData.originalAngle;
        const radius = 20 + Math.sin(animationTime * 0.8 + index) * 5;

        light.position.x = Math.cos(angle) * radius;
        light.position.z = Math.sin(angle) * radius;
        light.position.y = Math.sin(animationTime * 1.5 + index * 0.8) * 12;
        light.intensity = 0.6 + Math.sin(animationTime * 2.2 + index * 0.7) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(600, 600);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${themeClasses.bg} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}


        {/* Main Layout: Graph in Center with Asset Cards Around */}
        <div className="relative flex items-center justify-center">
          {/* Central 3D Graph */}
          <div className={`relative z-10 rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'shadow-white/10' : 'shadow-black/20'} border ${themeClasses.border}`}>
            <div ref={mountRef} className="w-[600px] h-[600px] bg-black/5" />

            {/* Live indicator on graph */}
            <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'} text-sm font-medium backdrop-blur-sm`}>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
              Live
            </div>
          </div>

          {/* Asset Type Cards Positioned Around Graph */}
          {assetTypes.map((asset, index) => {
            const angle = (index / assetTypes.length) * 2 * Math.PI;
            const radius = 350; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={asset.name}
                className={`absolute z-20 group cursor-pointer transition-all duration-300 hover:scale-110`}
                style={{
                  left: `calc(50% + ${x}px - 80px)`,
                  top: `calc(50% + ${y}px - 50px)`,
                }}
              >
                <div className={`p-4 rounded-xl bg-gradient-to-br ${themeClasses.cardBg} border ${themeClasses.border} backdrop-blur-sm hover:shadow-lg transition-all duration-300 w-40`}>
                  <div className="flex items-center gap-3 mb-2">
                    <asset.icon className={`w-5 h-5 ${asset.color}`} />
                    <div className={`text-sm font-semibold ${themeClasses.text}`}>
                      {asset.name}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${themeClasses.text} mb-1`}>
                    {asset.value}
                  </div>
                  <div className={`text-xs ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                    {asset.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {asset.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}

      </div>
    </div>
  );
};

export default Trading3DChart;