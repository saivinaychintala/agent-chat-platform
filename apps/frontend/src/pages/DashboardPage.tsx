import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { agentsApi } from '@/api/agents';
import { sessionsApi } from '@/api/sessions';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, Bot, MessageSquare, Trash2 } from 'lucide-react';
import type { Agent } from '@/types';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    systemPrompt: 'You are a helpful AI assistant.',
  });

  // Fetch agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.getAll,
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: agentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setIsCreateModalOpen(false);
      setNewAgent({ name: '', description: '', systemPrompt: 'You are a helpful AI assistant.' });
      toast.success('Agent created successfully!');
    },
    onError: () => {
      toast.error('Failed to create agent');
    },
  });

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: agentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success('Agent deleted');
    },
    onError: () => {
      toast.error('Failed to delete agent');
    },
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: sessionsApi.create,
    onSuccess: (session) => {
      navigate(`/chat/${session._id}`);
    },
    onError: () => {
      toast.error('Failed to create session');
    },
  });

  const handleCreateAgent = () => {
    if (!newAgent.name) {
      toast.error('Agent name is required');
      return;
    }
    createAgentMutation.mutate({
      name: newAgent.name,
      description: newAgent.description,
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        systemPrompt: newAgent.systemPrompt,
        maxTokens: 1000,
      },
    });
  };

  const handleStartChat = (agent: Agent) => {
    createSessionMutation.mutate({ agentId: agent._id });
  };

  const handleDeleteAgent = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgentMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your AI Agents</h1>
            <p className="mt-1 text-gray-600">Create and manage your AI assistants</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create Agent
          </Button>
        </div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Bot className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No agents yet</h3>
              <p className="mt-2 text-gray-600">Get started by creating your first AI agent</p>
              <Button className="mt-6" onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={20} className="mr-2" />
                Create Your First Agent
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Bot className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.config.model}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAgent(agent._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {agent.description || 'No description'}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-500 mb-1">System Prompt:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{agent.config.systemPrompt}</p>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleStartChat(agent)}
                    isLoading={createSessionMutation.isPending}
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Start Chat
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Create Agent Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Agent"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="Agent Name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              placeholder="e.g., Customer Support Agent"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                placeholder="What does this agent do?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Prompt
              </label>
              <textarea
                value={newAgent.systemPrompt}
                onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                placeholder="You are a helpful AI assistant..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateAgent}
                isLoading={createAgentMutation.isPending}
                className="flex-1"
              >
                Create Agent
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
