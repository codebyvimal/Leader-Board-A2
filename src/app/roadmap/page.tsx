"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { getCurrentProfile, getRoadmapNodes, getRoadmapEdges } from "@/lib/data";
import { Zap, Rocket } from "lucide-react";
import { ReactFlow, MiniMap, Background, BackgroundVariant, Controls, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RoadmapNode from "../admin/roadmap-creator/RoadmapNode";

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export default function RoadmapPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [xp, setXp] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [dbNodes, dbEdges, profile] = await Promise.all([
        getRoadmapNodes(),
        getRoadmapEdges(),
        getCurrentProfile()
      ]);

      if (profile) setXp(profile.xp || 0);

      const flowNodes = dbNodes.map((n: any) => ({
        id: n.id,
        type: "roadmapNode",
        position: { x: n.position_x, y: n.position_y },
        data: {
          title: n.title,
          description: n.description,
          xp: n.xp_reward,
          difficulty: n.difficulty,
          status: n.status,
          deadline: n.deadline,
          color: n.color_theme
        }
      }));

      const flowEdges = dbEdges.map((e: any) => ({
        id: e.id,
        source: e.source_node_id,
        target: e.target_node_id,
        animated: e.animated,
        style: e.color ? { stroke: e.color, strokeWidth: 2 } : { stroke: "var(--gold)", strokeWidth: 2 }
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[var(--bg-0)]">
      <Sidebar />
      <main className="dashboard-main flex flex-col p-0! h-screen">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-4 lg:p-8 border-b border-[var(--line)] bg-[var(--bg-1)]/80 backdrop-blur-xl z-40 shrink-0">
          <div>
            <p className="text-[var(--gold)] font-black tracking-[0.3em] text-[10px] mb-2 uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 fill-[var(--gold)]" />
              Elite Protocol
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white font-orbitron uppercase">
              Mission Roadmap
            </h1>
            <p className="text-[var(--text-soft)] text-xs font-medium max-w-2xl leading-relaxed mt-2 hidden sm:block">
              Navigate the interactive network. Complete protocols to earn XP and advance your rank.
            </p>
          </div>
          <div className="flex items-center gap-3 glass-panel p-2 lg:p-3 border border-[var(--line)]">
            <div className="w-8 h-8 lg:w-10 lg:h-10 hud-chip flex items-center justify-center shrink-0 border border-[var(--gold)]/30">
              <span className="text-[var(--gold)] font-black text-[10px] lg:text-sm font-orbitron">XP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-black text-white leading-none font-orbitron">{xp}</span>
              <span className="text-[8px] text-[var(--text-soft)] uppercase tracking-[0.2em] mt-0.5 font-black">Network XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full h-full relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full" />
            </div>
          ) : nodes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Rocket className="w-16 h-16 text-[var(--line)] mb-4" />
              <h2 className="text-xl font-black text-white font-orbitron uppercase tracking-widest mb-2">No Protocols Found</h2>
              <p className="text-[var(--text-soft)] text-sm max-w-sm">The central command has not deployed any roadmap nodes yet. Check back later.</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
              onNodeClick={(_, node) => {
                if (node.data.status !== "locked") {
                  setSelectedTask({
                    id: node.id,
                    title: node.data.title,
                    description: node.data.description,
                    xp: node.data.xp,
                    status: node.data.status,
                    deadline: node.data.deadline,
                  });
                  setIsModalOpen(true);
                }
              }}
              className="bg-transparent"
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--line)" />
              <Controls className="bg-[var(--bg-1)] border-[var(--line)] fill-white shadow-xl" showInteractive={false} />
              <MiniMap 
                nodeColor={(n) => {
                  if (n.data?.color) return n.data.color as string;
                  if (n.data?.status === 'completed') return 'var(--gold)';
                  if (n.data?.status === 'in-progress') return 'var(--gold-muted)';
                  if (n.data?.status === 'locked') return '#333';
                  return 'var(--line)';
                }}
                maskColor="rgba(7, 13, 22, 0.8)"
                className="bg-[var(--bg-1)] border border-[var(--line)] shadow-xl hidden sm:block"
              />
            </ReactFlow>
          )}
        </div>
      </main>
      
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(taskId, url) => console.log(`Proof for ${taskId}: ${url}`)}
      />
    </div>
  );
}
