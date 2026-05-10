"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RoadmapNode from "./RoadmapNode";
import {
  MousePointer2,
  Square,
  Type,
  Image as ImageIcon,
  ArrowRight,
  Shapes,
  Palette,
  Layers,
  Trash2,
  Undo2,
  Redo2,
  LayoutTemplate,
  Save,
  Download,
  Share2,
  Users,
  Eye,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "roadmapNode",
    position: { x: 250, y: 100 },
    data: {
      title: "Initialize Protocol",
      description: "Setup your environment and authenticate with the central network.",
      xp: 150,
      deadline: "2026-05-15",
      status: "completed",
      difficulty: "Easy",
    },
  },
  {
    id: "2",
    type: "roadmapNode",
    position: { x: 250, y: 350 },
    data: {
      title: "First Deployment",
      description: "Deploy the primary systems to the cloud infrastructure.",
      xp: 300,
      deadline: "2026-05-20",
      status: "in-progress",
      difficulty: "Medium",
    },
  },
  {
    id: "3",
    type: "roadmapNode",
    position: { x: -100, y: 600 },
    data: {
      title: "Security Audit",
      description: "Verify all endpoints and secure the perimeter.",
      xp: 500,
      deadline: "2026-06-01",
      status: "upcoming",
      difficulty: "Hard",
    },
  },
  {
    id: "4",
    type: "roadmapNode",
    position: { x: 600, y: 600 },
    data: {
      title: "Neural Integration",
      description: "Connect the AI modules to the central processing unit.",
      xp: 1000,
      deadline: "2026-06-15",
      status: "locked",
      difficulty: "Elite",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "var(--gold)", strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "var(--line)", strokeWidth: 2 } },
  { id: "e2-4", source: "2", target: "4", animated: true, style: { stroke: "var(--line)", strokeWidth: 2 } },
];

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "box", icon: Square, label: "Add Box" },
  { id: "text", icon: Type, label: "Add Text" },
  { id: "image", icon: ImageIcon, label: "Add Image" },
  { id: "arrow", icon: ArrowRight, label: "Connection" },
  { id: "shapes", icon: Shapes, label: "Shapes" },
  { id: "color", icon: Palette, label: "Color" },
  { id: "layers", icon: Layers, label: "Layers" },
];

