'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface Feature {
  id: string
  name: string
  status: string
  priority: string
  blockedBy: string[]
  blocking: string[]
  category: string
}

interface DependencyGraphProps {
  features: Feature[]
  onFeatureClick?: (featureId: string) => void
}

const statusColors = {
  planning: '#94a3b8',
  'in-progress': '#3b82f6',
  completed: '#22c55e',
  blocked: '#ef4444',
  review: '#f59e0b',
}

const priorityBorder = {
  critical: '4px solid #dc2626',
  high: '3px solid #f97316',
  medium: '2px solid #eab308',
  low: '1px solid #64748b',
}

export default function DependencyGraph({ features, onFeatureClick }: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  useEffect(() => {
    if (features.length === 0) return

    // Create nodes
    const newNodes: Node[] = features.map((feature, index) => {
      const col = index % 4
      const row = Math.floor(index / 4)
      
      return {
        id: feature.id,
        type: 'default',
        position: { x: col * 300, y: row * 200 },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-sm mb-1">{feature.name}</div>
              <div className="text-xs text-slate-600">
                {feature.category} • {feature.priority}
              </div>
            </div>
          ),
        },
        style: {
          background: statusColors[feature.status as keyof typeof statusColors] || '#94a3b8',
          border: priorityBorder[feature.priority as keyof typeof priorityBorder] || '1px solid #64748b',
          borderRadius: '8px',
          padding: '12px',
          width: 200,
          color: feature.status === 'completed' ? '#000' : '#fff',
          cursor: 'pointer',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    })

    // Create edges from dependencies
    const newEdges: Edge[] = []
    features.forEach((feature) => {
      feature.blockedBy?.forEach((depId) => {
        // Only create edge if both nodes exist
        if (features.find(f => f.id === depId)) {
          newEdges.push({
            id: `${depId}-${feature.id}`,
            source: depId,
            target: feature.id,
            type: 'smoothstep',
            animated: feature.status === 'blocked',
            style: {
              stroke: feature.status === 'blocked' ? '#ef4444' : '#64748b',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: feature.status === 'blocked' ? '#ef4444' : '#64748b',
            },
          })
        }
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [features, setNodes, setEdges])

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onFeatureClick) {
        onFeatureClick(node.id)
      }
    },
    [onFeatureClick]
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const feature = features.find(f => f.id === node.id)
            return feature ? statusColors[feature.status as keyof typeof statusColors] || '#94a3b8' : '#94a3b8'
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  )
}
