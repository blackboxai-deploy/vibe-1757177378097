"use client";

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AISettingsProps {
  children: React.ReactNode;
}

export default function AISettings({ children }: AISettingsProps) {
  const { state, dispatch } = useApp();
  const [localConfig, setLocalConfig] = useState(state.aiConfig);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_AI_CONFIG', payload: localConfig });
  };

  const handleReset = () => {
    const defaultConfig = {
      model: 'openrouter/anthropic/claude-sonnet-4',
      systemPrompt: 'You are a helpful AI assistant. Be concise, friendly, and informative in your responses.',
      temperature: 0.7,
      maxTokens: 2000,
    };
    setLocalConfig(defaultConfig);
    dispatch({ type: 'UPDATE_AI_CONFIG', payload: defaultConfig });
  };

  const modelOptions = [
    { value: 'openrouter/anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
    { value: 'openrouter/openai/gpt-4o', label: 'GPT-4o' },
    { value: 'openrouter/anthropic/claude-haiku', label: 'Claude Haiku' },
    { value: 'openrouter/openai/gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Assistant Settings</DialogTitle>
          <DialogDescription>
            Configure the AI model and behavior for your chat experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model-select">AI Model</Label>
            <Select
              value={localConfig.model}
              onValueChange={(value) => setLocalConfig({ ...localConfig, model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Current: {modelOptions.find(opt => opt.value === localConfig.model)?.label}
            </p>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={localConfig.systemPrompt}
              onChange={(e) => setLocalConfig({ ...localConfig, systemPrompt: e.target.value })}
              placeholder="Define how the AI should behave..."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This defines the AI's personality and behavior. Be specific about the role and tone.
            </p>
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">{localConfig.temperature}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[localConfig.temperature]}
              onValueChange={([value]) => setLocalConfig({ ...localConfig, temperature: value })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Focused (0)</span>
              <span>Creative (1)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              min={100}
              max={4000}
              value={localConfig.maxTokens}
              onChange={(e) => setLocalConfig({ ...localConfig, maxTokens: parseInt(e.target.value) || 2000 })}
            />
            <p className="text-xs text-muted-foreground">
              Maximum length of AI responses (100-4000 tokens)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <div className="space-x-2">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button onClick={handleSave}>Save Settings</Button>
              </DialogTrigger>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}