export default function RoadmapCreatorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeTool, setActiveTool] = useState("select");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Authentication required");
        setIsPublishing(false);
        return;
      }

      const res = await fetch("/api/admin/roadmap/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ nodes, edges })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      
      alert("Roadmap successfully published to network!");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const updateNodeData = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return { ...n, data: { ...n.data, ...newData } };
        }
        return n;
      })
    );
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "var(--gold)", strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: "roadmapNode",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        title: "New Protocol",
        description: "Configure this node's parameters.",
        xp: 100,
        deadline: new Date().toISOString().slice(0, 10),
        status: "upcoming",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-0)]">
      <Sidebar />

      <main className="flex-1 lg:ml-64 relative flex flex-col h-full w-full">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[var(--line)] bg-[var(--bg-1)]/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black text-white font-orbitron uppercase tracking-widest flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-[var(--gold)]" />
              Roadmap Studio
            </h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-[var(--line)] text-[10px] font-black text-[var(--text-soft)] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Autosaved
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-[10px] font-black text-[var(--text-soft)] hover:text-white uppercase tracking-widest transition-colors">
              <Users className="w-4 h-4" /> Collab
            </button>
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-[10px] font-black text-[var(--text-soft)] hover:text-white uppercase tracking-widest transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <div className="w-[1px] h-4 bg-[var(--line)] mx-1 hidden sm:block" />
            <button className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-[var(--text-soft)] hover:text-white uppercase tracking-widest transition-colors border border-[var(--line)] bg-[var(--bg-0)]">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-[var(--bg-0)] bg-[var(--gold)] hover:bg-[var(--gold-light)] uppercase tracking-widest transition-colors shadow-[0_0_15px_var(--glow-gold)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isPublishing ? "Syncing..." : "Publish"}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 relative w-full h-full border-r border-[var(--line)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={(params) => {
              if (params.nodes.length > 0) setSelectedNodeId(params.nodes[0].id);
              else setSelectedNodeId(null);
            }}
            nodeTypes={nodeTypes}
            fitView
            className="bg-transparent"
            minZoom={0.2}
            maxZoom={4}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--line)" />
            <Controls className="bg-[var(--bg-1)] border-[var(--line)] fill-white shadow-xl" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.data?.color) return n.data.color as string;
                if (n.data?.status === 'completed') return 'var(--gold)';
                if (n.data?.status === 'in-progress') return 'var(--gold-muted)';
                if (n.data?.status === 'locked') return '#333';
                return 'var(--line)';
              }}
              maskColor="rgba(7, 13, 22, 0.8)"
              className="bg-[var(--bg-1)] border border-[var(--line)] shadow-xl"
            />
            
            {/* Left Toolbar */}
            <Panel position="top-left" className="m-4 lg:m-6">
              <div className="glass-panel border border-[var(--line)] p-2 flex flex-col gap-1 shadow-2xl">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      if (tool.id === "box") addNode();
                    }}
                    className={cn(
                      "p-3 flex items-center justify-center transition-all relative group",
                      activeTool === tool.id 
                        ? "bg-[var(--gold)]/10 text-[var(--gold)]" 
                        : "text-[var(--text-soft)] hover:text-white hover:bg-white/5"
                    )}
                    title={tool.label}
                  >
                    <tool.icon className="w-5 h-5" />
                    <div className="absolute left-full ml-3 px-2 py-1 bg-[var(--bg-1)] border border-[var(--line)] text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {tool.label}
                    </div>
                  </button>
                ))}
                
                <div className="w-full h-[1px] bg-[var(--line)] my-1" />
                
                <button className="p-3 text-[var(--text-soft)] hover:text-white hover:bg-white/5 transition-all">
                  <Undo2 className="w-5 h-5" />
                </button>
                <button className="p-3 text-[var(--text-soft)] hover:text-white hover:bg-white/5 transition-all">
                  <Redo2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={deleteSelectedNode}
                  disabled={!selectedNodeId}
                  className={cn(
                    "p-3 transition-all mt-1",
                    selectedNodeId ? "text-[#cc5555] hover:bg-[#cc5555]/10" : "text-gray-600 cursor-not-allowed"
                  )}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Properties Sidebar (Right) */}
        <div className="hidden xl:flex flex-col w-80 bg-[var(--bg-1)] border-l border-[var(--line)] h-full">
          <div className="p-5 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-widest mb-6 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[var(--gold)]" /> Node Properties
            </h3>
            
            {!selectedNode ? (
              <div className="text-[11px] text-[var(--text-soft)] font-medium leading-relaxed flex-1 flex items-center justify-center text-center border-2 border-dashed border-[var(--line)] p-6 bg-[var(--bg-0)]/50">
                Select a node on the canvas to configure its parameters, assign XP rewards, set deadlines, and define prerequisites.
              </div>
            ) : (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Node Title</label>
                      <input 
                        value={selectedNode.data.title as string}
                        onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2.5 px-3 text-white focus:border-[var(--gold)] outline-none text-xs font-bold transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Subtitle / Description</label>
                      <textarea 
                        value={selectedNode.data.description as string}
                        onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2.5 px-3 text-white focus:border-[var(--gold)] outline-none text-[11px] font-medium transition-colors resize-y min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">XP Reward</label>
                        <input 
                          type="number"
                          value={selectedNode.data.xp as number}
                          onChange={(e) => updateNodeData(selectedNode.id, { xp: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2 px-3 text-white focus:border-[var(--gold)] outline-none text-xs font-bold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Color Theme</label>
                        <input 
                          type="color"
                          value={(selectedNode.data.color as string) || "#d4af37"}
                          onChange={(e) => updateNodeData(selectedNode.id, { color: e.target.value })}
                          className="w-full h-[34px] bg-[var(--bg-0)]/80 border border-[var(--line)] p-0.5 cursor-pointer focus:border-[var(--gold)] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Status</label>
                      <select 
                        value={selectedNode.data.status as string}
                        onChange={(e) => updateNodeData(selectedNode.id, { status: e.target.value })}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2 px-3 text-white focus:border-[var(--gold)] outline-none text-xs font-bold transition-colors appearance-none"
                      >
                        <option value="locked">Locked</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Difficulty</label>
                      <select 
                        value={selectedNode.data.difficulty as string || "Medium"}
                        onChange={(e) => updateNodeData(selectedNode.id, { difficulty: e.target.value })}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2 px-3 text-white focus:border-[var(--gold)] outline-none text-xs font-bold transition-colors appearance-none"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Elite">Elite</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-1.5">Deadline</label>
                      <input 
                        type="date"
                        value={selectedNode.data.deadline as string || ""}
                        onChange={(e) => updateNodeData(selectedNode.id, { deadline: e.target.value })}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2 px-3 text-[var(--text-soft)] focus:text-white focus:border-[var(--gold)] outline-none text-xs font-bold transition-colors"
                      />
                    </div>

              </div>
            )}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
